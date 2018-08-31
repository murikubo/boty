const config = require('../../config.json');
const dictionary = require('./dictionary');
const prefix = config.prefix;
const hepburn = require('hepburn');
const util = require('../util.js');
const axios = require('axios');
const xml2js = require('xml2js');

function nation(langCode) {
    const nationData = {
        '한국어': 'ko',
        '일본어': 'ja',
        '중국어 간체': 'zh-CN',
        '중국어 번체': 'zh-TW',
        '힌디어': 'hi',
        '영어': 'en',
        '스페인어': 'es',
        '프랑스어': 'fr',
        '독일어': 'de',
        '포르투갈어': 'pt',
        '베트남어': 'vi',
        '인도네시아어': 'id',
        '태국어': 'th',
        '러시아어': 'ru',
        '알수없음': 'unk',
    };
    for( let i in nationData ) {
        if(langCode === nationData[i]) {
            return i;
        }
        continue;
    }
    return false;
}

function transRequest(content = String, source = String, target = String, smtBool = Boolean) {
    return new Promise((resolve) => {
        let url = '';
        if(smtBool == true) {
            url = 'https://openapi.naver.com/v1/language/translate';
        } else {
            url = 'https://openapi.naver.com/v1/papago/n2mt';
        }
        resolve(url);
    }).then((url) => {
        return axios({
            method: 'post',
            url: url,
            data: {
                'source': source,
                'target': target,
                'text': content
            },
            headers: {
                'X-Naver-Client-Id': config.transId,
                'X-Naver-Client-Secret': config.transSecret
            }
        }).then((res)=> {
            return res.data.message.result.translatedText;
        }, (reject) => {
            reject('지원 하지 않는 언어');
            return;
        });
    }).catch((reject) => {
        return reject();
    });
}

module.exports = (client) => {
    client.on('message', message => {  
        const parsed = util.slice(message.content);

        if (parsed.command == 'ke' || parsed.command == '한영') {
            transRequest(parsed.content, 'ko', 'en', false)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }
        if (parsed.command == 'ek' || parsed.command == '영한') {
            transRequest(parsed.content, 'en', 'ko', false)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }

        if (parsed.command == 'ej' || parsed.command == '영일') {
            transRequest(parsed.content, 'en', 'ja', false)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }
        if (parsed.command == 'je' || parsed.command == '일영') {
            transRequest(parsed.content, 'ja', 'en', false)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }

        if (parsed.command == 'ske' || parsed.command == '스한영') {
            transRequest(parsed.content, 'ko', 'en', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }
        if (parsed.command == 'sek' || parsed.command == '스영한') {
            transRequest(parsed.content, 'en', 'ko', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }

        if (parsed.command == 'skj' || parsed.command == '스한일' || parsed.command == 'kj' || parsed.command == '한일') {
            transRequest(parsed.content, 'ko', 'ja', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }
        if (parsed.command == 'sjk' || parsed.command == '스일한' || parsed.command == 'jk' || parsed.command == '일한') {
            transRequest(parsed.content, 'ja', 'ko', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }

        if (parsed.command == 'k' || parsed.command == '한') {
            const targetText = parsed.content;
            axios({  
                method: 'post',
                url: 'https://openapi.naver.com/v1/papago/detectLangs',
                data: {
                    'query': targetText
                },
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
            }).then((res) => {
                return res.data.langCode;
            }).then((code) => {
                transRequest(targetText, code, 'ko', false)
                    .then((transText) => {
                        message.channel.send(nation(code) + '를 한국어로 바꾸면: ' + transText);
                    }, () => {
                        message.channel.send(nation(code) + '는 한국어로 번역할 수 없습니다.');
                    });
            });
        }

        if (parsed.command == 'roma' || parsed.command == '로마') {
            const transText = parsed.content;
            axios({
                method: 'get',
                url: 'https://openapi.naver.com/v1/krdict/romanization?query=' + encodeURI(transText),
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
            }).then((res)=> {
                if(res.data.aResult.length == 0) {
                    throw new Error('Invalid Name.');
                }
                let content = '영어로 변환한 이름 목록 : \n';
                for(let i = 0; i < res.data.aResult[0].aItems.length; i++) {
                    /*if(res.data.aResult[0].aItems[i].score <= 50) {
                        continue;
                    }*/
                    content += res.data.aResult[0].aItems[i].name + ', score: ' + res.data.aResult[0].aItems[i].score + '\n';
                }
                message.channel.send(content);
            }).catch((err) => {
                message.channel.send('Error occurred: `' + err + '`');
            });
        }
        if (parsed.command == '구글') {
            message.channel.send('https://translate.google.com');
        }

        if (parsed.command == 'dick' || parsed.command == '사전') {
            dictionary.dictionary(parsed.content)
                .then((res) => {
                    let content = '';
                    for(let i in res.data.items) {
                        content += i + '. ' + res.data.items[i].title + '\n';
                    }
                    //hime hime처럼 넘버링 후 클릭 시 해당 타이틀의 Description을 볼 수 있게 하면 좋겠당 ㅎㅎ 이제 할 수 있는데 귀찮다
                    content = content.replace(/<b>/gi,'**');
                    content = content.replace(/<\/b>/gi,'**');
                    message.channel.send(content);
                });
        }

        if(parsed.command == '로마일한' || parsed.command == 'rjk') {
            transRequest(hepburn.toHiragana(parsed.content), 'ja', 'ko', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }

        if(parsed.command == '히라가나' || parsed.command == 'hira') {
            message.channel.send(hepburn.toHiragana(parsed.content));
        }

        if(parsed.command == '가타카나' || parsed.command == 'kata') {
            message.channel.send(hepburn.toKatakana(parsed.content));
        }

        if(parsed.command == '로마지' || parsed.command == 'romaji') {
            message.channel.send(hepburn.fromKana(parsed.content));
        }

        if(parsed.command == '단축' && parsed.content != '') {
            axios({
                method: 'post',
                url: 'https://openapi.naver.com/v1/util/shorturl',
                params: {
                    'url': encodeURI(parsed.content),
                },
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
            }).then((res) => {
                if(parsed.param == 'qr') {
                    message.channel.send(`줄여진 QR: ${res.data.result.url}.qr`);
                    return;
                }
                message.channel.send('줄여진 URL: ' + res.data.result.url);
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }
        
        if (parsed.command == '나무위키' || parsed.command == '나뮈키') {
            axios({
                method: 'post',
                url: 'https://openapi.naver.com/v1/util/shorturl',
                params: {
                    'url': encodeURI(`https://namu.wiki/w/${parsed.content}`),
                },
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
            }).then((res) => {
                message.channel.send(res.data.result.url);
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

        if(parsed.command == '지역' && parsed.content != '') {
            axios({
                method: 'get',
                url: '	https://openapi.naver.com/v1/search/local.json',
                params: {
                    'query': parsed.content,
                },
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
            }).then((res) => {
                const content = [];
                for(let i in res.data.items) {
                    if(i >= 5) {
                        break;
                    }
                    res.data.items[i].title =  res.data.items[i].title.replace(/(<([^>]+)>)/gi, '');
                    content.push({
                        name: parseInt(i)+1 + '. ' +  res.data.items[i].title,
                        value: `위치: ${res.data.items[i].address}`
                    });
                }
                if(content.length == 0) {
                    content.push({
                        name: '검색결과가 없습니다!',
                        value: '다른 검색어로 다시 시도해주세요.'
                    });
                }
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: parsed.content + ' 검색 결과:',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

        if(parsed.command == '음란' && parsed.content != '') {
            axios({
                method: 'get',
                url: 'https://openapi.naver.com/v1/search/adult.json',
                params: {
                    'query': parsed.content,
                },
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
            }).then((res) => {
                if(res.data.adult == 1) message.channel.send('어우 야해');
                else message.channel.send('건-전');
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }


        if(parsed.command == '국어사전' || parsed.command == 'kd' ) {
            if(parsed.content == '') return;
            axios({
                method: 'get',
                url: 'https://opendict.korean.go.kr/api/search',
                params: {
                    'key': config.kodicKey,
                    'q': parsed.content,
                }
            }).then(async (res) => {
                let parser = new xml2js.Parser();
                return await new Promise((resolve, reject) => {
                    parser.parseString(res.data, (err, result) => {
                        if(result.error != undefined) reject(result.error.message);
                        resolve(result.channel.item);
                    });
                });
            }).then((dicCont) => {
                let content = [];
                for(let i in dicCont) {
                    if(i >= 5) {
                        break;
                    }
                    content.push({
                        name: parseInt(i)+1 + '. ' + dicCont[i].word,
                        value: `설명: **${dicCont[i].sense[0].pos}**, **${dicCont[i].sense[0].type}**, ${dicCont[i].sense[0].definition}`
                    });
                }
                if(content.length == 0) {
                    content.push({
                        name: '검색결과가 없습니다!',
                        value: '다른 검색어로 다시 시도해주세요.'
                    });
                }
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: parsed.content + ' 검색 결과:',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

        
        if(parsed.command == '어반' || parsed.command == 'ud') {
            if(parsed.content == '') return;
            axios({
                method: 'get',
                url: 'http://api.urbandictionary.com/v0/define?term=' + encodeURI(parsed.content)
            }).then(async (res) => {
                let content = [];
                if(res.data.tags.length > 0) {
                    content.push({
                        name: '태그',
                        value: res.data.tags.toString()
                    });
                } else {
                    content.push({
                        name: '태그',
                        value: 'none'
                    });
                }
                for(let i in res.data.list) {
                    i = parseInt(i);
                    if(i >= 5) break;
                    content.push({
                        name: i+1 + '. ' + res.data.list[i].word,
                        value: `**설명**: ${res.data.list[i].definition}`
                    });
                    if(content[i+1].value.length >= 800) {
                        content[i+1].value = content[i+1].value.slice(0,800) + '...';
                    }
                    content[i+1].value += `\n**저자**: ${res.data.list[i].author} \n:+1:: ${res.data.list[i].thumbs_up} :-1:: ${res.data.list[i].thumbs_down}`;
                }
                if(content.length == 1) {
                    content.push({
                        name: '검색결과가 없습니다!',
                        value: '다른 검색어로 다시 시도해주세요.'
                    });
                }
                return content;
            }).then((content)=> {
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: parsed.content + ' 검색 결과:',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
                console.error(err);
            });
        }

        
        if(parsed.command == '도로명' && parsed.content != '') {
            axios({
                method: 'get',
                url: 'http://www.juso.go.kr/addrlink/addrLinkApi.do',
                params: {
                    'confmKey': config.roadNameApiKey,
                    'currentPage': 1,
                    'countPerPage': 5,
                    'keyword': parsed.content,
                    'resultType': 'json'
                }
            }).then((res) => {
                message.channel.send(res.data.results.juso[0].roadAddr);
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
                console.error(err);
            });
        }
    });    
};