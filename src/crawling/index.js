const util = require('../util.js');
const date = require('date-and-time');
const axios = require('axios');
const Crawler = require('crawler');

const namuCommand = ['나무위키', '나뮈키', '나무']

module.exports = (client) => {
    
    client.on('message', message => {
        let parsed = util.slice(message.content);
        if(parsed.command == '북새통') {
            if(parsed.param) {
                message.channel.send(util.embedFormat('북새통 명령어 사용법',[], '`북새통`명령어만 입력하면 오늘의 신간이 나옵니다. \n내용에 `내일`을 입력하면 내일의 신간이 나옵니다. \n내용에 `YYYY-MM-DD`를 입력하면 해당 날짜의 신간이 나옵니다.'));
                return;
            }
            let now = new Date();
            let day;
            if(!parsed.content) day = date.format(now, 'YYYY-MM-DD');
            else if (parsed.content == '내일') day = date.format(date.addDays(now,1), 'YYYY-MM-DD');
            else if (parsed.content && date.parse(parsed.content, 'YYYY-MM-DD')) day = parsed.content;
            else day = date.format(now, 'YYYY-MM-DD');
            axios({
                url: 'http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=' + day,
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
                        realprice: `${bookarr[i].slice(bookarr[i].search('<strike>')+8, bookarr[i].search('</strike>'))}`,
                        saleprice: `${bookarr[i].slice(bookarr[i].search('<span class=amount>')+19, bookarr[i].search('</span>'))}`
                    };
                }
                return bookobj;
            }).then((bookobj) => {
                let content = [];
                for(let i = 0; i < bookobj.length; i++) {
                    content[i] = {
                        name: bookobj[i].name,
                        value: `정가: ${bookobj[i].realprice}
                        판매가: ${bookobj[i].saleprice}
                        [제품상세페이지](http://booksaetong.co.kr/shop/item.php?it_id=${bookobj[i].id})`,
                        inline: true
                    };
                }
                let index = 0;
                content = util.arrayCut(content);
                let embedObj = {
                    embed: {
                        author: {
                            name: index+1 + ' 페이지',
                        },
                        title: day + ' 의 신간',
                        url: 'http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=' + day,
                        color: '3447003',
                        fields: content[index],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                };
                if(content.length == 0) {
                    embedObj.embed.fields = [{
                        name: '신간 페이지가 존재하지 않습니다.',
                        value: '아직 정보가 갱신되지 않았거나 해당 날짜의 신간이 존재하지 않습니다.'
                    }];
                }
                message.channel.send(embedObj)
                    .then(async (sentMessage) => {
                        if(content.length <= 1 ) {
                            return;
                        }
                        await sentMessage.react('\u2B05')
                            .then(() => {
                                const collector = sentMessage.createReactionCollector((reaction, user) => reaction.emoji.name === '\u2B05' && user.id === message.author.id);
                                collector.on('collect', () => {
                                    if(index!=0)index--;
                                    embedObj.embed.author.name = index+1 + ' 페이지';
                                    embedObj.embed.fields = content[index];
                                    sentMessage.edit(embedObj);
                                });
                            });
                        await sentMessage.react('\u27A1')
                            .then(() => {
                                const collector = sentMessage.createReactionCollector((reaction, user) => reaction.emoji.name === '\u27A1' && user.id === message.author.id, { time: 30000 });
                                collector.on('collect', () => {
                                    if(content.length-1>index)index++;
                                    embedObj.embed.author.name = index+1 + ' 페이지';
                                    embedObj.embed.fields = content[index];
                                    
                                    sentMessage.edit(embedObj);
                                });
                                collector.on('end', () => sentMessage.clearReactions());
                            });
                    });
            }).catch((err) => {
                console.error(err);
                message.channel.send('에러 또는 이 날에 신간이 없습니다. 혹시 모르니까 에러 메세지: ' + err);
            });
        }
        if(namuCommand.includes(parsed.command)) {
            let helpcommand = ['help', '도움말', '가이드', 'h']
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