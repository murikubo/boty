const config = require('../../config.json');
const prefix = config.prefix;

const axios = require('axios');

function transRequest(content = String, source = String, target = String, smtBool = Boolean) {
    return new Promise((resolve, reject) => {
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
    })
}

module.exports = (client) => {
    client.on('message', message => {  
        if (message.content.startsWith(prefix + "ke ")) {
            transRequest(message.content.slice(4), 'ko', 'en', false)
            .then((transText) => {
                message.channel.send(transText);
            });
        }
        if (message.content.startsWith(prefix + "ek ")) {
            transRequest(message.content.slice(4), 'en', 'ko', false)
            .then((transText) => {
                message.channel.send(transText);
            });
        }

        if (message.content.startsWith(prefix + "kj ")) {
            transRequest(message.content.slice(4), 'ko', 'en', false)
            .then((transText) => {
                transRequest(transText, 'en', 'ja', false)
                .then((transText) => {
                    message.channel.send(transText);
                })
            });
        }
        if (message.content.startsWith(prefix + "jk ")) {
            transRequest(message.content.slice(4), 'ja', 'en', false)
            .then((transText) => {
                transRequest(transText, 'en', 'ko', false)
                .then((transText) => {
                    message.channel.send(transText);
                })
            });
        }

        if (message.content.startsWith(prefix + "ske ")) {
            transRequest(message.content.slice(5), 'ko', 'en', true)
            .then((transText) => {
                message.channel.send(transText);
            });
        }
        if (message.content.startsWith(prefix + "sek ")) {
            transRequest(message.content.slice(5), 'en', 'ko', true)
            .then((transText) => {
                message.channel.send(transText);
            });
        }

        if (message.content.startsWith(prefix + "skj ")) {
            transRequest(message.content.slice(5), 'ko', 'ja', true)
            .then((transText) => {
                message.channel.send(transText);
            });
        }
        if (message.content.startsWith(prefix + "sjk ")) {
            transRequest(message.content.slice(5), 'ja', 'ko', true)
            .then((transText) => {
                message.channel.send(transText);
            });
        }

        if (message.content.startsWith(prefix + 'k ')) {
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
                    message.channel.send(code + ' 을(를) 한국어로 바꾸면: ' + transText);
                }, () => {
                    message.channel.send(code + ' 은(는) 한국어로 번역할 수 없습니다.');
                });
            })
        }

        if (message.content.startsWith(prefix + "roma ")) {
            const transText = message.content.slice(5);
            axios({
                method: 'get',
                url: 'https://openapi.naver.com/v1/krdict/romanization?query=' + encodeURI(transText),
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
              }).then((res)=> {
                    let content = '니가 궁금했던 이름 : \n';
                    for(let i = 0; i < res.data.aResult[0].aItems.length; i++) {
                        /*if(res.data.aResult[0].aItems[i].score <= 50) {
                            continue;
                        }*/
                        content += res.data.aResult[0].aItems[i].name + ', score: ' + res.data.aResult[0].aItems[i].score + '\n';
                    }
                    message.channel.send(content);
              });
        }
    });
};