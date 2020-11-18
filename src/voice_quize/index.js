const axios = require('axios');
const config = require('../../config.json');
const util = require('../util.js');

module.exports = (client) => {
    client.on('message', message => {
        let command = util.slice(message.content);
        if (command.command == "카드퀴즈") {
            let Paramcount = Math.floor((Math.random() * 9) + 0);
            axios({
                method: 'get',
                url: 'https://shadowverse-portal.com/api/v1/cards',
                params: {
                    'format': 'json',
                    'lang': 'ko',
                    'clan': Paramcount
                }
            }).then((res) => {
                //console.log(res.data.data.cards.length)
                let count = Math.floor((Math.random() * res.data.data.cards.length) + 1);
                //console.log(count);
                //console.log(res.data.data.cards[count])
                let correctCard = res.data.data.cards[count].card_name;
/*                 console.log(res.data.data.cards[count].card_name); */
                let cardText = res.data.data.cards[count].skill_disc;
                let cardCost = res.data.data.cards[count].cost;
                let cardATKLIFE = res.data.data.cards[count].atk + '/' + res.data.data.cards[count].life;
                if(cardATKLIFE == '0/0'){
                    cardATKLIFE = '주문/마법진'
                }
                message.channel.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: '섀도우버스 카드 맞추기',
                        fields: [{
                            name: `${cardCost}코스트 ${cardATKLIFE}`,
                            value: `${cardText.replace(/<br>/gi, `\n`)}`
                        }],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간 '
                        }
                    }
                }).then(() => {
                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((collected) => {
                            if (collected.first().content.replace(/\s/gi, ``) == correctCard.replace(/\s/gi, ``)) {
                                message.channel.send('정답이에요');
                            } else {
                                message.channel.send(`땡! 정답은 **${correctCard}**이었어요.`);
                            }
                        }, (err) => {
                            message.channel.send('Error occured : `' + err + '`');
                        })
                        .catch(() => {
                            message.channel.send('시간이 초과되었습니다. 다시 시작해주세요.');
                        });
                });
            }).catch((err) => {
                message.channel.send('Error occured : `' + err + '`');
            })
        }
    });
};

