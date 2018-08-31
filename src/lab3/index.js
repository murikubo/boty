const util = require('../util.js');
const axios = require('axios');
const _ = require('lodash');
const config = require('../../config.json');

module.exports = (client) => {

/*     client.on('message', message => {
        let command = util.slice(message.content);
        if(command.command == 'gdgd') {
            message.channel.send('gdgd');
        }
    }); */
    //let command = util.slice(message.content);
    const commands = {
        '오늘': (message) => {
            commands.옴쿠(message);
            commands.환(message);
            commands.한(message);
        },
        '옴쿠': (message) => {
            const result = ['대흉', '말흉', '반흉', '소흉', '흉', '평', '말소길', '말길', '반길', '길', '소길', '중길', '대길']
            const luckyNum = _.random(0, result.length - 1);
            message.channel.send({embed: {
                color: 3447003,
                description: result[luckyNum]
            }});
        },
        '환': (message) => {
            axios({
                method: 'get',
                url: 'http://api.manana.kr/exchange/rate/KRW/JPY.json',
            }).then((res) => {
                let content = [];
                content.push({
                    name: `환율: **${parseFloat(eval(res.data[0].rate * 100)).toFixed(2).toLocaleString()}**원`,
                    value: `현재${res.data[0].date}기준`
                });
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: 'KRW->JPY환율:',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }).catch((err) => {
                message.channel.send('Error occured : `' + err + '`');
            });
        },
        '한' : (message) => {
            axios({
                method: 'get',
                url: 'http://hangang.dkserver.wo.tc',
            }).then((res) => {
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: '한강 수온',
                        color: '3447003',
                        fields: [
                            {
                                name: `현재 한강 수온은 ${res.data.temp}℃입니다.`,
                                value: `현재 시각 ${res.data.time}기준`
                            }],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }).catch((err) => {
                message.channel.send('Error occured : `' + err + '`');
            });
        },
    };
    client.on('message', message => {
        if (!message.content.startsWith(config.prefix)) return;
        if (commands.hasOwnProperty(message.content.toLowerCase().slice(config.prefix.length).split(' ')[0])) commands[message.content.toLowerCase().slice(config.prefix.length).split(' ')[0]](message);
    });
}