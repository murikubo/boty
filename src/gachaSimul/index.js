const config = require('../../config.json');
const data = require('../../data/ssr_data.json');
const Pdata = require('../../data/P_ssr_data.json');
const discord = require('discord.js');
const util = require('../util.js');
const _ = require('lodash');
let SR_RESULT = 0;
let RARE_RESULT = 0;
const fs = require('fs');
let SR_COUNT = '0'; //10연챠시 SR확정 구현을 위한 카운트
const Jewel = require('../../data/Jewel_data.json');
const userSSR = require('../../data/user_ssr_data.json');
let JewelData;
let SR = ['[SR]'];
let RARE = ['[RARE]'];
let result_SR = [];
let result_RARE = [];
let content = [];
let footer;
const gachaParam = ['프리커네', 'p', '프린세스커넥트리다이브'];
result_SR[0] = SR[Math.floor(Math.random() * SR.length)];
result_RARE[0] = RARE[Math.floor(Math.random() * RARE.length)];

const battle = (myType, aiteType, myHp, aiteHp, myATK, aiteATK) => {
    let hp1 = myHp;
    let hp2 = aiteHp;
    let battleCount = 1;
    while (hp2 > 0 && hp1 > 0) {
        hp2 = hp2 - myATK * typecalc(myType, aiteType) * _.random(3, 7);
        hp1 = hp1 - aiteATK * typecalc(aiteType, myType) * _.random(3, 7);
        content.push({
            name: `${battleCount}페이즈`,
            value: `나 HP:**${hp1.toFixed(0)}** vs 상대 HP:**${hp2.toFixed(0)}**`
        });
        battleCount++;
    }
    if (hp1 > hp2) {
        content.push({
            name: `승리!`,
            value: `배틀에서 승리해 **250**쥬얼을 획득했어요.`
        });
        footer = `내 공격력 : ${myATK}\n상대 공격력 : ${aiteATK}\n타입 보너스 : ${typecalc(myType, aiteType)}배\n`;
    } else {
        content.push({
            name: `패배`,
            value: `배틀에서 패배했어요.`
        });
        footer = `내 공격력 : ${myATK}\n상대 공격력 : ${aiteATK}\n타입 보너스 : ${typecalc(myType, aiteType)}배\n`;
    }
}

const typecalc = (type1, type2) => {
    if (type1 == 'cute' && type2 == 'cool') return 1.1;
    if (type1 == 'cute' && type2 == 'passion') return 0.9;
    if (type1 == 'cute' && type2 == 'cute') return 1;
    if (type1 == 'cool' && type2 == 'passion') return 1.1;
    if (type1 == 'cool' && type2 == 'cool') return 1;
    if (type1 == 'cool' && type2 == 'cute') return 0.9;
    if (type1 == 'passion' && type2 == 'cute') return 1.1;
    if (type1 == 'passion' && type2 == 'cool') return 0.9;
    if (type1 == 'passion' && type2 == 'passion') return 1;
}

module.exports = (client) => {
    client.on('message', message => {
        let command = util.slice(message.content);

        const cardListUp = () => {
            const userSSR = require('../../data/user_ssr_data.json');
            let tosend = [];
            userSSR[message.author.id].cardData.forEach((cardList, i) => { tosend.push(`${i + 1}. ${cardList.cardName}`); });
            let page = Math.ceil(userSSR[message.author.id].cardData.length) / 10;
            let index = 0;
            let embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
            message.channel.send(util.embedFormat(`획득 쓰알 리스트 **총${userSSR[message.author.id].cardData.length}**장`, embed))
                .then(async (sentMessage) => {
                    await sentMessage.react('\u2B05')
                        .then(() => {
                            const filter = (reaction, user) => reaction.emoji.name === '\u2B05' && user.id === message.author.id;
                            const collector = sentMessage.createReactionCollector(filter);
                            collector.on('collect', reaction => {
                                if (index != 0) index--;

                                embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
                                sentMessage.edit(util.embedFormat(`획득 쓰알 리스트 **총${userSSR[message.author.id].cardData.length}**장`, embed));
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
                                sentMessage.edit(util.embedFormat(`획득 쓰알 리스트 **총${userSSR[message.author.id].cardData.length}**장`, embed));
                                reaction.remove(message.author.id);
                            });
                            collector.on('end', () => sentMessage.clearReactions());
                        });
                });
        }

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
                            let sagisawa = _.random(0, userSSR[message.author.id].cardData.length - 1);
                            let fumika = _.random(0, userSSR[memberArray[message.guild.id].memberList[selectedList].userId].cardData.length - 1);
                            content = [];
                            footer;
                            content.push({
                                name: `대전 결과`,
                                value: `${userSSR[message.author.id].cardData[sagisawa].cardName} vs ${userSSR[memberArray[message.guild.id].memberList[selectedList].userId].cardData[fumika].cardName}`
                            });
                            let tempSort = [Number(userSSR[message.author.id].cardData[sagisawa].vocal), Number(userSSR[message.author.id].cardData[sagisawa].dance), Number(userSSR[message.author.id].cardData[sagisawa].visual)];
                            tempSort.sort(function (a, b) {
                                return b - a;
                            });
                            let tempSort2 = [Number(userSSR[memberArray[message.guild.id].memberList[selectedList].userId].cardData[fumika].vocal), Number(userSSR[memberArray[message.guild.id].memberList[selectedList].userId].cardData[fumika].dance), Number(userSSR[memberArray[message.guild.id].memberList[selectedList].userId].cardData[fumika].visual)];
                            tempSort2.sort(function (a, b) {
                                return b - a;
                            });
                            let myATK = (tempSort[0] / 3 + tempSort[1] / 4 + tempSort[2] / 5) / 8;
                            let aiteATK = (tempSort2[0] / 3 + tempSort2[1] / 4 + tempSort2[2] / 5) / 8;
                            battle(userSSR[message.author.id].cardData[sagisawa].cardType, userSSR[memberArray[message.guild.id].memberList[selectedList].userId].cardData[fumika].cardType, userSSR[message.author.id].cardData[sagisawa].sum, userSSR[memberArray[message.guild.id].memberList[selectedList].userId].cardData[fumika].sum, myATK.toFixed(0), aiteATK.toFixed(0));
                            message.channel.send({
                                embed: {
                                    title: `${message.author.lastMessage.member.nickname} vs ${memberArray[message.guild.id].memberList[selectedList].userNickName}`,
                                    color: '3447003',
                                    fields: content,
                                    timestamp: new Date(),
                                    footer: {
                                        icon_url: client.user.avatarURL,
                                        text: footer
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
            if (!Jewel[message.author.id]) Jewel[message.author.id] = { Jewel: 0 };
            JewelData = Jewel[message.author.id];
            const result = [':star:', ':comet:', ':crescent_moon:', ':snowflake:', ':cherry_blossom:', ':hibiscus:'];
            const result1 = _.random(0, result.length - 1);
            const result2 = _.random(0, result.length - 1);
            const result3 = _.random(0, result.length - 1);

            if (result[result1] == result[result2] && result[result1] == result[result3]) {
                JewelData.Jewel += 7000;
                message.reply({
                    embed: {
                        title: `${result[result1]}   ${result[result2]}   ${result[result3]}`,
                        color: 3447003,
                        description: `**__*승리!*__**\n게임에서 승리하여 **7,000**개의 쥬얼을 획득했어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            } else if (result[result1] == result[result2] || result[result1] == result[result3] || result[result2] == result[result3]) {
                JewelData.Jewel += 50;
                message.reply({
                    embed: {
                        title: `${result[result1]}   ${result[result2]}   ${result[result3]}`,
                        color: 3447003,
                        description: `**__*아깝네요.*__**\n**300**개의 쥬얼을 획득했어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
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

        if (command.command == '카드' && !command.param) {
            if (userSSR[message.author.id] == null) return message.channel.send({ embed: { color: 3447003, description: `획득한 쓰알이 없네요.` } });
            cardListUp();
        }

        if (command.command == '카드' && command.param == '이적') {
            if (userSSR[message.author.id] == null) return message.channel.send({ embed: { color: 3447003, description: `획득한 쓰알이 없네요.` } });
            if (command.content) {
                if (isNaN(parseInt(command.content)) || !userSSR[message.author.id].cardData[parseInt(command.content) - 1]) return message.channel.send('올바르지 않은 입력값입니다.');
                let delData = userSSR[message.author.id].cardData[parseInt(command.content) - 1];
                userSSR[message.author.id].cardData.splice(parseInt(command.content) - 1, 1);
                fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                JewelData = Jewel[message.author.id];
                //JewelData.Jewel += 1000;
                message.channel.send({
                    embed: {
                        title: `바이바이 ${delData.idolName}!`,
                        color: 3447003,
                        description: `아이돌을 이적시켜 **1,000**쥬얼을 얻었어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            } else {
                Promise.resolve(cardListUp())
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((collected) => {
                                if (collected.first().content == '취소') throw new Error('취소했습니다.');
                                if (isNaN(parseInt(collected.first().content)) || !userSSR[message.author.id].cardData[parseInt(collected.first().content) - 1]) throw new Error('올바르지 않은 입력값입니다.');
                                let delData = userSSR[message.author.id].cardData[parseInt(collected.first().content) - 1];
                                userSSR[message.author.id].cardData.splice(parseInt(collected.first().content) - 1, 1);
                                fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                                JewelData = Jewel[message.author.id];
                                //JewelData.Jewel += 1000;
                                message.channel.send({
                                    embed: {
                                        title: `바이바이 ${delData.idolName}!`,
                                        color: 3447003,
                                        description: `아이돌을 이적시켜 **1,000**쥬얼을 얻었어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                                    }
                                });
                            })
                            .catch((err) => {
                                if (!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                                else message.channel.send(err.message);
                            });
                    });
            }
        }

        if (command.command == '카드' && command.param == '상세정보') {
            if (userSSR[message.author.id] == null) return message.channel.send({ embed: { color: 3447003, description: `획득한 쓰알이 없네요.` } });
            if (command.content) {
                if (isNaN(parseInt(command.content)) || !userSSR[message.author.id].cardData[parseInt(command.content) - 1]) return message.channel.send('올바르지 않은 입력값입니다.');
                let detailData = userSSR[message.author.id].cardData[parseInt(command.content) - 1];
                let tempSort = [Number(detailData.vocal), Number(detailData.dance), Number(detailData.visual)];
                tempSort.sort(function (a, b) {
                    return b - a;
                });
                let cardATK = (tempSort[0] / 3 + tempSort[1] / 4 + tempSort[2] / 5) / 8;
                message.channel.send({
                    embed: {
                        title: `${detailData.cardName}의 상세정보`,
                        color: 3447003,
                        description: `**이름** : ${detailData.idolName}\n**타입** : ${detailData.cardType}\n**유형** : ${detailData.gentei}\n**보컬수치** : ${detailData.vocal}\n**댄스수치** : ${detailData.dance}\n**비쥬얼수치** : ${detailData.visual}\n**총 합** : ${detailData.sum}\n**공격력** : ${cardATK.toFixed(0)}\n`
                    }
                });
            } else {
                Promise.resolve(cardListUp())
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((collected) => {
                                if (collected.first().content == '취소') throw new Error('취소했습니다.');
                                if (isNaN(parseInt(collected.first().content)) || !userSSR[message.author.id].cardData[parseInt(collected.first().content) - 1]) throw new Error('올바르지 않은 입력값입니다.');
                                let detailData = userSSR[message.author.id].cardData[parseInt(collected.first().content) - 1];
                                let tempSort = [Number(detailData.vocal), Number(detailData.dance), Number(detailData.visual)];
                                tempSort.sort(function (a, b) {
                                    return b - a;
                                });
                                let cardATK = (tempSort[0] / 3 + tempSort[1] / 4 + tempSort[2] / 5) / 8;
                                message.channel.send({
                                    embed: {
                                        title: `${detailData.cardName}의 상세정보`,
                                        color: 3447003,
                                        description: `**이름** : ${detailData.idolName}\n**타입** : ${detailData.cardType}\n**유형** : ${detailData.gentei}\n**보컬수치** : ${detailData.vocal}\n**댄스수치** : ${detailData.dance}\n**비쥬얼수치** : ${detailData.visual}\n**총 합** : ${detailData.sum}\n**공격력** : ${cardATK.toFixed(0)}\n`
                                    }
                                });
                            })
                            .catch((err) => {
                                if (!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                                else message.channel.send(err.message);
                            });
                    });
            }
        }

        if (command.command == "가챠") {
            if (gachaParam.includes(command.param)) {
                let content = [];
                let SR_COUNT = 0;
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == 9) {
                        if (gacha <= '2') {
                            let objectCount = Object.keys(Pdata.three_star).length;
                            let gachaResult = Pdata.three_star[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                            content.push({
                                name: `★★★__${gachaResult.name}__`,
                                value: `[${gachaResult.type}] ${gachaResult.gacha_type}`, inline: true
                            });
                        } else if (gacha >= '3') {
                            let objectCount = Object.keys(Pdata.two_star).length;
                            let gachaResult = Pdata.two_star[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                            content.push({
                                name: `★★${gachaResult.name}`,
                                value: `[${gachaResult.type}] ${gachaResult.gacha_type}`, inline: true
                            });
                        }
                    } else if (gacha <= '2') {
                        let objectCount = Object.keys(Pdata.three_star).length;
                        let gachaResult = Pdata.three_star[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                        content.push({
                            name: `★★★__${gachaResult.name}__`,
                            value: `[${gachaResult.type}] ${gachaResult.gacha_type}`, inline: true
                        });
                    } else if ('3' <= gacha && gacha <= '20') {
                        let objectCount = Object.keys(Pdata.two_star).length;
                        let gachaResult = Pdata.two_star[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                        content.push({
                            name: `★★${gachaResult.name}`,
                            value: `[${gachaResult.type}] ${gachaResult.gacha_type}`, inline: true
                        });
                    } else if (gacha >= '21') {
                        let objectCount = Object.keys(Pdata.one_star).length;
                        let gachaResult = Pdata.one_star[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                        content.push({
                            name: `★${gachaResult.name}`,
                            value: `[${gachaResult.type}] ${gachaResult.gacha_type}`, inline: true
                        });
                        SR_COUNT++
                    }
                }
                return message.channel.send({
                    embed: {
                        title: `가챠 결과`,
                        color: 3447003,
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }
            SR_RESULT = 0;
            RARE_RESULT = 0;
            SR_COUNT = 0;
            let objectCount = Object.keys(data.ssr).length;
            for (let i = 0; i < 10; i++) {
                let gacha = Math.floor((Math.random() * 100) + 1);
                if (SR_COUNT == 9) {
                    SR_RESULT++;
                } else if (gacha <= '3') {
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
                    if (!userSSR[message.author.id]) {
                        userSSR[message.author.id] = {}, userSSR[message.author.id].cardData = [];
                        fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
                    }
                    const result = userSSR[message.author.id].cardData.find(senkawa => senkawa.cardName === gachaResult.title + gachaResult.name);
                    if (!result == true) {
                        userSSR[message.author.id].cardData.push({ idolName: gachaResult.name, cardName: gachaResult.title + gachaResult.name, cardType: gachaResult.type, gentei: gachaResult.gacha_type, vocal: gachaResult.vocal, dance: gachaResult.dance, visual: gachaResult.visual, sum: gachaResult.sum });
                        fs.writeFileSync('./data/user_ssr_data.json', JSON.stringify(userSSR, null, '\t'));
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
                } else if ('4' <= gacha && gacha <= '13') {
                    SR_RESULT++;
                } else if (gacha >= '14') {
                    RARE_RESULT++;
                    SR_COUNT++;
                }
            } message.channel.send(`획득한 RARE : ${RARE_RESULT} \n획득한 SR : ${SR_RESULT}`);
        }

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

        /* if (command.command ==  '가챠') {
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
        } */
        if (_.isEmpty(Jewel)) return;
        else fs.writeFileSync('./data/Jewel_data.json', JSON.stringify(Jewel));
    });
};