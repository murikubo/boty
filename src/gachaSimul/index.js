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
let JewelData;
let SR = ['[SR]'];
let RARE = ['[RARE]'];
let result_SR = [];
let result_RARE = [];
let content = [];
result_SR[0] = SR[Math.floor(Math.random() * SR.length)];
result_RARE[0] = RARE[Math.floor(Math.random() * RARE.length)];

const battle = (myType, aiteType, myHp, aiteHp, myATK, aiteATK) => {
    let hp1 = myHp;
    let hp2 = aiteHp;
    let battleCount = 1;
    while (hp2 > 0 && hp1 > 0) {
        hp2 = hp2 - myATK * typecalc(myType, aiteType) * _.random(3, 10);
        hp1 = hp1 - aiteATK * typecalc(aiteType, myType) * _.random(3, 10);
        content.push({
            name: `${battleCount}페이즈`,
            value: `나 HP:**${hp1}** vs 상대 HP:**${hp2}**`
        });
        battleCount++;
    }
    if (hp1 > hp2) {
        content.push({
            name: `승리!`,
            value: `아싸 이겼다`
        });
    } else {
        content.push({
            name: `패배`,
            value: `이런 졌군`
        });
    }
}

const typecalc = (type1, type2) => {
    if (type1 == 'cute' || type2 == 'cool') return 1.5;
    if (type1 == 'cute' || type2 == 'passion') return 0.5;
    if (type1 == 'cute' || type2 == 'cute') return 1;
    if (type1 == 'cool' || type2 == 'passion') return 1.5;
    if (type1 == 'cool' || type2 == 'cool') return 1;
    if (type1 == 'cool' || type2 == 'cute') return 0.5;
    if (type1 == 'passion' || type2 == 'cute') return 1.5;
    if (type1 == 'passion' || type2 == 'cool') return 0.5;
    if (type1 == 'passion' || type2 == 'passion') return 1;
}

module.exports = (client) => {
    client.on('message', message => {
        let command = util.slice(message.content);

        const memberLiset = () => {
            let tosend = [];
            memberArray[message.guild.id].memberList.forEach((member, i) => { tosend.push(`${i + 1}. ${member.userNickName}`); });
            let page = Math.ceil(memberArray[message.guild.id].memberList.length) / 10;
            let index = 0;
            let embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
            message.channel.send(util.embedFormat('대전 가능 맴버 리스트', embed))
                .then(async (sentMessage) => {
                    await sentMessage.react('\u2B05')
                        .then(() => {
                            const filter = (reaction, user) => reaction.emoji.name === '\u2B05' && user.id === message.author.id;
                            const collector = sentMessage.createReactionCollector(filter);
                            collector.on('collect', reaction => {
                                if (index != 0) index--;

                                embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
                                sentMessage.edit(util.embedFormat('대전 가능 맴버 리스트', embed));
                                reaction.remove(message.author.id);
                            });
                        });
                    await sentMessage.react('\u27A1')
                        .then(() => {
                            const filter = (reaction, user) => reaction.emoji.name === '\u27A1' && user.id === message.author.id;
                            const collector = sentMessage.createReactionCollector(filter, { time: 30000 });
                            collector.on('collect', reaction => {
                                if (page > index + 1) index++;
                                embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
                                sentMessage.edit(util.embedFormat('대전 가능 맴버 리스트', embed));
                                reaction.remove(message.author.id);
                            });
                            collector.on('end', () => sentMessage.clearReactions());
                        });
                });
        }
        let memberArray = {};

        if (command.command == '배틀') {

            memberArray[message.guild.id] = {}, memberArray[message.guild.id].memberList = [];
            let mems = client.guilds.get(message.guild.id).members;
            for (let [snowflake, guildMember] of mems) {
                /* console.log('snowflake: ' + snowflake);
                console.log('id: ' + guildMember.id);
                console.log('user id: ' + guildMember.user.id);
                console.log('user name: ' + guildMember.user.username);
                console.log('user nickname: ' + guildMember.nickname); */
                if (guildMember.user.bot != true) {
                    if (userSSR[guildMember.user.id] != null) {
                        if (guildMember.user.id != message.author.id) {
                            if (guildMember.nickname != null) memberArray[message.guild.id].memberList.push({ userId: guildMember.user.id, userName: guildMember.user.username, userNickName: guildMember.nickname });
                            else memberArray[message.guild.id].memberList.push({ userId: guildMember.user.id, userName: guildMember.user.username, userNickName: guildMember.user.username });
                        }
                    }
                }
            }
            if (memberArray[message.guild.id].memberList.length == 0) return message.channel.send({ embed: { color: 3447003, description: `대전 가능한 상대가 없어요.` } });
            Promise.resolve(memberLiset())
                .then(() => {
                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((collected) => {
                            if (collected.first().content == '취소') throw new Error('취소했습니다.');
                            if (isNaN(parseInt(collected.first().content)) || !memberArray[message.guild.id].memberList[parseInt(collected.first().content) - 1]) throw new Error('올바르지 않은 입력값입니다.');
                            let selectedList = parseInt(collected.first().content) - 1;
                            content = [];
                            content.push({
                                name: `대전 결과`,
                                value: `${userSSR[message.author.id][_.random(0, userSSR[message.author.id].length - 1)]} vs ${userSSR[memberArray[message.guild.id].memberList[selectedList].userId][_.random(0, userSSR[memberArray[message.guild.id].memberList[selectedList].userId].length - 1)]}`
                            });
                            battle('cute', 'cute', 10000, 10000, 150, 150);
                            message.channel.send({
                                embed: {
                                    title: `${message.author.lastMessage.member.nickname} vs ${memberArray[message.guild.id].memberList[selectedList].userNickName}`,
                                    color: '3447003',
                                    fields: content,
                                    timestamp: new Date(),
                                    footer: {
                                        icon_url: client.user.avatarURL,
                                        text: '명령어 입력 시간'
                                    }
                                }
                            });
                        })
                        .catch((err) => {
                            if (!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                            else message.channel.send(err.message);
                        });
                });
        }


        if (command.command == "쥬얼슬롯") {
            const Jewel = require('../../data/Jewel_data.json');
            JewelData = Jewel[message.author.id];
            const result = [':star:', ':comet:', ':crescent_moon:', ':snowflake:', ':cherry_blossom:', ':hibiscus:'];
            const result1 = _.random(0, result.length - 1);
            const result2 = _.random(0, result.length - 1);
            const result3 = _.random(0, result.length - 1);

            if (result[result1] == result[result2] && result[result1] == result[result3]) {
                JewelData.Jewel += 7000;
                message.channel.send({
                    embed: {
                        title: `${result[result1]}   ${result[result2]}   ${result[result3]}`,
                        color: 3447003,
                        description: `**__*승리!*__**\n게임에서 승리하여 **7,000**개의 쥬얼을 획득했어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            } else if (result[result1] == result[result2] || result[result1] == result[result3] || result[result2] == result[result3]) {
                
                message.reply({
                    embed: {
                        title: `${result[result1]}   ${result[result2]}   ${result[result3]}`,
                        color: 3447003,
                        description: `**__*아깝네요.*__**\n그러나 자비롭게 본전만은 돌려받아 **250**개의 쥬얼을 획득했어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            } else {
                JewelData.Jewel -= 250;
                message.reply({
                    embed: {
                        title: `${result[result1]}   ${result[result2]}   ${result[result3]}`,
                        color: 3447003,
                        description: `**__*패배!*__**\n인생이 뭐 그렇죠. **250**개의 쥬얼을 잃었어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            }
        }

        if (command.command == "쥬얼") {
            message.channel.send(`현재 쥬얼은 **__${Jewel[message.author.id].Jewel.toLocaleString()}__**개 있어요.`);
        }

        if (command.command == '카드') {
            if(userSSR[message.author.id] == null) return message.channel.send({ embed: { color: 3447003, description: `획득한 쓰알이 없네요.` } });

            let tosend = [];
            userSSR[message.author.id].forEach((cardList, i) => { tosend.push(`${i + 1}. ${cardList}`); });
            let page = Math.ceil(userSSR[message.author.id].length) / 10;
            let index = 0;
            let embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
            message.channel.send(util.embedFormat(`획득 쓰알 리스트 **총 ${userSSR[message.author.id].length}**장`, embed))
                .then(async (sentMessage) => {
                    await sentMessage.react('\u2B05')
                        .then(() => {
                            const filter = (reaction, user) => reaction.emoji.name === '\u2B05' && user.id === message.author.id;
                            const collector = sentMessage.createReactionCollector(filter);
                            collector.on('collect', reaction => {
                                if (index != 0) index--;

                                embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
                                sentMessage.edit(util.embedFormat(`획득 쓰알 리스트 **총 ${userSSR[message.author.id].length}**장`, embed));
                                reaction.remove(message.author.id);
                            });
                        });
                    await sentMessage.react('\u27A1')
                        .then(() => {
                            const filter = (reaction, user) => reaction.emoji.name === '\u27A1' && user.id === message.author.id;
                            const collector = sentMessage.createReactionCollector(filter, { time: 30000 });
                            collector.on('collect', reaction => {
                                if (page > index + 1) index++;
                                embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
                                sentMessage.edit(util.embedFormat(`획득 쓰알 리스트 **총${userSSR[message.author.id].length}**장`, embed));
                                reaction.remove(message.author.id);
                            });
                            collector.on('end', () => sentMessage.clearReactions());
                        });
                });
        }

        if (command.command == "테스트가챠") {
            message.channel.send('테스트 가챠입니다. 모든 아이돌이 출현하고 SSR확률이 6%로 고정됩니다.', { code: 'true' });
            SR_RESULT = 0;
            RARE_RESULT = 0;
            SR_COUNT = 0;
            let objectCount = Object.keys(data.ssr).length;
            for (let i = 0; i < 10; i++) {
                let gacha = Math.floor((Math.random() * 100) + 1);
                if (SR_COUNT == 9) {
                    SR_RESULT++;
                } else if (gacha <= '6') {
                    let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let typeColor = '';
                    if (gachaResult.type == 'cute') typeColor = '#FFB2F5';
                    if (gachaResult.type == 'cool') typeColor = '#1266FF';
                    if (gachaResult.type == 'passion') typeColor = '#FFBB00';
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setColor(typeColor)
                        .setDescription(gachaResult.gacha_type)
                        .setFooter("명령어 입력 시간", client.user.avatarURL)
                        .setThumbnail(gachaResult.sign)
                        .setTimestamp()
                        .addField(gachaResult.title,
                            gachaResult.name)
                    message.channel.send({ embed });
                    if(userSSR[message.author.id].includes(gachaResult.title + gachaResult.name) != true){
                        /* if (!userSSR[message.author.id]) userSSR[message.author.id] = {}, userSSR[message.author.id].cardData = [];
                        userSSR[message.author.id].push({ cardName: upTitle + upName, cardType: gachaResult.type, gentei: gachaResult.gacha_type});
                        fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));  */
                    } else {
                        JewelData = Jewel[message.author.id];
                        //JewelData.Jewel += 1000;
                        message.channel.send({
                            embed: {
                                color: 3447003,
                                description: `**__*중복!*__**\n이미 소지중인 카드에요. **1,000**개의 쥬얼을 돌려받았어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                            }
                        });
                    }
                } else if ('7' <= gacha && gacha <= '16') {
                    SR_RESULT++;
                } else if (gacha >= '17') {
                    RARE_RESULT++;
                    SR_COUNT++;
                }
            } message.channel.send('획득한 RARE : ' + RARE_RESULT);
            message.channel.send('획득한 SR : ' + SR_RESULT);
        }

        if (command.command ==  '가챠') {
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
        if (_.isEmpty(Jewel)) return;
        else fs.writeFileSync('./data/Jewel_data.json', JSON.stringify(Jewel));
    });
};