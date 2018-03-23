const config = require('../../config.json');
const dictionary = require('./dictionary');
const prefix = config.prefix;

const axios = require('axios');

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
        '포루트갈어': 'pt',
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
        if (message.content.startsWith(prefix + 'ke ') || message.content.startsWith( prefix + '한영 ')) {
            transRequest(message.content.slice(4), 'ko', 'en', false)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }
        if (message.content.startsWith(prefix + 'ek ') || message.content.startsWith( prefix + '영한 ')) {
            transRequest(message.content.slice(4), 'en', 'ko', false)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }

        if (message.content.startsWith(prefix + 'kj ') || message.content.startsWith( prefix + '한일')) {
            transRequest(message.content.slice(4), 'ko', 'en', false)
                .then((transText) => {
                    transRequest(transText, 'en', 'ja', false)
                        .then((transText) => {
                            message.channel.send(transText);
                        });
                });
        }
        if (message.content.startsWith(prefix + 'jk ') || message.content.startsWith( prefix + '일한 ')) {
            transRequest(message.content.slice(4), 'ja', 'en', false)
                .then((transText) => {
                    transRequest(transText, 'en', 'ko', false)
                        .then((transText) => {
                            message.channel.send(transText);
                        });
                });
        }

        if (message.content.startsWith(prefix + 'ske ') || message.content.startsWith( prefix + '스한영 ')) {
            transRequest(message.content.slice(5), 'ko', 'en', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }
        if (message.content.startsWith(prefix + 'sek ' || message.content.startsWith( prefix + '스영한 '))) {
            transRequest(message.content.slice(5), 'en', 'ko', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }

        if (message.content.startsWith(prefix + 'skj ') || message.content.startsWith( prefix + '스한일 ')) {
            transRequest(message.content.slice(5), 'ko', 'ja', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }
        if (message.content.startsWith( prefix + 'sjk ') || message.content.startsWith( prefix + '스일한 ')) {
            transRequest(message.content.slice(5), 'ja', 'ko', true)
                .then((transText) => {
                    message.channel.send(transText);
                });
        }

        if (message.content.startsWith(prefix + 'k ') || message.content.startsWith( prefix + '한 ')) {
            const targetText = message.content.slice(3);
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

        if (message.content.startsWith(prefix + 'roma ')) {
            const transText = message.content.slice(5);
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
                message.channel.send('Error occured: `' + err + '`');
            });
        }
        if (message.content.startsWith(prefix + '구글')) {
            message.channel.send('https://translate.google.com');
        }

        if (message.content.startsWith( prefix + 'dick ')) {
            dictionary.dictionary(message.content.slice(message.content.search(/\s/)))
                .then((res) => {
                    let content = '';
                    for(let i in res.data.items) {
                        content += i + '. ' + res.data.items[i].title + '\n';
                    }
                    //hime hime처럼 넘버링 후 클릭 시 해당 타이틀의 Description을 볼 수 있게 하면 좋겠당 ㅎㅎ
                    content = content.replace(/<b>/gi,'**');
                    content = content.replace(/<\/b>/gi,'**');
                    message.channel.send(content);
                });
        }
    });    
};
