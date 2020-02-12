const util = require('../util.js');
const date = require('date-and-time');
const axios = require('axios');
const Crawler = require('crawler');

const namuCommand = ['나무위키', '나뮈키', '나무'];

let newRelease = async (date) => {

    return axios({
        url: 'http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=' + date,
        method: 'GET',
        responseType: 'arraybuffer' 
    }).then((res) => {
        let bookarr = res.data.split(/<a href='\.\.\/shop\/item.php\?it_id=/g);
        //let bookarr = res.data.split(/<a href='http:\/\/booksaetong.co.kr\/'/g);
        bookarr.splice(0,1);
        for(let i = 0; i <= bookarr.length-1; i++) {
            bookarr[i] = bookarr[i].split('\n')[0];
        }
        return bookarr;
        
    }).then((bookarr) => {
        let bookobj = [];
        for(let i = 0; i < bookarr.length; i++) {
            bookobj[i] = {
                name: `${bookarr[i].slice(bookarr[i].search(/'>/)+2, bookarr[i].search('</a>'))}`,
                id: `${bookarr[i].slice(0,bookarr[i].search(/'>/))}`,
                saleprice: `${bookarr[i].slice(bookarr[i].search('<span class=amount>')+19, bookarr[i].search('</span>'))}`
            };
        }
        return bookobj;
    }).then((bookobj) => {
        let returnobj = {};
        returnobj.arr = [];
        for(let i = 0; i < bookobj.length; i++) {
            returnobj.arr[i] = {
                name: bookobj[i].name,
                value: `판매가: ${bookobj[i].saleprice}
                [제품상세페이지](http://booksaetong.co.kr/shop/item.php?it_id=${bookobj[i].id})`,
                inline: true
            };
        }
        returnobj.arr = util.arrayCut(returnobj.arr);
        returnobj.message = {};
        returnobj.message.embed = {
            author: {
                name: 1 + '/' + returnobj.arr.length + ' 페이지',
            },
            title: date + ' 의 신간',
            url: 'http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=' + date,
            color: '3447003',
            fields: returnobj.arr[0],
            timestamp: new Date()
        };
        if(returnobj.arr.length == 0) {
            returnobj.message.embed.fields = [{
                name: '신간 페이지가 존재하지 않습니다.',
                value: '아직 정보가 갱신되지 않았거나 해당 날짜의 신간이 존재하지 않습니다.'
            }];
        }
        return returnobj;
        
    }).catch((err) => {
        console.error(err);
    });
};

/*
return axios({
    url: 'http://booksaetong.co.kr',
    method: 'GET',
    responseType: 'arraybuffer' 
}).then(async (res) => {
    let weekarr = res.data.split(/FuncWeekGo/g);
    weekarr.splice(0,2);
    let fields = [];
    for(let i = 0; i <= weekarr.length-1; i++) {
        weekarr[i] = weekarr[i].split('\n')[0].slice(2,12);
    }
    for(let i = 0; i <= weekarr.length-1; i++) {
        fields.push({name: weekarr[i], value: `[링크](http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=${weekarr[i]})`, inline: true});
    }
    let content = {
        embed: {
            title: '북새통 메인 페이지',
            url: 'http://booksaetong.co.kr/',
            color: '3447003',
            fields: fields,
            timestamp: new Date()
        }
    };
    console.log('1')
    return [content, weekarr];
    
}).then(async (content) => {
    
    await message.channel.send(content[0])
        .then(async (sentMessage) =>{

            await sentMessage.react('◀')
            await sentMessage.react('▶')
            await sentMessage.react('❌')
                .then(async () => {
                    const collector = sentMessage.createReactionCollector((reaction, user) => {
                        user.id === message.author.id &&
                        reaction.emoji.name === '◀' ||
                        reaction.emoji.name === '▶' ||
                        reaction.emoji.name === '❌',
                        {time: 30000};
                    }).once('collect', reaction => {
                        const chosen = reaction.emoji.name;
                        if(chosen === '◀'){
                            console.log('a')
                            // Prev page
                        }else if(chosen === '▶'){
                            console.log('b')
                            // Next page
                        }else{
                            console.log('c')
                            // Stop navigating pages
                        }
                    });
                    collector.on('end', () => {
                        sentMessage.clearReactions();
                        collector.stop();
                    });
                });
        });
});
*/

module.exports = (client) => {
    
    client.on('message', async message => {
        let parsed = util.slice(message.content);
        if(parsed.command == '북새통') {
            Promise.resolve()
                .then(async () => {
                    // command parsing phase
                    if(parsed.param == 'h') {
                        message.channel.send(util.embedFormat('북새통 명령어 사용법',[], '`북새통`명령어만 입력하면 오늘의 신간이 나옵니다. \n내용에 `어제`를 입력하면 어제의 신간이 나옵니다. \n내용에 `내일`을 입력하면 내일의 신간이 나옵니다. \n내용에 `YYYY-MM-DD`를 입력하면 해당 날짜의 신간이 나옵니다.'));
                        return;
                    }
                    let now = new Date();
                    let parseDate;
                    if(!parsed.content) parseDate = date.format(now, 'YYYY-MM-DD');
                    else if (parsed.content == '어제') parseDate = date.format(date.addDays(now,-1), 'YYYY-MM-DD'); 
                    else if (parsed.content == '내일') parseDate = date.format(date.addDays(now,1), 'YYYY-MM-DD'); 
                    else if (parsed.content && date.parse(parsed.content, 'YYYY-MM-DD')) parseDate = parsed.content;
                    else if (date.parse(parsed.content, 'YYMMDD')) parseDate = date.format(date.parse(parsed.content, 'YYMMDD'), 'YYYY-MM-DD'); 
                    else  parseDate =  (date.format(now, 'YYYY-MM-DD')); 

                    return await newRelease(parseDate);
                }).then((releaseReturn) => {
                    if(!releaseReturn) return;
                    //more formating phase
                    releaseReturn.message.embed.footer = {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간'
                    };
                    
                    return releaseReturn;
                }).then((releaseReturn) => {
                    if(!releaseReturn) return;
                    //message send phase
                    let index = 0;
                    message.channel.send(releaseReturn.message)
                        .then(async (sentMessage) => {
                            if(releaseReturn.arr.length <= 1 ) {
                                return;
                            }
                            await sentMessage.react('\u2B05')
                                .then(() => {
                                    const collector = sentMessage.createReactionCollector((reaction, user) => reaction.emoji.name === '\u2B05' && user.id === message.author.id);
                                    collector.on('collect', (reaction) => {
                                        if(index!=0)index--;
                                        releaseReturn.message.embed.author.name = index+1 + '/' + releaseReturn.arr.length + ' 페이지';
                                        releaseReturn.message.embed.fields = releaseReturn.arr[index];
                                        sentMessage.edit(releaseReturn.message);
                                        reaction.remove(message.author.id);
                                    });
                                });
                            await sentMessage.react('\u27A1')
                                .then(() => {
                                    const collector = sentMessage.createReactionCollector((reaction, user) => reaction.emoji.name === '\u27A1' && user.id === message.author.id, { time: 30000 });
                                    collector.on('collect', (reaction) => {
                                        if(releaseReturn.arr.length-1>index)index++;
                                        releaseReturn.message.embed.author.name = index+1 + '/' + releaseReturn.arr.length + ' 페이지';
                                        releaseReturn.message.embed.fields = releaseReturn.arr[index];
                                        
                                        sentMessage.edit(releaseReturn.message);
                                        reaction.remove(message.author.id);
                                    });
                                    collector.on('end', () => sentMessage.clearReactions());
                                });
                        });

                }).catch((err) => console.error(err));

        }
        if(namuCommand.includes(parsed.command)) {
            let helpcommand = ['help', '도움말', '가이드', 'h'];
            if(helpcommand.includes(parsed.param)) {
                message.channel.send(util.embedFormat('나무위키 명령어 사용법',[], '`나무위키` 혹은 `나뮈키` 혹은 `나무`와 `내용`을 입력하여 나무위키에서 찾습니다. \n만약 `내용`의 문서가 존재한다면 다이렉트 링크를 출력합니다. \n`내용`과 같은 문서가 없다면 검색 결과를 출력합니다. \n 다이렉트를 무시하고 검색만 하려면 `-검색`을 내용 전에 추가해야합니다.' ));
                return;
            }
            if(!parsed.content) return;
            let searchUrl = 'https://namu.wiki/search/'+encodeURI(parsed.content);
            let directUrl = 'https://namu.wiki/w/'+encodeURI(parsed.content);
            let namu = new Crawler({
                maxConnections: 1,
                retries: 0
            }); 
            let search = {
                uri: searchUrl,

                callback: (error,res,done) => {
                    if(error) {
                        message.channel.send('Error message from request: ' + error.message);
                        throw error;
                    } else {
                        Promise.resolve()
                            .then(() => {
                                const $ = res.$;
                                let item = $('.search-item');
                                if(!item.length) {
                                    message.channel.send({
                                        embed: {
                                            author: {
                                                name: client.user.username,
                                                icon_url: client.user.avatarURL
                                            },
                                            title: parsed.content + ' 검색 결과',
                                            description: '검색 결과가 없습니다.',
                                            url: searchUrl,
                                            color: '3447003',
                                            timestamp: new Date(),
                                            footer: {
                                                icon_url: client.user.avatarURL,
                                                text: '명령어 입력 시간'
                                            }
                                        }
                                    });
                                    throw new Error('no result');
                                    
                                }
                                let crawldata = [];
                                for(let i = 0; i < 5; i++){
                                    crawldata[i] = {};
                                    crawldata[i].name = item[i].children[0].next.children[1].children[2].data;
                                    crawldata[i].hyperlink = 'https://namu.wiki' + item[i].children[0].next.children[1].attribs.href;
                                    crawldata[i].hyperlink = crawldata[i].hyperlink.replace(/\(/g, '%28');
                                    crawldata[i].hyperlink = crawldata[i].hyperlink.replace(/\)/g, '%29');
                                    let description = '';
                                    let contentarr = item[i].children[0].next.next.next.children;
                                    for(let j = 0; j < contentarr.length; j++) {
                                        if(crawldata[i].name.search('파일:') != -1) {
                                            description = '[여기에 파일 설명을 입력].';
                                            break;
                                        }
                                        else if(!contentarr[j].data) description += contentarr[j].children[0].data;
                                        else description += contentarr[j].data;
                                    }
                                    crawldata[i].description = description;
                                }
                                return crawldata;
                            })
                            .then((crawldata) => {
                                let fields = [];
                                for(let i =0; i < crawldata.length; i++) {
                                    fields.push({
                                        name: crawldata[i].name,
                                        value: '[바로가기]('+crawldata[i].hyperlink+')\n' + crawldata[i].description
                                    });
                                }
                                return fields;
                            })
                            .then((fields) => {
                                let embedObj = {
                                    embed: {
                                        author: {
                                            name: client.user.username,
                                            icon_url: client.user.avatarURL
                                        },
                                        title: parsed.content + ' 검색 결과',
                                        url: searchUrl,
                                        color: '3447003',
                                        fields: fields,
                                        timestamp: new Date(),
                                        footer: {
                                            icon_url: client.user.avatarURL,
                                            text: '명령어 입력 시간'
                                        }
                                    }
                                };
                                message.channel.send(embedObj);
                                done();
                            })
                            .catch((err) => {
                                if(err.message == 'no result') return; 
                                console.error(err.message);
                                done();
                            });
                    }
                }
            };
            if(parsed.param == '검색') namu.queue(search);
            else {
                Promise.resolve()
                    .then(async () => {
                        await namu.queue({
                            uri: directUrl,
                            callback: (error,res, done) => {
                                let $ = res.$;
                                if( $('.wiki-inner-content').children('p').text().search('해당 문서를 찾을 수 없습니다.') == -1 ) {
                                    message.channel.send({
                                        embed: {
                                            author: {
                                                name: client.user.username,
                                                icon_url: client.user.avatarURL
                                            },
                                            title: parsed.content + '문서 바로가기',
                                            url: directUrl,
                                            color: '3447003',
                                            timestamp: new Date(),
                                            footer: {
                                                icon_url: client.user.avatarURL,
                                                text: '명령어 입력 시간'
                                            }
                                        }
                                    });
                                } else {
                                    namu.queue(search);
                                }
                                done();
                            }
                        });
                    });
            }
        }
    });

};
//const iconv = require('iconv').Iconv;
/*

const fs = require('fs');
const Crawler = require('crawler');

module.exports = (client) => {
    client.on('message', message => {
        let parsed = util.slice(message.content);
        if(parsed.command == '북새통') {
            let c = new Crawler({
                maxConnections : 10,
                // This will be called for each crawled page
                callback : function (error, res, done) {
                    if(error){
                        console.log(error);
                    }else{
                        var $ = res.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        console.log($('title').text());
                    }
                    done();
                }
            })

            c.queue('http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=2019-01-10');
        }
    });
};
*/