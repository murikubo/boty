const config = require('../config.json');
const axios = require('axios');
const util = require('./util.js');

const any = (baseRate = 'JPY', targetRate = 'KRW', unit = '100') => {
    return axios({
        method: 'get',
        url: `http://api.manana.kr/exchange/rate/${targetRate}/${baseRate}.json`
    }).then((res) => {
        const reObj = {
            title: `${baseRate} -> ${targetRate} 환율`,
            content: [{
                name: `**${parseFloat(eval(res.data[0].rate*unit).toFixed(2)).toLocaleString()} ${targetRate}**`,
                value: `${res.data[0].date} 기준 (단위: ${parseFloat(unit).toLocaleString()} ${baseRate})`
            }]
        };
        return reObj;
    }).catch((err)=> {
        throw new Error('Error occurred : `' + err + '`');
    });
}

module.exports = (client) => {
    client.on('message', message => {
        const parsed = util.slice(message.content);
        if(parsed.command == '환산' || parsed.command == 'cv') {
            if(!parsed.content || isNaN(parsed.content)) parsed.content = 1;
            else parsed.content = parseFloat(parsed.content);

            if(parsed.param == 'om') {
                return message.channel.send(`미국 단위 ${parsed.content} oz: ${(parsed.content*29.5735).toFixed(2)} ml \n영국 단위 ${parsed.content} oz: ${(parsed.content*28.4131).toFixed(2)} ml`);
            }
            if(parsed.param == 'mo') {
                return message.channel.send(`미국 단위 ${parsed.content} ml: ${(parsed.content/29.5735).toFixed(2)} oz \n영국 단위 ${parsed.content} ml: ${(parsed.content/28.4131).toFixed(2)} oz`);
            }

            if(parsed.param == 'im') {
                return message.channel.send(`${parsed.content} in: ${(parsed.content*2.54).toFixed(2)} cm`);
            }
            if(parsed.param == 'ym') {
                return message.channel.send(`${parsed.content} yd: ${(parsed.content*91.44).toFixed(2)} cm`);
            }
            if(parsed.param == 'fm') {
                return message.channel.send(`${parsed.content} ft: ${(parsed.content*30.48).toFixed(2)} cm`);
            }
            if(parsed.param == 'mm') {
                return message.channel.send(`${parsed.content} mi: ${(parsed.content*1609.34).toFixed(2)} m`);
            }
            if(parsed.param == 'cf') {
                return message.channel.send(`${parsed.content} C°: ${(parsed.content*1.8+32).toFixed(2)} °F`);
            }
            if(parsed.param == 'fc') {
                return message.channel.send(`${parsed.content} F°: ${((parsed.content-32)/1.8).toFixed(2)} °C`);
            }

            if(parsed.param == 'kl') {
                return message.channel.send(`${parsed.content} kg: ${(parsed.content*2.20462).toFixed(2)} lb`);
            }
            if(parsed.param == 'lk') {
                return message.channel.send(`${parsed.content} lb: ${(parsed.content/2.20462).toFixed(2)} kg`);
            }
            if(parsed.param == 'help' || parsed.param == 'h') {
                return message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: '환산 사용 방법',
                        description: '`-om {숫자}`: `온스`를 `밀리리터`로 변환한 값을 출력합니다.\n'+
                                     '`-mo {숫자}`: `밀리리터`를 `온스`로 변환한 값을 출력합니다.\n'+
                                     '`-im {숫자}`: `인치`를 `센치미터`로 변환한 값을 출력합니다.\n'+
                                     '`-ym {숫자}`: `야드`를 `센치미터`로 변환한 값을 출력합니다.\n'+
                                     '`-mm {숫자}`: `마일`을 `미터`로 변환한 값을 출력합니다.\n'+
                                     '`-fm {숫자}`: `피트`를 `센치미터`로 변환한 값을 출력합니다.\n'+
                                     '`-cf {숫자}`: `섭씨`를 `화씨`로 변환한 값을 출력합니다.\n'+
                                     '`-fc {숫자}`: `화씨`를 `섭씨`로 변환한 값을 출력합니다.\n'+
                                     '`-kl {숫자}`: `킬로`을 `파운드`로 변환한 값을 출력합니다.\n'+
                                     '`-lk {숫자}`: `파운드`를 `킬로`으로 변환한 값을 출력합니다.\n'+
                                     '※숫자를 입력하지 않을 시 값이 `1`이 되어 나옵니다.',
                        color: '3447003',
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }
        }


        if(parsed.command == '환율' || parsed.command == 'ex') {
            new Promise((resolve) => {
                resolve();
            }).then(async () => {
                if(parsed.param == 'kj' || parsed.param == 'wy'){
                    if(parsed.content != '' && !isNaN(parseInt(parsed.content))) return await any('KRW', 'JPY', parsed.content);
                    return await any('KRW', 'JPY', '1000');
                } else if(parsed.param == 'jk' || parsed.param == 'yw' || !parsed.param) {
                    if(parsed.content != '' && !isNaN(parseInt(parsed.content)) ) return await any('JPY', 'KRW', parsed.content);
                    return await any();
                }else if(parsed.param == 'uk' || parsed.param == 'dw') {
                    if(parsed.content != '' && !isNaN(parseInt(parsed.content)) ) return await any('USD', 'KRW', parsed.content);
                    return await any('USD', 'KRW', '1');
                } else if(parsed.param == 'ku' || parsed.param == 'wd') {
                    if(parsed.content != '' && !isNaN(parseInt(parsed.content)) ) return await any('KRW', 'USD', parsed.content);
                    return await any('KRW', 'USD', '1000');
                } else if(parsed.param == 'help' || parsed.param == 'h') {
                    message.channel.send({
                        embed: {
                            author: {
                                name: client.user.username,
                                icon_url: client.user.avatarURL
                            },
                            title: '환율 사용 방법',
                            description: '`-kj {숫자}`: `한국 원`을 `일본 엔`으로 변환한 값을 출력합니다.\n'+
                                         '`-jk {숫자}`: `일본 엔`을 `한국 원`으로 변환한 값을 출력합니다.\n'+
                                         '`-ku {숫자}`: `한국 원`을 `미국 달러`으로 변환한 값을 출력합니다.\n'+
                                         '`-uk {숫자}`: `미국 달러`을 `한국 원`으로 변환한 값을 출력합니다.\n'+
                                         '※숫자를 입력하지 않을 시 기본 값이 나옵니다.',
                            color: '3447003',
                            timestamp: new Date(),
                            footer: {
                                icon_url: client.user.avatarURL,
                                text: '명령어 입력 시간'
                            }
                        }
                    });
                    return false;
                } else {
                    return await any();
                }
            }).then((info) => {
                if(info == false) return;
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: info.title,
                        color: '3447003',
                        fields: info.content,
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
    });
}