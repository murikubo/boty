require('events').EventEmitter.defaultMaxListeners = 30;


const discord = require('discord.js');
const client = new discord.Client();
const fs = require('fs');
const yt = require('ytdl-core');
const http = require('http');
const url = require('url');
const config = require('./config.json');
const ssrData = require('./data/ssr_data.json');
const general = require('./data/general_data.json');
const talkedRecently = new Set();
const seoul_bike = require('./src/seoul_bike')(client);
const lab2 = require('./src/lab2')(client);
const lab3 = require('./src/lab3')(client);
const util = require('./src/util.js');
const gachaSimul = require('./src/gachaSimul')(client);
const smartypants = require('./src/doc_smartypants')(client);
const laboratory = require('./src/laboratory')(client);
const metro = require('./src/metro')(client);
const swearWords = require('./src/swear_words')(client);
const music = require('./src/music')(client);
//const levelSystem = require('./src/level_system')(client); // Excepted until solve "input null data"
const exchange = require('./src/exchange')(client);
const lotto = require('./src/lotto')(client);
//const voiceQuiz = require('./src/voice_quiz')(client);
const voiceQuiz = require('./src/voice_quize')(client);
const seoulDust = require('./src/seoul_dust')(client);
const youtube = require('./src/youtube')(client);
const todo = require('./src/todo')(client);
const crawling = require('./src/crawling')(client);
const monsterHunter = require('./src/mhdb')(client);
const weather = require('./src/weather')(client);
const moduleConf = require('./module_conf');
//const setMod = require('./src/mod')(client);
// let mod = JSON.parse(fs.readFileSync("./data/mod_data.json", "utf8"));

const getTime = (s) => {
    // Pad to 2 or 3 digits, default is 2
    let pad = (n, z = 2) => ('00' + n).slice(-z);
    return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0);
};

client.on('ready', () => {
    console.info(config.version + '(' + config.codename + ')');
    client.user.setActivity(config.codename, { type: 'LISTENING' });
});
client.on('message', message => {
    //if (!message.content.startsWith(prefix)) return; //프리픽스로 시작되지 않는 명령어들은 비활성화.    

    let word1 = ['아니요', '아닐걸요?', '꼭 그래야만 하나요?', '글쎄요', '그럴까요?', '진짜요?', '진심이세요?', '아마도요.', '그렇나봐요.', '저는 잘 모르죠.', '별로요.', '어떻게 그럴 수 있나요'];
    let word3 = ['어쩌라고요', '싫은데요?', '꺼져요 좀', '아 그래서 뭐요', '제가 왜 그래야하죠?', '쥐보다 못 한 주제에 자꾸 그러지 마세요', '엄청 띠껍네요', '본인 이야기인가요?', '그러시던가요.', '쫄았어요?', '그러고 싶으세요?', '사람이란게 컴퓨터한테 그러고 싶어요?']
    let result = [];
    let result3 = [];
    result[0] = word1[Math.floor(Math.random() * word1.length)];
    result3[0] = word3[Math.floor(Math.random() * word3.length)];
    const parsed = util.slice(message.content);
    if (parsed.command == '도움말') {
        const parsedMessage = util.slice(message.content);
        if (parsedMessage.param == '시간') {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: '지하철 시간 명령어 도움말',
                    fields: [{
                        name: '.시간 역 코드 -(상행/내선)/(하행/외선)',
                        value: `ex) .시간 4109 -상행 \n\n**참고!**: 공휴일은 일요일 취급을 받아 일요일 시간표를 출력해야합니다만, 현재 코드에서는 공휴일을 걸러낼 수 없습니다. 추후 추가 예정`
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        } else if (parsedMessage.param == '쥬얼') {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: '쥬얼 관련 도움말',
                    fields: [{
                        name: '각종 명령어로 쥬얼을 벌 수 있어요',
                        value: '`쥬얼슬롯`'
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        }
    }

    if (parsed.command == '명령어') {
        message.channel.send({
            embed: {
                color: 3447003,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                title: '명령어 전체 일람',
                description: "https://murikubo.github.io/shimushu/fumikasan.html",
                fields: [{
                    name: "명령어 안내 페이지",
                    value: "모든 명령어를 일람할 수 있는 안내 페이지입니다."
                },
                {
                    name: "업데이트 로그",
                    value: "https://murikubo.github.io/shimushu/update.html"
                }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: '명령어 입력 시간 '
                }
            }
        });
    }

    if (parsed.command == '공지') {
        message.channel.send({
            embed: {
                color: 3447003,
                title: '공지',
                description: "https://murikubo.github.io/shimushu/notice.html",
                fields: [{
                    name: "현재 공지",
                    value: "현재 음악 재생 오류에 관하여(2019-07-22 확인)"
                },
                {
                    name: "업데이트 로그",
                    value: "https://murikubo.github.io/shimushu/update.html"
                }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: '명령어 입력 시간 '
                }
            }
        });
    }

    /*
       TTS참고용 주석
    if (parsed.command == '집') {
        message.channel.send('집에가고싶다', { tts: true });
    }
    */

    const memberLiset = () => {
        let tosend = [];
        memberArray[message.guild.id].memberList.forEach((member, i) => { tosend.push(`${i + 1}. ${member.userNickName}`); });
        let page = Math.ceil(memberArray[message.guild.id].memberList.length) / 10;
        let index = 0;
        let embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
        message.channel.send(util.embedFormat('도미네이터를 겨눌 상대를 선택해주세요.', embed))
            .then(async (sentMessage) => {
                await sentMessage.react('\u2B05')
                    .then(() => {
                        const filter = (reaction, user) => reaction.emoji.name === '\u2B05' && user.id === message.author.id;
                        const collector = sentMessage.createReactionCollector(filter);
                        collector.on('collect', reaction => {
                            if (index != 0) index--;

                            embed = [{ name: `${index + 1} 페이지`, value: `${tosend.slice(10 * index, (index + 1) * 10).join('\n')}` }];
                            sentMessage.edit(util.embedFormat('도미네이터를 겨눌 상대를 선택해주세요.', embed));
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
                            sentMessage.edit(util.embedFormat('도미네이터를 겨눌 상대를 선택해주세요.', embed));
                            reaction.remove(message.author.id);
                        });
                        collector.on('end', () => sentMessage.clearReactions());
                    });
            });
    }

    let memberArray = {};

    if (parsed.command == '도미네이터') {
        message.reply({
            embed: {
                color: 3447003,
                description: `휴대형 심리진단 진압·집행 시스템 도미네이터, 기동했습니다.\n유저 인증, ${message.author.username} 감시관, 공안국 형사과 소속. 사용 허가 확인. 적성 유저입니다.\n현재의 집행 모드는 논 리설 패럴라이저. 침착하게 조준하여 대상을 무력화하십시오.`
            }
        });
        memberArray[message.guild.id] = {}, memberArray[message.guild.id].memberList = [];
        let mems = client.guilds.get(message.guild.id).members;
        for (let [snowflake, guildMember] of mems) {
            if (guildMember.user.id != message.author.id) {
                if (guildMember.nickname != null) memberArray[message.guild.id].memberList.push({ userId: guildMember.user.id, userName: guildMember.user.username, userNickName: guildMember.nickname });
                else memberArray[message.guild.id].memberList.push({ userId: guildMember.user.id, userName: guildMember.user.username, userNickName: guildMember.user.username });
            }

        }
        if (memberArray[message.guild.id].memberList.length == 0) return message.channel.send({ embed: { color: 3447003, description: `겨눌 상대가 없습니다.` } });
        Promise.resolve(memberLiset())
            .then(() => {
                const filter = m => m.author.id === message.author.id;
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                })
                    .then((collected) => {
                        let selectedList = parseInt(collected.first().content) - 1;
                        if (collected.first().content == '취소') throw new Error('취소했습니다.');
                        if (isNaN(parseInt(collected.first().content)) || !memberArray[message.guild.id].memberList[parseInt(collected.first().content) - 1]) throw new Error('올바르지 않은 입력값입니다.');
                        if (memberArray[message.guild.id].memberList[selectedList].userId == 415681577033400320) return message.channel.send('범죄계수 0. 집행 대상이 아닙니다.');
                        let Sibyl_System = Math.floor((Math.random() * 999));
                        if (Sibyl_System < '100') {
                            message.reply('*범죄계수*' + Sibyl_System + ', *트리거를 락 합니다*');
                        } else if (Sibyl_System >= '300') {
                            let Sibyl_low = Math.floor((Math.random() * 3) + 1); // 300이상이 나올 확률이 압도적으로 높으므로 줄여주는 코드들.
                            if (Sibyl_low == 1) {
                                message.reply('*범죄계수*' + Sibyl_System);
                                message.reply('*범죄계수 오버 300, 신중하게 조준하여, 대상을 배제하십시오.*');
                            } else if (Sibyl_low == 2) {
                                let Sibyl_reTry_hight = Math.floor((Math.random() * 300));
                                if (Sibyl_reTry_hight < '100') {
                                    message.reply('*범죄계수*' + Sibyl_reTry_hight + ', *트리거를 락 합니다*');
                                } else if (Sibyl_reTry_hight >= '100') {
                                    message.reply('*범죄계수* ' + Sibyl_reTry_hight + ',*신중하게 조준하여 대상을 제압해주십시오.*');
                                } else if (Sibyl_reTry_hight == 300) {
                                    message.reply('*범죄계수*' + Sibyl_reTry_hight);
                                    message.reply('*범죄계수 오버 300, 신중하게 조준하여, 대상을 배제하십시오.*');
                                }
                            } else if (Sibyl_low == 3) {
                                let Sibyl_reTry_low = Math.floor((Math.random() * 100));
                                if (Sibyl_reTry_low < '100') {
                                    message.reply('*범죄계수*' + Sibyl_reTry_low + ', *트리거를 락 합니다*');
                                } else if (Sibyl_reTry_low == '100') {
                                    message.reply('*범죄계수* ' + Sibyl_reTry_low + ',*신중하게 조준하여 대상을 제압해주십시오.*');
                                }
                            }
                        } else if (Sibyl_System >= '100') {
                            message.reply('*범죄계수* ' + Sibyl_System + ',*신중하게 조준하여 대상을 제압해주십시오.*');
                        }
                    })
                    .catch((err) => {
                        if (!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                        else message.channel.send(err.message);
                    });
            });
    }

    if (parsed.command == '범죄계수') {
        if (message.author.id == 415681577033400320) return message.channel.send('범죄계수 0');
        let Sibyl_System = Math.floor((Math.random() * 999));
        if (Sibyl_System < '100') {
            message.reply('*범죄계수*' + Sibyl_System + ', *트리거를 락 합니다*');
        } else if (Sibyl_System >= '300') {
            let Sibyl_low = Math.floor((Math.random() * 3) + 1); // 300이상이 나올 확률이 압도적으로 높으므로 줄여주는 코드들.
            if (Sibyl_low == 1) {
                message.reply('*범죄계수*' + Sibyl_System);
                message.reply('*범죄계수 오버 300, 신중하게 조준하여, 대상을 배제하십시오.*');
            } else if (Sibyl_low == 2) {
                let Sibyl_reTry_hight = Math.floor((Math.random() * 300));
                if (Sibyl_reTry_hight < '100') {
                    message.reply('*범죄계수*' + Sibyl_reTry_hight + ', *트리거를 락 합니다*');
                } else if (Sibyl_reTry_hight >= '100') {
                    message.reply('*범죄계수* ' + Sibyl_reTry_hight + ',*신중하게 조준하여 대상을 제압해주십시오.*');
                } else if (Sibyl_reTry_hight == 300) {
                    message.reply('*범죄계수*' + Sibyl_reTry_hight);
                    message.reply('*범죄계수 오버 300, 신중하게 조준하여, 대상을 배제하십시오.*');
                }
            } else if (Sibyl_low == 3) {
                let Sibyl_reTry_low = Math.floor((Math.random() * 100));
                if (Sibyl_reTry_low < '100') {
                    message.reply('*범죄계수*' + Sibyl_reTry_low + ', *트리거를 락 합니다*');
                } else if (Sibyl_reTry_low == '100') {
                    message.reply('*범죄계수* ' + Sibyl_reTry_low + ',*신중하게 조준하여 대상을 제압해주십시오.*');
                }
            }
        } else if (Sibyl_System >= '100') {
            message.reply('*범죄계수* ' + Sibyl_System + ',*신중하게 조준하여 대상을 제압해주십시오.*');
        }
    }

    if (parsed.command == '야' && parsed.content != '') {
        message.channel.send(result[0]);
    }

    if (parsed.command == '야야' && parsed.content != '') {
        message.channel.send(result3[0]);
    }


    if (parsed.command == '아바타') {
        message.reply(message.author.avatarURL);
    }

    if (parsed.command == '계정정보') {
        message.channel.send('계정 생성 시간 : ' + message.author.createdTimestamp + '\n' + '가입시 입력 한 이름 : ' + message.author.username + '\n' + '현재 계정 상태 : ' + message.author.presence.status + '\n' + '계정 tag : ' + message.author.tag, { code: 'true' });
    }

    if (parsed.command == '초대') {
        const embed = new discord.RichEmbed()
            .setAuthor(`${client.user.username}`)
            .setColor(3447003)
            .setDescription(`[초대 링크](https://discordapp.com/oauth2/authorize?&client_id=415681577033400320&scope=bot&permissions=8)
            \n [명령어 일람](https://murikubo.github.io/shimushu/fumikasan.html)`)
            .setThumbnail(client.user.avatarURL)
        message.channel.send({ embed });
    }

    if (parsed.command == '정보') {
        const embed = new discord.RichEmbed()
            .setAuthor(`${client.user.username}- 기동정보`, client.user.avatarURL)
            .setColor(3447003)
            .setThumbnail(client.user.avatarURL)
            .setFooter("명령어 입력 시간", client.user.avatarURL)
            .setTimestamp()
            .addField("소속 서버 수", client.guilds.size, true)
            .addField("현재 재생중", client.voiceConnections.size, true)
            .addField("기동시간", getTime(client.uptime), true)
            .addField("버전", config.version + '(' + config.codename + ')', true)

        message.channel.send({ embed });
    }

    if (!message.guild) return;
});

client.login(config.token);

client.on('error', console.error);
