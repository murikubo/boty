const config = require('../config.json');
const util = require('./util.js');
const yt = require('ytdl-core');
let { google } = require('googleapis');
const musicData = require('../data/music_data.json');
const fs = require('fs');
const _ = require('lodash');

const getTime = (s) => {
    // Pad to 2 or 3 digits, default is 2
    let pad = (n, z = 2) => ('00' + n).slice(-z);
    return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0);
};

const move = (arr, oldIndex, newIndex) => {
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};

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
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    match = match.slice(1).map(function (x) {
        if (x != null) {
            return x.replace(/\D/, '');
        }
    });

    let hours = (parseInt(match[0]) || 0);
    let minutes = (parseInt(match[1]) || 0);
    let seconds = (parseInt(match[2]) || 0);
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

let queue = {}; //json데이터 연계를 위해 큐를 클라이언트 선언 위에 선언했는데, 이상이 있을 경우 위치 바꿔야함.

module.exports = (client) => {

    client.on('message', message => {
        client.setMaxListeners(100);
        let parsed = util.slice(message.content);
        if (message.author.bot) return;
        if (parsed.command != '노래') return;
        if (parsed.param == '추가') {
            message.channel.send('추가할 곡을 입력해주세요.')
                .then(() => {
                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((collected) => {
                            if (!musicData[message.author.id]) musicData[message.author.id] = [];
                            if (musicData[message.author.id].length >= 9) return message.reply('제한인 9개를 초과하였습니다.');
                            musicData[message.author.id].push(collected.first().content);
                            fs.writeFileSync('./data/music_data.json', JSON.stringify(musicData, null, '\t'));
                            message.channel.send('`' + collected.first().content + '` 곡이 추가되었습니다.');
                        }, (err) => {
                            message.channel.send(err.message);
                        })
                        .catch(() => {
                            message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                        });
                });
        }
        if (parsed.param == '리스트' || !parsed.param) {
            if (!musicData[message.author.id] || musicData[message.author.id].length == 0) {
                message.channel.send('리스트가 없습니다. `노래 -추가`로 추가해주세요.');
                return;
            }
            let content = [];
            content.push({
                name: '곡 리스트',
                value: musicData[message.author.id].map((list, index) => `${index + 1}. ${list}\n`).toString().replace(/,/g, '')
            });
            message.channel.send({
                embed: {
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: ' ',
                    color: '3447003',
                    fields: content,
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간'
                    }
                }
            }).then(async (sentMessage) => {
                //console.log(musicData[message.author.id].length);
                //console.log(musicData[message.author.id][0]);
                //console.log(musicData[message.author.id][1]);
                //console.log(musicData[message.author.id][2]);
                for (let i = 1; i <= musicData[message.author.id].length; i++) {
                    await sentMessage.react(i + '⃣')
                        .then(mReaction => {
                            const filter = (reaction, user) => reaction.emoji.name === i + '⃣' && user.id === message.author.id;
                            const collector = sentMessage.createReactionCollector(filter, { time: 15000 });
                            collector.on('collect', reaction => {
                                //console.log(musicData[message.author.id][i-1]);
                                const youtube = new Promise((resolve) => {
                                    let options = {
                                        auth: config.googleApiKey,
                                        part: 'id, snippet',
                                        q: musicData[message.author.id][i - 1],
                                        type: 'video'
                                    };
                                    resolve(options);
                                })
                                    .then((options) => {
                                        return getSearch(options);
                                    })
                                    .then((result) => {
                                        //console.log(result);
                                        //console.log(result[0].id.videoId);
                                        const videoInfo = getVideo(result[0].id.videoId);
                                        let imshiId = result[0].id.videoId;
                                        let imshiTitle = result[0].snippet.title;
                                        //console.log(imshiId);
                                        videoInfo.then((result) => {
                                            sentMessage.edit({
                                                embed: {
                                                    author: {
                                                        name: client.user.username,
                                                        icon_url: client.user.avatarURL
                                                    },
                                                    title: `:ballot_box_with_check:곡이 추가되었어요.`,
                                                    description: result.snippet.title,
                                                    thumbnail: {
                                                        url: result.snippet.thumbnails.high.url
                                                    },
                                                    fields: [
                                                        /*                                                         {
                                                                                                                    name: '아이디',
                                                                                                                    value: imshiId,
                                                                                                                    inline: true
                                                                                                                }, */
                                                        {
                                                            name: '재생 시간',
                                                            value: convertTime(result.contentDetails.duration),
                                                            inline: true
                                                        },
                                                        /*                                                         {
                                                                                                                    name: '채널명',
                                                                                                                    value: result.snippet.channelTitle,
                                                                                                                    inline: true
                                                                                                                },
                                                                                                                {
                                                                                                                    name: '유튜브 바로가기',
                                                                                                                    value: `[링크](https://youtu.be/${imshiId})`,
                                                                                                                    inline: true
                                                                                                                } */
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
                                            if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                            queue[message.guild.id].songs.push({ url: `https://youtu.be/${imshiId}`, title: imshiTitle, requester: message.author.username });
                                            //message.channel.send(`:ballot_box_with_check:**${imshiTitle}** 곡이 리스트에 추가되었습니다.`);

                                        })
                                            .catch((err) => message.channel.send('This is an error: ' + err));
                                    });
                            });
                            collector.on('end', () => sentMessage.clearReactions());
                        });
                }
            });
        }
        if (parsed.param == '삭제') {
            message.channel.send({
                embed: {
                    title: ' ',
                    color: '3447003',
                    fields: [{
                        name: '삭제할 곡의 번호룰 입력해주세요.',
                        value: musicData[message.author.id].map((list, index) => `${index + 1}. ${list}\n`).toString().replace(/,/g, '')
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간'
                    }
                }
            })
                .then(() => {
                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((collected) => {
                            if (collected.first().content == '나가기') throw new Error('취소했습니다.');
                            if (isNaN(parseInt(collected.first().content)) || !musicData[message.author.id][parseInt(collected.first().content) - 1]) throw new Error('올바르지 않은 입력값입니다.');
                            musicData[message.author.id].splice(parseInt(collected.first().content) - 1, 1);
                            fs.writeFileSync('./data/music_data.json', JSON.stringify(musicData, null, '\t'));
                            message.channel.send(collected.first().content + '번 곡이 삭제되었습니다.');
                        })
                        .catch((err) => {
                            if (!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                            else message.channel.send(err.message);
                        });
                });
        }
        if (parsed.param == '일괄삭제') {
            message.channel.send('곡을 전부 날려버리고있어요.')
                .then(() => {
                    if (!musicData[message.author.id] || musicData[message.author.id].length == 0) {
                        message.channel.send('날릴 데이터가 없어요.');
                        return;
                    }
                    musicData[message.author.id] = [];
                    fs.writeFileSync('./data/music_data.json', JSON.stringify(musicData, null, '\t'));
                    message.channel.send('전부 날렸어요.');
                });
        }
        if (parsed.param == '일괄추가') {
            message.channel.send('리스트에 있는 곡을 일괄추가중...')
                .then(() => {
                    if (!musicData[message.author.id] || musicData[message.author.id].length == 0) {
                        message.channel.send('추가할 곡이 없어요.');
                        return;
                    }
                    for (let i = 0; i <= musicData[message.author.id].length - 1; i++) {
                        const youtube = new Promise((resolve) => {
                            let options = {
                                auth: config.googleApiKey,
                                part: 'id, snippet',
                                q: musicData[message.author.id][i],
                                type: 'video'
                            };
                            resolve(options);
                        })
                            .then((options) => {
                                return getSearch(options);
                            })
                            .then((result) => {
                                const videoInfo = getVideo(result[0].id.videoId);
                                let imshiId = result[0].id.videoId;
                                let imshiTitle = result[0].snippet.title;
                                if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                queue[message.guild.id].songs.push({ url: `https://youtu.be/${imshiId}`, title: imshiTitle, requester: message.author.username });
                            });
                    }
                    message.channel.send(`:ballot_box_with_check:총 **${musicData[message.author.id].length}** 곡이 리스트에 추가되었습니다.`);
                });
        }
        if (parsed.param == '바삭' && parsed.content != '') {
            if (parsed.content == '나가기') return message.channel.send('취소했습니다.');
            if (isNaN(parseInt(parsed.content)) || !musicData[message.author.id][parseInt(parsed.content) - 1]) return message.channel.send('올바르지 않은 입력값입니다.');
            musicData[message.author.id].splice(parseInt(parsed.content) - 1, 1);
            fs.writeFileSync('./data/music_data.json', JSON.stringify(musicData, null, '\t'));
            message.channel.send(parsed.content + '번 곡이 삭제되었습니다.');
        }
        if (parsed.param == '변경') {
            message.channel.send({
                embed: {
                    title: ' ',
                    color: '3447003',
                    fields: [{
                        name: '변경할 곡의 번호룰 입력해주세요.',
                        value: musicData[message.author.id].map((list, index) => `${index + 1}. ${list}\n`).toString().replace(/,/g, '')
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간'
                    }
                }
            })
                .then(() => {
                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((collected) => {
                            if (collected.first().content == '나가기') throw new Error('취소했습니다.');
                            if (isNaN(parseInt(collected.first().content)) || !musicData[message.author.id][parseInt(collected.first().content) - 1]) throw new Error('올바르지 않은 입력값입니다.');
                            let selectedList = parseInt(collected.first().content) - 1;
                            message.channel.send(`${selectedList + 1}번 노래를 선택하셨습니다. 변경할 노래를 입력해주세요. \n\n기존 입력값: ${musicData[message.author.id][selectedList]}`)
                                .then(() => {
                                    const filter = m => m.author.id === message.author.id;
                                    message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                        .then((collected) => {
                                            musicData[message.author.id][selectedList] = collected.first().content;
                                            fs.writeFileSync('./data/music_data.json', JSON.stringify(musicData, null, '\t'));
                                            message.channel.send('`' + collected.first().content + '` 곡으로 변경되었습니다.');

                                        });
                                });
                        })
                        .catch((err) => {
                            if (!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                            else message.channel.send(err.message);
                        });
                });
        }
        if (parsed.param == '이동' && parsed.content != '') {
            let changeNumber = parsed.content.split(',');
            if (isNaN(parseInt(changeNumber[0])) || isNaN(parseInt(changeNumber[1])) || !musicData[message.author.id][parseInt(changeNumber[0]) - 1] || !musicData[message.author.id][parseInt(changeNumber[1]) - 1]) {
                message.channel.send('올바르지 않은 입력값입니다.');
                return;
            }
            musicData[message.author.id] = move(musicData[message.author.id], parseInt(changeNumber[0]) - 1, parseInt(changeNumber[1]) - 1);
            fs.writeFileSync('./data/music_data.json', JSON.stringify(musicData, null, '\t'));
            message.channel.send(`${changeNumber[0]}번 곡을 ${changeNumber[1]}번으로 이동하였습니다.`);

        }
    });
    let dispatcher;
    const commands = {
        '일시정지' : (message) => {
            if (!message.member.voiceChannel) return message.channel.send('음성채널에 들어간 상태여야해요.');
            if (!dispatcher) return message.channel.send('현재 재생중인 목록이 없어요.');
            message.channel.send('일시정지했어요.').then(() => { dispatcher.pause(); });
        },
        '계속' : (message) => {
            if (!message.member.voiceChannel) return message.channel.send('음성채널에 들어간 상태여야해요.');
            if (!dispatcher) return message.channel.send('현재 재생중인 목록이 없어요.');
            message.channel.send('계속할게요.').then(() => { dispatcher.resume(); });
        },
        '볼륨' : (message) => {
            let parsed = util.slice(message.content);
            if (!message.member.voiceChannel) return message.channel.send('음성채널에 들어간 상태여야해요.');
            if (!dispatcher) return message.channel.send('현재 재생중인 목록이 없어요.');
            if (isNaN(parseInt(parsed.content)) || parseInt(parsed.content) > 100 || parseInt(parsed.content) < 0) return message.channel.send('0 ~ 100 사이 정수를 입력해주세요.');
            dispatcher.setVolume(Math.max((parseInt(parsed.content) / 50)));
            message.channel.send(`현재 볼륨: ${Math.round(dispatcher.volume * 50)}%`);
        },
        '스킵' : (message) => {
            if (!message.member.voiceChannel) return message.channel.send('음성채널에 들어간 상태여야해요.');
            if (!dispatcher) return message.channel.send('현재 재생중인 목록이 없어요.');
            message.channel.send('스킵했어요.').then(() => { dispatcher.end(); });
        },
        /* '현재' : (message) => {
            if (!message.member.voiceChannel) return message.channel.send('음성채널에 들어간 상태여야해요.');
            if (!dispatcher) return message.channel.send('현재 재생중인 목록이 없어요.');
            const youtube = new Promise((resolve) => {
                let options = {
                    auth: config.googleApiKey,
                    part: 'id, snippet',
                    q: song.url,
                    type: 'video'
                };
                resolve(options);
            })
                .then((options) => {
                    return getSearch(options);
                })
                .then((result) => {
                    let fomatted = [];
                    let id = [];
                    let typeCase = () => {
                        return result[0].id.videoId;
                    };
                    fomatted.push({
                        name: parseInt(0) + '. ' + result[0].snippet.title,
                        value: `아이디: ${typeCase()}`
                    });
                    id.push(typeCase());
                    return [fomatted, id];
                })
                .then(([fields, id]) => {
                    const videoInfo = getVideo(id[0]);
                    let url = id[0];
                    if (url == '' || url === undefined) return message.channel.send('검색 결과를 찾을 수 없습니다.');
                    videoInfo.then((result) => {
                        message.channel.send({
                            embed: {
                                author: {
                                    name: client.user.username,
                                    icon_url: client.user.avatarURL
                                },
                                title: result.snippet.title,
                                thumbnail: {
                                    url: result.snippet.thumbnails.high.url
                                },
                                fields: [
                                    {
                                        name: '추가자',
                                        value: `${song.requester}`,
                                        inline: true
                                    },
                                    {
                                        name: '재생 시간',
                                        value: `${getTime(dispatcher.time)} / ${convertTime(result.contentDetails.duration)}`,
                                        inline: true
                                    },
                                ],
                                color: '3447003',
                                timestamp: new Date(),
                                footer: {
                                    icon_url: client.user.avatarURL,
                                    text: '명령어 입력 시간'
                                }
                            }
                        })
                    })
                        .catch((err) => message.channel.send('error: ' + err));
                })
                .catch((err) => {
                    message.channel.send('error: ' + err);
                });
        }, */
        '재생': (message) => {
            if (queue[message.guild.id] === undefined) return message.channel.send('곡을 추가해주세요.');
            if (!message.guild.voiceConnection) return message.member.voiceChannel.join(message).then(() => commands.재생(message));
            if (queue[message.guild.id].playing) return message.channel.send('이미 재생중이에요.');
            queue[message.guild.id].playing = true;

            (function play(song) {
                if (song === undefined) return message.channel.send('재생목록이 없어요.').then(() => {
                    queue[message.guild.id].playing = false;
                    message.member.voiceChannel.leave();
                });
                if (!message.guild.voiceConnection) return dispatcher.end();
                message.channel.send(`:musical_note:**현재 재생중** ${song.title}`);
                dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes: config.passes, bitrate: 320, fec: true });
                dispatcher.on('end', () => {
                    collector.stop();
                    play(queue[message.guild.id].songs.shift());
                });
                dispatcher.on('error', (err) => {
                    return message.channel.send('error: ' + err).then(() => {
                        collector.stop();
                        play(queue[message.guild.id].songs.shift());
                    });
                });
            })(queue[message.guild.id].songs.shift());
        },
        '들어와': (message) => {
            return new Promise((resolve, reject) => {
                const voiceChannel = message.member.voiceChannel;
                if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('음성채널에 들어갈 수 없어요.');
                voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
            });
        },
        '커스텀': (message) => {
            let Attachment = (message.attachments).array();

            if (message.member.voiceChannel) {
                message.member.voiceChannel.join()
                    .then(connection => {
                        message.channel.send(`:musical_note:**현재 재생중** ${Attachment[0].filename}`);
                        dispatcher = connection.playArbitraryInput(`${Attachment[0].url}`, { passes: config.passes, bitrate: 320, fec: true });
                        dispatcher.on('end', () => {
                            message.member.voiceChannel.leave();
                        });
                        dispatcher.on('error', (err) => {
                            return message.channel.send('error: ' + err).then(() => {
                                message.member.voiceChannel.leave();
                            });
                        });
                    }).catch((err) => message.channel.send('This is an error: ' + err));
            } else {
                message.reply('이 명령어는 음성채널 안에서만 가능해요!');
            }
        },
        '추가': (message) => {
            let url = message.content.split(' ')[1];
            if (url == '' || url === undefined) return message.channel.send('유튜브 URL주소를 프리픽스+명령어 와 함께 입력해주세요.');

            const parsedMessage = util.slice(message.content);
            if (!(parsedMessage.command == '추가')) {
                return;
            }

            const youtube = new Promise((resolve) => {
                let options = {
                    auth: config.googleApiKey,
                    part: 'id, snippet',
                    q: parsedMessage.content,
                    type: 'video'
                };
                if (parsedMessage.param == 'p') {
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
                    let typeCase = () => {
                        if (parsedMessage.param == 'p') return result[0].id.playlistId;
                        else return result[0].id.videoId;
                    };
                    fomatted.push({
                        name: parseInt(0) + '. ' + result[0].snippet.title,
                        value: `아이디: ${typeCase()}`
                    });
                    id.push(typeCase());
                    return [fomatted, id];
                })
                .then(([fields, id]) => {
                    const videoInfo = getVideo(id[0]);
                    let url = id[0];
                    if (url == '' || url === undefined) return message.channel.send('검색 결과를 찾을 수 없습니다.');
                    yt.getInfo(url, (err, info) => {
                        //if (err) return message.channel.send('올바르지 않은 링크입니다.: ' + err);
                        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                        queue[message.guild.id].songs.push({ url: url, title: info.title, requester: message.author.username });
                        //message.channel.send(`:ballot_box_with_check:**${info.title}** 곡이 리스트에 추가되었습니다.`);
                        if (!message.member.voiceChannel) return message.channel.send('곡을 재생하려면 음성채널에 먼저 들어가주세요.');
                        else {
                            if (!message.guild.voiceConnection) return message.member.voiceChannel.join(message).then(() => commands.재생(message));
                        }
                    });
                    videoInfo.then((result) => {
                        message.channel.send({
                            embed: {
                                author: {
                                    name: client.user.username,
                                    icon_url: client.user.avatarURL
                                },
                                title: `:ballot_box_with_check:곡이 추가되었어요.`,
                                description: result.snippet.title,
                                thumbnail: {
                                    url: result.snippet.thumbnails.high.url
                                },
                                fields: [
                                    /*                                     {
                                                                            name: '추가자',
                                                                            value: `${message.author.username}`,
                                                                            inline: true
                                                                        }, */
                                    {
                                        name: '재생 시간',
                                        value: convertTime(result.contentDetails.duration),
                                        inline: true
                                    },
                                    /*                                     {
                                                                            name: '채널명',
                                                                            value: result.snippet.channelTitle,
                                                                            inline: true
                                                                        },
                                                                        {
                                                                            name: '아이디',
                                                                            value: id[0],
                                                                            inline: true
                                                                        } */
                                ],
                                color: '3447003',
                                timestamp: new Date(),
                                footer: {
                                    icon_url: client.user.avatarURL,
                                    text: '명령어 입력 시간'
                                }
                            }
                        })
                    })
                        .catch((err) => message.channel.send('This is an error: ' + err));
                })
                .catch((err) => {
                    message.channel.send('This is an error: ' + err);
                });
        },
        '지정삭제': (message) => {
            if (queue[message.guild.id] === undefined) return message.channel.send('리스트에 .명령어 + 링크 를 통하여 곡을 추가하세요.');
            let tosend = [];
            queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i + 1}. ${song.title} - 재생자: ${song.requester}`); });
            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: `삭제할 곡을 선택해주세요.`,
                    fields: [{
                        name: '곡 리스트',
                        value: `${tosend.slice(0, 15).join('\n')}`
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            })
                .then(() => {
                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((collected) => {
                            if (collected.first().content == '나가기') throw new Error('취소했어요.');
                            if (isNaN(parseInt(collected.first().content)) || !queue[message.guild.id].songs[parseInt(collected.first().content) - 1]) throw new Error('올바르지 않은 입력값입니다.');
                            message.channel.send(`**${queue[message.guild.id].songs[parseInt(collected.first().content) - 1].title}**\n:ballot_box_with_check:해당 곡이 삭제되었습니다.`);
                            queue[message.guild.id].songs.splice(parseInt(collected.first().content) - 1, 1);
                        })
                        .catch((err) => {
                            if (!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                            else message.channel.send(err.message);
                        });
                });
        },
        '삭제': (message) => {
            const parsedMessage = util.slice(message.content);
            if (!parsedMessage.command == '삭제' || parsedMessage.content == '') {
                return;
            }
            if (queue[message.guild.id] === undefined) return message.channel.send('리스트에 .명령어 + 링크 를 통하여 곡을 추가하세요.');
            let tosend = [];
            queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i + 1}. ${song.title} - 재생자: ${song.requester}`); });
            if (isNaN(parseInt(parsedMessage.content)) || !queue[message.guild.id].songs[parseInt(parsedMessage.content) - 1]) return message.channel.send('올바르지 않은 입력값입니다.');
            message.channel.send(`**${queue[message.guild.id].songs[parseInt(parsedMessage.content) - 1].title}**\n:ballot_box_with_check:해당 곡이 삭제되었습니다.`);
            queue[message.guild.id].songs.splice(parseInt(parsedMessage.content) - 1, 1);
        },
        '일괄삭제': (message) => {
            const parsedMessage = util.slice(message.content);
            if (queue[message.guild.id] === undefined) return message.channel.send('리스트에 .명령어 + 링크 를 통하여 곡을 추가하세요.');
            let tosend = [];
            queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i + 1}. ${song.title} - 재생자: ${song.requester}`); });
            queue = {};
            message.channel.send(':ballot_box_with_check:리스트에 있는 곡을 일괄삭제했어요.');
        },
        '리스트': (message) => {
            if (queue[message.guild.id] === undefined) return message.channel.send('리스트에 .명령어 + 링크 를 통하여 곡을 추가하세요.');
            let tosend = [];
            queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i + 1}. ${song.title}`); });
            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: `현재 리스트에 **${tosend.length}** 개의 곡이 있습니다. ${(tosend.length > 15 ? '*[제한인 15개를 초과하였습니다.]*' : '')}\n`,
                    fields: [{
                        name: '곡 리스트',
                        value: `${tosend.slice(0, 15).join('\n')}`
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        },
        '검색': (message) => {
            const parsedMessage = util.slice(message.content);
            if (!(parsedMessage.command == '검색')) {
                return;
            }

            const youtube = new Promise((resolve) => {
                let options = {
                    auth: config.googleApiKey,
                    part: 'id, snippet',
                    q: parsedMessage.content,
                    type: 'video'
                };
                if (parsedMessage.param == 'p') {
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
                    for (let i in result) {
                        let typeCase = () => {
                            if (parsedMessage.param == 'p') return result[i].id.playlistId;
                            else return result[i].id.videoId;
                        };
                        fomatted.push({
                            name: parseInt(i) + 1 + '. ' + result[i].snippet.title,
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
                            if (parsedMessage.param == 'p') {
                                return;
                            }

                            for (let i = 1; i <= id.length; i++) {
                                await sentMessage.react(i + '⃣')
                                    .then(mReaction => {
                                        const filter = (reaction, user) => reaction.emoji.name === i + '⃣' && user.id === message.author.id;
                                        const collector = sentMessage.createReactionCollector(filter, { time: 15000 });
                                        collector.on('collect', reaction => {
                                            const videoInfo = getVideo(id[i - 1]);
                                            let url = id[i - 1];
                                            if (url == '' || url === undefined) return message.channel.send('검색 결과를 찾을 수 없습니다.');
                                            yt.getInfo(url, (err, info) => {
                                                if (err) return message.channel.send('올바르지 않은 링크입니다.: ' + err);
                                                if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                                queue[message.guild.id].songs.push({ url: url, title: info.title, requester: message.author.username });
                                                //message.channel.send(`:ballot_box_with_check:**${info.title}** 곡이 리스트에 추가되었습니다.`);
                                                if (!message.member.voiceChannel) return message.channel.send('곡을 재생하려면 음성채널에 먼저 들어가주세요.');
                                                else {
                                                    if (!message.guild.voiceConnection) return message.member.voiceChannel.join(message).then(() => commands.재생(message));
                                                }
                                            });
                                            videoInfo.then((result) => {
                                                sentMessage.edit({
                                                    embed: {
                                                        author: {
                                                            name: client.user.username,
                                                            icon_url: client.user.avatarURL
                                                        },
                                                        title: `:ballot_box_with_check:곡이 추가되었어요.`,
                                                        description: result.snippet.title,
                                                        thumbnail: {
                                                            url: result.snippet.thumbnails.high.url
                                                        },
                                                        fields: [
                                                            /*                                                             {
                                                                                                                            name: '추가자',
                                                                                                                            value: `${message.author.username}`,
                                                                                                                            inline: true
                                                                                                                        }, */
                                                            {
                                                                name: '재생 시간',
                                                                value: convertTime(result.contentDetails.duration),
                                                                inline: true
                                                            },
                                                            /*                                                             {
                                                                                                                            name: '채널명',
                                                                                                                            value: result.snippet.channelTitle,
                                                                                                                            inline: true
                                                                                                                        },
                                                                                                                        {
                                                                                                                            name: '아이디',
                                                                                                                            value: id[0],
                                                                                                                            inline: true
                                                                                                                        } */
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
                                    });
                            }
                        });
                })
                .catch((err) => {
                    message.channel.send('This is an error: ' + err);
                });
        },
        '도움': (message) => {
            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: '음악 명령어 일람',
                    fields: [{
                        name: '추가 + 유튜브 링크/영상의 ID',
                        value: '큐에 유튜브 링크를 총 15개까지 넣어둘 수 있어요.'
                    },
                    {
                        name: '재생',
                        value: '자신이 채널에 들어가 있을 경우 큐에 넣어뒀던 음악들을 재생합니다.'
                    },
                    {
                        name: '리스트',
                        value: '큐에 넣어뒀던 링크들을 보여줍니다.'
                    },
                    {
                        name: '일시정지/계속/스킵',
                        value: '말 안 해도 아실거라 믿어요.'
                    },
                    {
                        name: '재생시간',
                        value: '현재 재생하고 있는 영상이 얼마만큼 흘렀는지 알려줍니다.'
                    },
                    {
                        name: '크게+/작게-',
                        value: '크게는 `+`기호 하나당 2%씩 소리를 늘리고 작게는 `-`기호 하나당 소리를 2%씩 소리를 줄입니다.'
                    },
                    {
                        name: '볼륨 + 정수',
                        value: '0~100%의 값을 입력하여 볼륨을 설정합니다.'
                    },
                    {
                        name: '들어와/나가',
                        value: '강제로 들어오거나 나가게 합니다. 강제로 나가게 할 경우 재생 기능이 중지됩니다.'
                    },
                    {
                        name: '삭제 + 번호/지정삭제',
                        value: '리스트의 해당 곡을 삭제합니다.'
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        },
        '나가': (message) => {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.leave();
                message.channel.send('네 나갈게요...');
            } else {
                return;
            }
        },
    };

    client.on('message', message => {
        if (!message.content.startsWith(config.prefix)) return;
        if (commands.hasOwnProperty(message.content.toLowerCase().slice(config.prefix.length).split(' ')[0])) commands[message.content.toLowerCase().slice(config.prefix.length).split(' ')[0]](message);
    });
}
