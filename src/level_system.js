const discord = require('discord.js');
const prefix = require('../config.json').prefix;
const fs = require('fs');
let points = JSON.parse(fs.readFileSync('./data/level_data.json', 'utf8'));
//let Jewel  = JSON.parse(fs.readFileSync('./data/Jewel_data.json', 'utf8'));
const _ = require('lodash');
const Jewel = require('../data/Jewel_data.json');
const util = require('./util.js');

module.exports = (client) => {
    client.on('message', message => {
        const parsed = util.slice(message.content);

        //if (!message.content.startsWith(prefix)) return;
        if (message.author.bot) return;

        if (!points[message.author.id]) points[message.author.id] = {
            points: 0,
            level: 0
        };
        if (!Jewel[message.author.id]) Jewel[message.author.id] = {
            Jewel: 0
        };
        let userData = points[message.author.id];
        let JewelData =Jewel[message.author.id];
        userData.points++;

        let curLevel = Math.floor(1 * Math.sqrt(userData.points));
        if (curLevel > userData.level) {
            
            // 레벨업!
            userData.level = curLevel;
            JewelData.Jewel += 250;
            let tempJewel = '';
            let upMessage = '';
            tempJewel =+ parseInt(250);
            let count10 = userData.level % 10;
            if(count10==0){
                JewelData.Jewel += 1000;
                tempJewel += parseInt(1000);
                upMessage = `**__${userData.level}__**레벨 보상으로`;
            } else{
                upMessage = '보상으로';
            }
            let usrAvatar = message.author.avatarURL;
            const embed = new discord.RichEmbed()
                .setTitle('레벨업!')
                .setAuthor(client.user.username, client.user.avatarURL)
                .setColor(3447003)
                .setDescription('축하드려요! 레벨업 했어요.')
                .setFooter('명령어 입력 시간', client.user.avatarURL) //하단 아바타 이미지
                .setThumbnail(usrAvatar) //썸네일 이미지
                .setTimestamp()
                .addField('현재 유저 레벨/ 유저 경험치',
                    `현재 레벨은 **__${userData.level}__**, 경험치는 **__${userData.points}__** 이에요.`)
                .addField('레벨업 보상',
                    `${upMessage} **__${tempJewel}__**개의 쥬얼을 얻었어요.`)
                .addField('현재 소유 쥬얼',
                    `**__${JewelData.Jewel}__**개`);
            message.channel.send({ embed });
        }

        if (parsed.command == '레벨') {
            let leftLevel = (userData.level+1)*(userData.level+1)-(userData.points);
            message.reply({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: '레벨',
                    fields: [
                        {
                            name: `현재 레벨은 **__${userData.level}__**, 경험치는 **__${userData.points}__** 이에요.`,
                            value: `다음 레벨까지 **__${leftLevel}__** 남았어요.`
                        }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        }
        if (parsed.command == '쥬얼') {
            const Jewel = require('../data/Jewel_data.json');
            let JewelData =Jewel[message.author.id];
            message.reply(`현재 쥬얼은 **__${JewelData.Jewel.toLocaleString()}__**개 있어요.`);
        }

        if(parsed.command == "쥬얼슬롯"){
            const Jewel = require('../data/Jewel_data.json');
            let JewelData =Jewel[message.author.id];
            const result = [':star:', ':comet:', ':crescent_moon:', ':zap:', ':snowflake:', ':mushroom:', ':cherry_blossom:', ':hibiscus:'];
            const result1 = _.random(0, result.length - 1);
            const result2 = _.random(0, result.length - 1);
            const result3 = _.random(0, result.length - 1);
            message.reply(`${result[result1]}   ${result[result2]}   ${result[result3]}`);

            if(result[result1] == result[result2] && result[result1] == result[result3]){
                JewelData.Jewel += 7000;
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `**__*승리!*__**\n게임에서 승리하여 **7,000**개의 쥬얼을 획득했어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            } else if(result[result1] == result[result2] || result[result1] == result[result3] || result[result2] == result[result3]){
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `**__*아깝네요.*__**\n그러나 자비롭게 본전만은 돌려받아 **250**개의 쥬얼을 획득했어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            } else {
                JewelData.Jewel -= 250;
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `**__*패배!*__**\n인생이 뭐 그렇죠. **250**개의 쥬얼을 잃었어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            }
        }

        /* if (parsed.command == '쥬얼가챠'){
            let JewelData =Jewel[message.author.id];
            if (Math.random()<0.7) {
                JewelData.Jewel -= 500;
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `**__*패배*!__**\n게임에서 패배하여 **500**개의 쥬얼을 잃었어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            } else {
                JewelData.Jewel += 1000;
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `**__*승리!*__**\n게임에서 승리하여 **1,000**개의 쥬얼을 획득했어요.\n현재 쥬얼 : **${JewelData.Jewel.toLocaleString()}**개`
                    }
                });
            }
        } */

        if(_.isEmpty(points)) return;
        else fs.writeFileSync('./data/level_data.json', JSON.stringify(points));
        if(_.isEmpty(Jewel)) return;
        else fs.writeFileSync('./data/Jewel_data.json', JSON.stringify(Jewel));
    });
};
