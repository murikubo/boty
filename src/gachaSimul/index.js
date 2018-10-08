const config = require('../../config.json');
const data = require('../../data/ssr_data.json');
const discord = require('discord.js');
const util = require('../util.js');
const prefix = config.prefix;
const _ = require('lodash');
let SR_RESULT = 0;
let RARE_RESULT = 0;
const fs = require('fs');
let SR_COUNT = '0'; //10연챠시 SR확정 구현을 위한 카운트
let mod = JSON.parse(fs.readFileSync("./data/mod_data.json", "utf8"));
const Jewel = require('../../data/Jewel_data.json');
const userSSR = require('../../data/user_ssr_data.json');

let SR = ['[SR]'];
let RARE = ['[RARE]'];
let result_SR = [];
let result_RARE = [];
result_SR[0] = SR[Math.floor(Math.random() * SR.length)];
result_RARE[0] = RARE[Math.floor(Math.random() * RARE.length)];


module.exports = (client) => {
    client.on('message', message => {
        let command = util.slice(message.content);
/*         if (command.command == "쥬우얼") {
            message.channel.send(`현재 쥬얼은 **__${Jewel[message.author.id].Jewel.toLocaleString()}__**개 있어요.`);
        } */

/*         if (command.command == '카드') {
            let content = [];
            content.push({
                name: '획득 쓰알 리스트',
                value: userSSR[message.author.id].map((list, index) => `${index + 1}. ${list}\n`).toString().replace(/,/g, '')
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
            });
        } */

        if (message.content.startsWith(config.prefix + "테스트가챠")) {
            message.channel.send('테스트 가챠입니다. 모든 아이돌이 출현하고 SSR확률이 6%로 고정됩니다.', { code: 'true' });
            SR_RESULT = 0;
            RARE_RESULT = 0;
            SR_COUNT = '0';
            let objectCount = Object.keys(data.ssr).length;
            for (let i = 0; i < 10; i++) {
                let gacha = Math.floor((Math.random() * 100) + 1);
                if (SR_COUNT == '9') {
                    SR_RESULT++;
                } else if (gacha <= '6') {
                    let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let genTeiSwitch = gachaResult.gacha_type;
                    let upTitle = gachaResult.title;
                    let upName = gachaResult.name;
                    let sign = gachaResult.sign;
                    let typeColorSwitch = gachaResult.type;
                    let typeColor = '';
                    let gachaType = '';
                    if (typeColorSwitch == 'cute') {
                        typeColor = '#FFB2F5';
                    } else if (typeColorSwitch == 'cool') {
                        typeColor = '#1266FF';
                    } else if (typeColorSwitch == 'passion') {
                        typeColor = '#FFBB00';
                    }
                    if (genTeiSwitch == 'tsujyou') {
                        gachaType = '통상 아이돌';
                    } else if (genTeiSwitch == 'gentei') {
                        gachaType = '한정 아이돌';
                    } else if (genTeiSwitch == 'cindeFest') {
                        gachaType = '페스 아이돌';
                    }
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(typeColor)
                        .setDescription(gachaType)
                        .setFooter("명령어 입력 시간", client.user.avatarURL)
                        .setThumbnail(sign)
                        .setTimestamp()
                        .addField(upTitle,
                            upName)
                    message.channel.send({ embed });
                    if (!userSSR[message.author.id]) userSSR[message.author.id] = [];
                    userSSR[message.author.id].push(upTitle + upName);
                    fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                } else if ('7' <= gacha && gacha <= '16') {
                    SR_RESULT++;
                } else if (gacha >= '17') {
                    RARE_RESULT++;
                    SR_COUNT++;
                }
            } message.channel.send('획득한 RARE : ' + RARE_RESULT);
            message.channel.send('획득한 SR : ' + SR_RESULT);
        }

        if (message.content.startsWith(prefix + '가챠')) {
            /* let JewelData = Jewel[message.author.id];
            if (JewelData.Jewel < 2500) {
                message.reply('쥬얼이 부족해요.');
            } else {
                JewelData.Jewel = JewelData.Jewel - 2500;
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `쥬얼을 소모하여 10연챠를 합니다. 현재 남은 쥬얼 **${JewelData.Jewel.toLocaleString()}**`
                    }
                });
                fs.writeFileSync('./data/Jewel_data.json', JSON.stringify(Jewel)); */
                SR_COUNT = '0';
                let j = 0;
                if (mod.mod.skip == 0) { //비 생략모드
                    if (mod.mod.cindeFest == '1') {
                        let objectCount = Object.keys(data.ssr_cindeFest).length;
                        for (let i = 0; i < 10; i++) {
                            let gacha = Math.floor((Math.random() * 100) + 1);
                            if (SR_COUNT == '9') {
                                message.channel.send(result_SR[0]);
                            } else if (gacha <= '6') {
                                let gachaResult = data.ssr_cindeFest[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                                let genTeiSwitch = gachaResult.gacha_type;
                                let upTitle = gachaResult.title;
                                let upName = gachaResult.name;
                                let sign = gachaResult.sign;
                                let typeColorSwitch = gachaResult.type;
                                let typeColor = '';
                                let gachaType = '';
                                if (typeColorSwitch == 'cute') {
                                    typeColor = '#FFB2F5';
                                } else if (typeColorSwitch == 'cool') {
                                    typeColor = '#1266FF';
                                } else if (typeColorSwitch == 'passion') {
                                    typeColor = '#FFBB00';
                                }
                                if (genTeiSwitch == 'tsujyou') {
                                    gachaType = '통상 아이돌';
                                } else if (genTeiSwitch == 'gentei') {
                                    gachaType = '한정 아이돌';
                                } else if (genTeiSwitch == 'cindeFest') {
                                    gachaType = '페스 아이돌';
                                }
                                const embed = new discord.RichEmbed()
                                    .setTitle("SSR획득!")
                                    .setAuthor(client.user.username, client.user.avatarURL)
                                    .setColor(typeColor)
                                    .setDescription(gachaType)
                                    .setFooter("명령어 입력 시간", client.user.avatarURL)
                                    .setThumbnail(sign)
                                    .setTimestamp()
                                    .addField(upTitle,
                                        upName)
                                message.channel.send({ embed });
                                if (!userSSR[message.author.id]) userSSR[message.author.id] = [];
                                userSSR[message.author.id].push(upTitle + upName);
                                fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                            } else if ('7' <= gacha && gacha <= '16') {
                                message.channel.send(result_SR[0]);
                            } else if (gacha >= '17') {
                                message.channel.send(result_RARE[0]);
                                SR_COUNT++;
                            }
                        }
                    } else if (mod.mod.cindeFest == '0') {
                        let objectCount = Object.keys(data.ssr_tsujyou).length;
                        for (let i = 0; i < 10; i++) {
                            let gacha = Math.floor((Math.random() * 100) + 1);
                            if (SR_COUNT == '9') {
                                message.channel.send(result_SR[0]);
                            } else if (gacha <= '3') {
                                let gachaResult = data.ssr_tsujyou[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                                let genTeiSwitch = gachaResult.gacha_type;
                                let upTitle = gachaResult.title;
                                let upName = gachaResult.name;
                                let sign = gachaResult.sign;
                                let typeColorSwitch = gachaResult.type;
                                let typeColor = '';
                                let gachaType = '';
                                if (typeColorSwitch == 'cute') {
                                    typeColor = '#FFB2F5';
                                } else if (typeColorSwitch == 'cool') {
                                    typeColor = '#1266FF';
                                } else if (typeColorSwitch == 'passion') {
                                    typeColor = '#FFBB00';
                                }
                                if (genTeiSwitch == 'tsujyou') {
                                    gachaType = '통상 아이돌';
                                } else if (genTeiSwitch == 'gentei') {
                                    gachaType = '한정 아이돌';
                                } else if (genTeiSwitch == 'cindeFest') {
                                    gachaType = '페스 아이돌';
                                }
                                const embed = new discord.RichEmbed()
                                    .setTitle("SSR획득!")
                                    .setAuthor(client.user.username, client.user.avatarURL)
                                    .setColor(typeColor)
                                    .setDescription(gachaType)
                                    .setFooter("명령어 입력 시간", client.user.avatarURL)
                                    .setThumbnail(sign)
                                    .setTimestamp()
                                    .addField(upTitle,
                                        upName)
                                message.channel.send({ embed });
                                if (!userSSR[message.author.id]) userSSR[message.author.id] = [];
                                userSSR[message.author.id].push(upTitle + upName);
                                fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                            } else if ('4' <= gacha && gacha <= '13') {
                                message.channel.send(result_SR[0]);
                            } else if (gacha >= '14') {
                                message.channel.send(result_RARE[0]);
                                SR_COUNT++;
                            }
                        }
                    } else if (mod.mod.cindeFest == '2') {
                        let objectCount = Object.keys(data.ssr_gentei).length;
                        for (let i = 0; i < 10; i++) {
                            let gacha = Math.floor((Math.random() * 100) + 1);
                            if (SR_COUNT == '9') {
                                message.channel.send(result_SR[0]);
                            } else if (gacha <= '3') {
                                let gachaResult = data.ssr_gentei[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                                let genTeiSwitch = gachaResult.gacha_type;
                                let upTitle = gachaResult.title;
                                let upName = gachaResult.name;
                                let sign = gachaResult.sign;
                                let typeColorSwitch = gachaResult.type;
                                let typeColor = '';
                                let gachaType = '';
                                if (typeColorSwitch == 'cute') {
                                    typeColor = '#FFB2F5';
                                } else if (typeColorSwitch == 'cool') {
                                    typeColor = '#1266FF';
                                } else if (typeColorSwitch == 'passion') {
                                    typeColor = '#FFBB00';
                                }
                                if (genTeiSwitch == 'tsujyou') {
                                    gachaType = '통상 아이돌';
                                } else if (genTeiSwitch == 'gentei') {
                                    gachaType = '한정 아이돌';
                                } else if (genTeiSwitch == 'cindeFest') {
                                    gachaType = '페스 아이돌';
                                }
                                const embed = new discord.RichEmbed()
                                    .setTitle("SSR획득!")
                                    .setAuthor(client.user.username, client.user.avatarURL)
                                    .setColor(typeColor)
                                    .setDescription(gachaType)
                                    .setFooter("명령어 입력 시간", client.user.avatarURL)
                                    .setThumbnail(sign)
                                    .setTimestamp()
                                    .addField(upTitle,
                                        upName)
                                message.channel.send({ embed });
                                if (!userSSR[message.author.id]) userSSR[message.author.id] = [];
                                userSSR[message.author.id].push(upTitle + upName);
                                fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                            } else if ('4' <= gacha && gacha <= '13') {
                                message.channel.send(result_SR[0]);
                            } else if (gacha >= '14') {
                                message.channel.send(result_RARE[0]);
                                SR_COUNT++;
                            }
                        }
                    }
                } else if (mod.mod.skip == '1') { //생략 모드 실행 시
                    SR_RESULT = 0;
                    RARE_RESULT = 0;
                    if (mod.mod.cindeFest == '1') {
                        let objectCount = Object.keys(data.ssr_cindeFest).length;
                        for (let i = 0; i < 10; i++) {
                            let gacha = Math.floor((Math.random() * 100) + 1);
                            if (SR_COUNT == '9') {
                                SR_RESULT++;
                            } else if (gacha <= '6') {
                                let gachaResult = data.ssr_cindeFest[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                                let genTeiSwitch = gachaResult.gacha_type;
                                let upTitle = gachaResult.title;
                                let upName = gachaResult.name;
                                let sign = gachaResult.sign;
                                let typeColorSwitch = gachaResult.type;
                                let typeColor = '';
                                let gachaType = '';
                                if (typeColorSwitch == 'cute') {
                                    typeColor = '#FFB2F5';
                                } else if (typeColorSwitch == 'cool') {
                                    typeColor = '#1266FF';
                                } else if (typeColorSwitch == 'passion') {
                                    typeColor = '#FFBB00';
                                }
                                if (genTeiSwitch == 'tsujyou') {
                                    gachaType = '통상 아이돌';
                                } else if (genTeiSwitch == 'gentei') {
                                    gachaType = '한정 아이돌';
                                } else if (genTeiSwitch == 'cindeFest') {
                                    gachaType = '페스 아이돌';
                                }
                                const embed = new discord.RichEmbed()
                                    .setTitle("SSR획득!")
                                    .setAuthor(client.user.username, client.user.avatarURL)
                                    .setColor(typeColor)
                                    .setDescription(gachaType)
                                    .setFooter("명령어 입력 시간", client.user.avatarURL)
                                    .setThumbnail(sign)
                                    .setTimestamp()
                                    .addField(upTitle,
                                        upName)
                                message.channel.send({ embed });
                                if (!userSSR[message.author.id]) userSSR[message.author.id] = [];
                                userSSR[message.author.id].push(upTitle + upName);
                                fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                            } else if ('7' <= gacha && gacha <= '16') {
                                SR_RESULT++;
                            } else if (gacha >= '17') {
                                RARE_RESULT++;
                                SR_COUNT++;
                            }
                        } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                        message.channel.send('획득한 SR : ' + SR_RESULT);
                    } else if (mod.mod.cindeFest == '0') {
                        let objectCount = Object.keys(data.ssr_tsujyou).length;
                        for (let i = 0; i < 10; i++) {
                            let gacha = Math.floor((Math.random() * 100) + 1);
                            if (SR_COUNT == '9') {
                                SR_RESULT++;
                            } else if (gacha <= '3') {
                                let gachaResult = data.ssr_tsujyou[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                                let genTeiSwitch = gachaResult.gacha_type;
                                let upTitle = gachaResult.title;
                                let upName = gachaResult.name;
                                let sign = gachaResult.sign;
                                let typeColorSwitch = gachaResult.type;
                                let typeColor = '';
                                let gachaType = '';
                                if (typeColorSwitch == 'cute') {
                                    typeColor = '#FFB2F5';
                                } else if (typeColorSwitch == 'cool') {
                                    typeColor = '#1266FF';
                                } else if (typeColorSwitch == 'passion') {
                                    typeColor = '#FFBB00';
                                }
                                if (genTeiSwitch == 'tsujyou') {
                                    gachaType = '통상 아이돌';
                                } else if (genTeiSwitch == 'gentei') {
                                    gachaType = '한정 아이돌';
                                } else if (genTeiSwitch == 'cindeFest') {
                                    gachaType = '페스 아이돌';
                                }
                                const embed = new discord.RichEmbed()
                                    .setTitle("SSR획득!")
                                    .setAuthor(client.user.username, client.user.avatarURL)
                                    .setColor(typeColor)
                                    .setDescription(gachaType)
                                    .setFooter("명령어 입력 시간", client.user.avatarURL)
                                    .setThumbnail(sign)
                                    .setTimestamp()
                                    .addField(upTitle,
                                        upName)
                                message.channel.send({ embed });
                                if (!userSSR[message.author.id]) userSSR[message.author.id] = [];
                                userSSR[message.author.id].push(upTitle + upName);
                                fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                            } else if ('4' <= gacha && gacha <= '13') {
                                SR_RESULT++;
                            } else if (gacha >= '14') {
                                RARE_RESULT++;
                                SR_COUNT++;
                            }
                        } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                        message.channel.send('획득한 SR : ' + SR_RESULT);
                    } else if (mod.mod.cindeFest == '2') {
                        let objectCount = Object.keys(data.ssr_gentei).length;
                        for (let i = 0; i < 10; i++) {
                            let gacha = Math.floor((Math.random() * 100) + 1);
                            if (SR_COUNT == '9') {
                                SR_RESULT++;
                            } else if (gacha <= '3') {
                                let gachaResult = data.ssr_gentei[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                                let genTeiSwitch = gachaResult.gacha_type;
                                let upTitle = gachaResult.title;
                                let upName = gachaResult.name;
                                let sign = gachaResult.sign;
                                let typeColorSwitch = gachaResult.type;
                                let typeColor = '';
                                let gachaType = '';
                                if (typeColorSwitch == 'cute') {
                                    typeColor = '#FFB2F5';
                                } else if (typeColorSwitch == 'cool') {
                                    typeColor = '#1266FF';
                                } else if (typeColorSwitch == 'passion') {
                                    typeColor = '#FFBB00';
                                }
                                if (genTeiSwitch == 'tsujyou') {
                                    gachaType = '통상 아이돌';
                                } else if (genTeiSwitch == 'gentei') {
                                    gachaType = '한정 아이돌';
                                } else if (genTeiSwitch == 'cindeFest') {
                                    gachaType = '페스 아이돌';
                                }
                                const embed = new discord.RichEmbed()
                                    .setTitle("SSR획득!")
                                    .setAuthor(client.user.username, client.user.avatarURL)
                                    .setColor(typeColor)
                                    .setDescription(gachaType)
                                    .setFooter("명령어 입력 시간", client.user.avatarURL)
                                    .setThumbnail(sign)
                                    .setTimestamp()
                                    .addField(upTitle,
                                        upName)
                                message.channel.send({ embed });
                                if (!userSSR[message.author.id]) userSSR[message.author.id] = [];
                                userSSR[message.author.id].push(upTitle + upName);
                                fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                            } else if ('4' <= gacha && gacha <= '13') {
                                SR_RESULT++;
                            } else if (gacha >= '14') {
                                RARE_RESULT++;
                                SR_COUNT++;
                            }
                        } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                        message.channel.send('획득한 SR : ' + SR_RESULT);
                    }
                } else if (mod.mod.skip == '2') {
                    message.channel.send('테스트 가챠입니다. 모든 아이돌이 출현하고 SSR확률이 6%로 고정됩니다.', { code: 'true' });
                    SR_RESULT = 0;
                    RARE_RESULT = 0;
                    SR_COUNT = '0';
                    let objectCount = Object.keys(data.ssr).length;
                    for (let i = 0; i < 10; i++) {
                        let gacha = Math.floor((Math.random() * 100) + 1);
                        if (SR_COUNT == '9') {
                            SR_RESULT++;
                        } else if (gacha <= '6') {
                            let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                            let genTeiSwitch = gachaResult.gacha_type;
                            let upTitle = gachaResult.title;
                            let upName = gachaResult.name;
                            let sign = gachaResult.sign;
                            let typeColorSwitch = gachaResult.type;
                            let typeColor = '';
                            let gachaType = '';
                            if (typeColorSwitch == 'cute') {
                                typeColor = '#FFB2F5';
                            } else if (typeColorSwitch == 'cool') {
                                typeColor = '#1266FF';
                            } else if (typeColorSwitch == 'passion') {
                                typeColor = '#FFBB00';
                            }
                            if (genTeiSwitch == 'tsujyou') {
                                gachaType = '통상 아이돌';
                            } else if (genTeiSwitch == 'gentei') {
                                gachaType = '한정 아이돌';
                            } else if (genTeiSwitch == 'cindeFest') {
                                gachaType = '페스 아이돌';
                            }
                            const embed = new discord.RichEmbed()
                                .setTitle("SSR획득!")
                                .setAuthor(client.user.username, client.user.avatarURL)
                                .setColor(typeColor)
                                .setDescription(gachaType)
                                .setFooter("명령어 입력 시간", client.user.avatarURL)
                                .setThumbnail(sign)
                                .setTimestamp()
                                .addField(upTitle,
                                    upName)
                            message.channel.send({ embed });
                            if (!userSSR[message.author.id]) userSSR[message.author.id] = [];
                            userSSR[message.author.id].push(upTitle + upName);
                            fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                        } else if ('7' <= gacha && gacha <= '16') {
                            SR_RESULT++;
                        } else if (gacha >= '17') {
                            RARE_RESULT++;
                            SR_COUNT++;
                        }
                    } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                    message.channel.send('획득한 SR : ' + SR_RESULT);
                }
            //}
        }
        /* if (_.isEmpty(Jewel)) return;
        else fs.writeFileSync('./data/Jewel_data.json', JSON.stringify(Jewel)); */
    });
};