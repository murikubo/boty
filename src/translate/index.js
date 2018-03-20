const config = require('../../config.json');
const prefix = config.prefix;

const axios = require('axios');

module.exports = (client) => {
    client.on('message', message => {  
        if (message.content.startsWith(prefix + "ke ")) {
            const transText = message.content.slice(4);
            axios({
                method: 'post',
                url: 'https://openapi.naver.com/v1/papago/n2mt',
                data: {
                    'source': 'ko',
                    'target': 'en',
                    'text': transText},
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
              }).then((res)=> {
                    message.channel.send(res.data.message.result.translatedText);
              });
        }
        if (message.content.startsWith(prefix + "ek ")) {
            const transText = message.content.slice(4);
            axios({
                method: 'post',
                url: 'https://openapi.naver.com/v1/papago/n2mt',
                data: {
                    'source': 'en',
                    'target': 'ko',
                    'text': transText},
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
              }).then((res)=> {
                    message.channel.send(res.data.message.result.translatedText);
              });
        }
        if (message.content.startsWith(prefix + "ske ")) {
            const transText = message.content.slice(4);
            axios({
                method: 'post',
                url: 'https://openapi.naver.com/v1/language/translate',
                data: {
                    'source': 'ko',
                    'target': 'en',
                    'text': transText},
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
              }).then((res)=> {
                    message.channel.send(res.data.message.result.translatedText);
              });
        }
        if (message.content.startsWith(prefix + "sek ")) {
            const transText = message.content.slice(4);
            axios({
                method: 'post',
                url: 'https://openapi.naver.com/v1/language/translate',
                data: {
                    'source': 'en',
                    'target': 'ko',
                    'text': transText},
                headers: {
                    'X-Naver-Client-Id': config.transId,
                    'X-Naver-Client-Secret': config.transSecret
                }
              }).then((res)=> {
                    message.channel.send(res.data.message.result.translatedText);
              });
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