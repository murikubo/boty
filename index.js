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
const monsterHunter = require('./src/mhdb')(client);
const weather = require('./src/weather')(client);
//const setMod = require('./src/mod')(client);
let mod = JSON.parse(fs.readFileSync("./data/mod_data.json", "utf8"));

const getTime = (s) => {
    // Pad to 2 or 3 digits, default is 2
    let pad = (n, z = 2) => ('00' + n).slice(-z);
    return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0);
};

client.on('ready', () => {
    console.info(config.version);
    client.user.setActivity('Halloween♥Code', { type: 'LISTENING' });
});
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
client.on('message', message => {
    //if (!message.content.startsWith(prefix)) return; //프리픽스로 시작되지 않는 명령어들은 비활성화.    

    let word1 = ['아니요', '아닐걸요?', '꼭 그래야만 하나요?', '글쎄요', '그럴까요?', '진짜요?', '진심이세요?', '아마도요.', '그렇나봐요.', '저는 잘 모르죠.', '별로요.', '어떻게 그럴 수 있나요'];//'제가 이런 말 잘 안 하는데 이번만 말씀드릴게요.'+'\n'+'\n'+'네 그래요!'
    let word2 = ['아니예요', '아닐걸요? 인거예요', '하와와 꼭 그래야만 하나요?', '하와와...글쎄요', '호에에 그럴까요?', '호에에~ 진짜요?', '호게겟 진심이세요??', '아마도 인 것 같아예요.', '그렇나봐요 인거예요', '하와와 저는 잘 모르죠.', '호에에 별로에요.', '하와와..어떻게 그럴 수 있나요??']
    let word3 = ['어쩌라고요', '싫은데요?', '꺼져요 좀', '아 그래서 뭐요', '제가 왜 그래야하죠?', '쥐보다 못 한 주제에 자꾸 그러지 마세요', '엄청 띠껍네요', '본인 이야기인가요?', '그러시던가요.', '쫄았어요?', '그러고 싶으세요?', '사람이란게 컴퓨터한테 그러고 싶어요?']
    let result = [];
    let result2 = [];
    let result3 = [];
    result[0] = word1[Math.floor(Math.random() * word1.length)];
    result2[0] = word2[Math.floor(Math.random() * word2.length)];
    result3[0] = word3[Math.floor(Math.random() * word3.length)];
    let song = require('./data/general_data.json').song;
    let result1 = [];
    result1[0] = song[Math.floor(Math.random() * song.length)];
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

    if (parsed.command === '박수') {
        if (!message.member.voiceChannel) return message.channel.send('음성채널에 들어간 상태여야해요.');
        else {
            message.member.voiceChannel.join()
                .then(connection => {
                    connection.playArbitraryInput('https://cdn.discordapp.com/attachments/415419742648795141/459239726872788993/-_9.mp3');
                    setTimeout(function () { message.member.voiceChannel.leave() }, 9000)
                });
        }
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
        if (mod.mod.jkJK == '1') {
            message.channel.send(result2[0]);
        } else if (mod.mod.jk == '0') {
            message.channel.send(result[0]);
        }
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
            .addField("버전", config.version, true)

        message.channel.send({ embed });
    }

    if (!message.guild) return;

    if (parsed.command == '퀴이즈') {
        const embed = new discord.RichEmbed()
            .setTitle("문제!")
            .setAuthor(client.user.username, client.user.avatarURL)
            .setColor(3447003)
            .setDescription("**__문제 상세 설명 자리.__**")
            .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
            //.setImage("") //하단 이미지
            //.setThumbnail(usrAvatar) //썸네일 이미지
            .setTimestamp()
            //.setURL("") //타이틀에 URL
            .addField("1번",
                "문제가 나올 곳", true)
            .addField("2번",
                "문제가 나올 곳", true)
            .addField("3번",
                "문제가 나올 곳", true)
            .addField("4번",
                "문제가 나올 곳", true)
        //.addField("", "", true) //인라인필드
        /*
         * 빈 칸 만들어주는 필드
         */
        //.addBlankField(true)
        //.addField("필드3", "필드 25개까지.", true);

        message.channel.send({ embed })
            .then(() => {
                message.channel.awaitMessages(response => response.content === '사기사와 후미카', {
                    max: 1,
                    time: 10000,
                    errors: ['time'],
                })
                    .then((collected) => {
                        message.channel.send(`맞아요 정답이에요.`);
                    })
                    .catch(() => {
                        message.channel.send('시간 내에 입력을 못 했어요!');
                    });
            });
    }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find('name', 'member-log');
    if (!channel) return;
    channel.send(`어서와요!, ${member}`);
});

client.login(config.token);

client.on('error', console.error);
