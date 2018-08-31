let {google} = require('googleapis');
const config = require('../../config.json');
const util = require('../util.js');

async function getSearch(options) {
    let service = google.youtube('v3');
    return await new Promise((resolve, reject) => {
        service.search.list(options, (err, response) => {
            if (err) {
                reject(err);
            }
            let result = response.data.items;
            if (result.length == 0) {
                reject('No result found.');
            } else {
                resolve(result);
            }   
        });
    });
}

function convertTime(duration) {
    var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
    match = match.slice(1).map(function(x) {
        if (x != null) {
            return x.replace(/\D/, '');
        }
    });
    
    var hours = (parseInt(match[0]) || 0);
    var minutes = (parseInt(match[1]) || 0);
    var seconds = (parseInt(match[2]) || 0);
    return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
}

async function getVideo(id) {
    let options = {
        auth: config.googleApiKey,
        part: 'id, snippet, contentDetails',
        id: id,
    };
    let service = google.youtube('v3');
    return await new Promise((resolve, reject) => {
        service.videos.list(options, (err, response) => {
            if (err) {
                reject(err);
            }
            let result = response.data.items;
            if (result.length == 0) {
                reject('No result found.');
            } else {
                resolve(result[0]);
            }   
        });
    });
}


module.exports = (client) => {
    client.on('message', message => {
        const parsedMessage = util.slice(message.content);
        if(!(parsedMessage.command == '유튜브' || parsedMessage.command == '유튭')) {
            return;
        }
        
        const youtube = new Promise((resolve) => { 
            let options = {
                auth: config.googleApiKey,
                part: 'id, snippet',
                q: parsedMessage.content,
                type: 'video'
            };
            if(parsedMessage.param == 'p') {
                options.type = 'playlist';
            }
            resolve(options);
        })
            .then((options) => {
                return getSearch(options);
            })
            .then((result) => {
                let fomatted = [];
                let id = [];
                for(let i in result) {
                    let typeCase = () => {
                        if(parsedMessage.param == 'p') return 'https://www.youtube.com/playlist?list=' + result[i].id.playlistId;
                        else return result[i].id.videoId;
                    };
                    fomatted.push({
                        name: parseInt(i)+1 + '. ' + result[i].snippet.title,
                        value: `아이디: ${typeCase()}` 
                    });
                    id.push(typeCase());
                }
                return [fomatted, id];
            })
            .then(([fields, id]) => {
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: parsedMessage.content + ' 검색 결과:',
                        color: '3447003',
                        fields: fields,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                })
                    .then(async (sentMessage) => {
                        if(parsedMessage.param == 'p') {
                            return;
                        }

                        for(let i = 1; i <= id.length; i++) {
                            await sentMessage.react(i+'⃣')
                                .then(mReaction => {
                                    const filter = (reaction, user) => reaction.emoji.name === i+'⃣' && user.id === message.author.id;
                                    const collector = sentMessage.createReactionCollector(filter, { time: 15000 });
                                    collector.on('collect', reaction => {
                                        const videoInfo = getVideo(id[i-1]);
                                        videoInfo.then((result) => {
                                            sentMessage.edit({
                                                embed: {
                                                    author: {
                                                        name: client.user.username,
                                                        icon_url: client.user.avatarURL
                                                    },
                                                    title: result.snippet.title,
                                                    description: result.snippet.description.slice(0,50) + '...',
                                                    thumbnail: {
                                                        url: result.snippet.thumbnails.high.url
                                                    },
                                                    fields: [
                                                        {
                                                            name: '아이디',
                                                            value: id[i-1],
                                                            inline: true
                                                        },
                                                        {
                                                            name: '재생 시간',
                                                            value: convertTime(result.contentDetails.duration),
                                                            inline: true
                                                        },
                                                        {
                                                            name: '채널명',
                                                            value: result.snippet.channelTitle,
                                                            inline: true
                                                        },
                                                        {
                                                            name: '유튜브 바로가기',
                                                            value: `[링크](https://youtu.be/${id[i-1]})`,
                                                            inline: true
                                                        }
                                                    ],
                                                    color: '3447003',
                                                    timestamp: new Date(),
                                                    footer: {
                                                        icon_url: client.user.avatarURL,
                                                        text: '명령어 입력 시간'
                                                    }
                                                }
                                            })
                                                .then(() => collector.stop());
                                            
                                        })
                                            .catch((err) => message.channel.send('This is an error: ' + err));
                                    });
                                    collector.on('end', () => sentMessage.clearReactions());
                                });
                        }
                    });
            })    
            .catch((err) => {
                message.channel.send('This is an error: ' + err);
            });
    });
};