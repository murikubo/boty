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
//import kancolle_fm
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

let pie = '3.14'; //원주율
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
    let word3 = ['어쩌라고요', '싫은데요?', '꺼져요 좀', '아 그래서 뭐요', '제가 왜 그래야하죠?', '쥐보다 못 한 주제에 자꾸 그러지 마세요' , '엄청 띠껍네요', '본인 이야기인가요?', '그러시던가요.', '쫄았어요?', '그러고 싶으세요?', '사람이란게 컴퓨터한테 그러고 싶어요?']
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
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
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
        } else {
            if (mod.mod.jkJK == '1') {
                message.channel.send('.추천곡', { code: 'true' });
                message.channel.send('해당 명령어로 후미카씨가 각 계절에 맞는 곡들을 랜덤으로 추천해주는 것 같아 인거예요!');
                message.channel.send('> *__하와와~ 그러나 후미카씨가 25%의 확률로 자신의 곡을 추천!__*');
            } else if (mod.mod.jk == '0') {
                message.channel.send('.추천곡', { code: 'true' });
                message.channel.send('해당 명령어로 후미카씨가 각 계절에 맞는 곡들을 랜덤으로 추천해줍니다!');
                message.channel.send('> *__그러나 후미카씨가 25%의 확률로 자신의 곡을 추천합니다.__*');
            }
        }
    }

    if (parsed.command == '명령어') {
        if (mod.mod.jk == '1') {
            const embed = new discord.RichEmbed()
                .setTitle("명령어")
                .setAuthor(client.user.username, client.user.avatarURL)
                .setColor(3447003)
                .setDescription("**__명령어 앞에 .을 붙여서 이용하실 수 있는거예요.__**")
                .setFooter("명령어 입력 시간", client.user.avatarURL)
                .setTimestamp()
                .addField("가챠",
                    "게임과 동일한 확률로 10연가샤 시뮬을 지원하는거예요")
                .addField("페스",
                    "가챠의 출현 테이블에 페스돌을 추가하고 SSR의 확률을 두 배 높이는거예요")
                .addField("한정",
                    "가챠의 출현 테이블에 한정돌을 추가하는거예요")
                .addField("통상",
                    "가챠의 출현 테이블에서 한정돌을 전부 제거하고 SSR의 확률을 원래대로 돌리는거예요")
                .addField("생략",
                    "가챠시 SSR등장 외 카드들은 결과로만 알려주는거예요")
                .addField("전부",
                    "가챠시 SSR등장 외 카드들도 전부 알려주는거예요")
                .addField("여고생모드",
                    "일부 대답을 여고생 말투로 하는 후미카씨의 여고생모드를 on하는거예요")
                .addField("해제",
                    "여고생모드를 해제하는거예요")
                .addField("모드",
                    "현재의 여고생모드와 신데페스 모드/한정모드의 on/off 여부를 알려주는거예요")
                .addField("도움말",
                    "추천곡 기능의 도움말을 표출하는거예요")
                .addField("야 + 할 말",
                    "질문에 대한 일정한 대답을 얻을 수 있는거예요")
                .addField("말 + 할 말",
                    "후미카씨에게 입력한 말을 시킬 수 있는거예요")
                .addField("번역기",
                    "하와와...여기다 써놨다간 가독성이 떨어질거에요. 아래의 페이지를 참고하는거예요")
                .addField("변환/qusghks",
                    "한영키가 안 먹히거나 귀찮을 때 영타를 한글로 바꿔주는거예요")
                .addField("유튜브/유튭 + 제목",
                    "유튜브에서 해당 제목에 대한 검색 후 영상의 ID값을 불러오는거예요")
                .addField("유튜브/유튭 -p + 제목",
                    "유튜브에서 해당 제목에 대한 플레이리스트를 검색 후 플레이리스트의 ID값을 불러오는거예요")
                .addField("환율",
                    "5분마다 갱신되는 일본 엔(100엔)->한국 원의 환율정보를 나타내는거예요")
                .addField("환율 -jk + 액수",
                    "5분마다 갱신되는 일본 엔(액수)->한국 원의 환율정보를 나타내는거예요.")
                .addField("환율 -kj + 액수",
                    "5분마다 갱신되는 한국 원(액수)->일본 엔의 환율정보를 나타내는거예요.")
                .addField("코드 + 수도권 전철역",
                    "입력한 전철역의 노선과 역 코드를 불러오는거예요.(실험중인 기능)")
                .addField("현재시간 + 수도권 전철역 코드",
                    "입력한 전철역 코드에 해당되는 전철역의 현재 시간 시간표를 5개까지(5개 미만인 경우 +1시간까지)표출하는거예요.(실험중인 기능인거예요)/현재까지는 상행 평일 한정 인거예요.")
                .addField("길찾기 + 출발 역/도착 역",
                    "출발 역에서부터 도착 역까지 최단시간/최단경로 각 각 한 개씩의 경로와 걸리는 시간을 표출하는거예요.")
                .addField("지역 + 검색어",
                    "입력한 지역에서 입력한 검색어 위치 정보를 5개까지 표출하는거예요.")
                .addField("romaji/kana/hira/로마지/가타카나/히라가나 + 한글",
                    "입력한 한글을 해당 언어로 바꿔주는거예요.")
                .addField("할일",
                    "페이지를 참조해주세요.")

            message.author.send({ embed });

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
                        value: "하왓! 모든 명령어를 일람할 수 있는 안내 페이지인거예요"
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        } else if (mod.mod.jk == '0') {
            const embed = new discord.RichEmbed()
                .setTitle("명령어")
                .setAuthor(client.user.username, client.user.avatarURL)
                .setColor(3447003)
                .setDescription("**__명령어 앞에 .을 붙여서 이용하실 수 있습니다.__**")
                .setFooter("명령어 입력 시간", client.user.avatarURL)
                .setTimestamp()
                .addField("가챠",
                    "게임과 동일한 확률로 10연가샤 시뮬을 지원합니다.")
                .addField("페스",
                    "가챠의 출현 테이블에 페스돌을 추가하고 SSR의 확률을 두 배 높입니다.")
                .addField("한정",
                    "가챠의 출현 테이블에 한정돌을 추가합니다.")
                .addField("통상",
                    "가챠의 출현 테이블에서 한정돌을 전부 제거하고 SSR의 확률을 원래대로 돌립니다.")
                .addField("생략",
                    "가챠시 SSR등장 외 카드들은 결과로만 알려줍니다.")
                .addField("전부",
                    "가챠시 SSR등장 외 카드들도 전부 알려줍니다.")
                .addField("여고생모드",
                    "일부 대답을 여고생 말투로 하는 후미카씨의 여고생모드를 on합니다.")
                .addField("해제",
                    "여고생모드를 해제합니다.")
                .addField("모드",
                    "현재의 여고생모드와 신데페스 모드/한정모드의 on/off 여부를 알려줍니다.")
                .addField("도움말",
                    "추천곡 기능의 도움말을 표출합니다.")
                .addField("야 + 할 말",
                    "질문에 대한 일정한 대답을 얻을 수 있습니다.")
                .addField("말 + 할 말",
                    "후미카씨에게 입력한 말을 시킬 수 있습니다.")
                .addField("번역기",
                    "여기다 써놨다간 가독성이 떨어질거에요. 아래의 페이지를 참고하세요.")
                .addField("변환/qusghks",
                    "한영키가 안 먹히거나 귀찮을 때 영타를 한글로 바꿔줍니다.")
                .addField("유튜브/유튭 + 제목",
                    "유튜브에서 해당 제목에 대한 검색 후 영상의 ID값을 불러옵니다.")
                .addField("유튜브/유튭 -p + 제목",
                    "유튜브에서 해당 제목에 대한 플레이리스트를 검색 후 플레이리스트의 ID값을 불러옵니다.")
                .addField("환율",
                    "5분마다 갱신되는 일본 엔(100엔)->한국 원의 환율정보를 나타냅니다.")
                .addField("환율 -jk + 액수",
                    "5분마다 갱신되는 일본 엔(액수)->한국 원의 환율정보를 나타냅니다.")
                .addField("환율 -kj + 액수",
                    "5분마다 갱신되는 한국 원(액수)->일본 엔의 환율정보를 나타냅니다.")
                .addField("코드 + 수도권 전철역",
                    "입력한 전철역의 노선과 역 코드를 불러옵니다.(실험중인 기능)")
                .addField("현재시간 + 수도권 전철역 코드",
                    "입력한 전철역 코드에 해당되는 전철역의 현재 시간 시간표를 5개까지(5개 미만인 경우 +1시간까지)표출합니다.(실험중인 기능)/현재까지는 상행 평일 한정.")
                .addField("길찾기 + 출발 역/도착 역",
                    "출발 역에서부터 도착 역까지 최단시간/최단경로 각 각 한 개씩의 경로와 걸리는 시간을 표출합니다.")
                .addField("지역 + 검색어",
                    "입력한 지역에서 입력한 검색어 위치 정보를 5개까지 표출합니다.")
                .addField("romaji/kana/hira/로마지/가타카나/히라가나 + 한글",
                    "입력한 한글을 해당 언어로 바꿔줍니다.")
                .addField("할일",
                    "페이지를 참조해주세요.")

            message.author.send({ embed });

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
    }

    if (parsed.command == '추천곡') {
        let flag = Math.floor((Math.random() * 4) + 1);
        if (flag == '1') {
            message.channel.send(result1[0]);
        } else if (flag == '2') {
            message.channel.send(result1[0]);
        } else if (flag == '3') {
            //message.channel.send('sagisawa fumika - bright blue old clock remix');
            message.channel.send('*검열스킵 당했습니다*');
        } else if (flag == '4') {
            message.channel.send(result1[0]);
        }
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
        if(message.author.id == 415681577033400320) return message.channel.send('범죄계수 0');
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

    if (parsed.command == '범수') {
        if (mod.mod.jk == '1') {
            message.channel.send('하와와 가수 김범수 너무 멋진거예요');
        } else if (mod.mod.jk == '0') {
            message.channel.send('개수작 부리지 마세요');
        }
    }

    if (parsed.command == '원주율') {
        if (pie == '3.14') {
            message.channel.send('자, 한 번만 말씀드릴게요.');
            message.channel.send('pi = 3.1415926535 8979323846 2643383279 5028841971 6939937510 5820974944 5923078164 0628620899 8628034825 3421170679 8214808651 3282306647 0938446095 5058223172 5359408128 4811174502 8410270193 8521105559 6446229489 5493038196 4428810975 6659334461 2847564823 3786783165 2712019091 4564856692 3460348610 4543266482 1339360726 0249141273 7245870066 0631558817 4881520920 9628292540 9171536436 7892590360 0113305305 4882046652 1384146951 9415116094 3305727036 5759591953 0921861173 8193261179 3105118548 0744623799 6274956735 1885752724 8912279381 8301194912 9833673362 4406566430 8602139494 6395224737 1907021798 6094370277 0539217176 2931767523 8467481846 7669405132 0005681271 4526356082 7785771342 7577896091 7363717872 1468440901 2249534301 4654958537 1050792279 6892589235 4201995611 2129021960 8640344181 5981362977 4771309960 5187072113 4999999837 2978049951 0597317328 1609631859 5024459455 3469083026 4252230825 3344685035 2619311881 7101000313 7838752886 5875332083 8142061717 7669147303 5982534904 2875546873 1159562863 8823537875 9375195778 1857780532 1712268066 1300192787 6611195909 2164201989 ');
            pie = '6.28';
        } else if (pie == '6.28'); {
            message.channel.send('저는 한 번만 말씀드린다고 했어요.');
            message.channel.send('이제 재부팅 전에는 말씀 안 해드릴거에요.');
        }
    }

    if (parsed.command == '이벤트') {
        // 디데이 설정
        var d_day = new Date(2018, 3, 23);

        // 오늘날짜 설정
        var t_day = new Date();
        console.log(d_day);
        console.log(t_day);

        message.channel.send('이벤트까지 남은 시간은 ' + d_day - t_day + '입니다.'); //몰라 언젠간 완료하겠지
    }

    if (parsed.command == '아바타') {
        message.reply(message.author.avatarURL);
    }
    if (parsed.command == '나는') {
        message.channel.send('파리의 택시운전사');
    }
    if (parsed.command == '채널아이디') {
        if (mod.mod.jk == '1') {
            message.channel.send('현재 속해있는 채널의 아이디는 : ' + message.channel.id + '인거예요.');
        } else if (mod.mod.jk == '0') {
            message.channel.send('현재 속해있는 채널의 아이디는 : ' + message.channel.id + '입니다.');
        }
    }

    if (parsed.command == '흥흥흥흥~') {
        message.channel.send('프레데리카~');
    }
    if (parsed.command == '아이디') {
        if (mod.mod.jk == '1') {
            message.channel.send('당신의 아이디는 : ' + message.author.id + '인거예요.');
        } else if (mod.mod.jk == '0') {
            message.channel.send('당신의 아이디는 : ' + message.author.id + '입니다.');
        }
    }
    if (parsed.command == '이름') {
        if (mod.mod.jk == '0') {
            message.channel.send('당신의 이름은 ' + message.author.username + ' 입니다.');
        } else if (mod.mod.jk == '1') {
            message.channel.send('하와와 당신의 이름은 ' + message.author.username + ' 인거예요.');
        }
    }
    if (parsed.command == '계정정보') {
        message.channel.send('계정 생성 시간 : ' + message.author.createdTimestamp + '\n' + '가입시 입력 한 이름 : ' + message.author.username + '\n' + '현재 계정 상태 : ' + message.author.presence.status + '\n' + '계정 tag : ' + message.author.tag, { code: 'true' });
    }

    if (parsed.command == '이과') {
        if (mod.mod.jk == '1') {
            message.channel.send('하와와 이과충은 죽는 것 이예요');
        } else if (mod.mod.jk == '0') {
            message.channel.send('이과충 죽어');
        }
    }
    if (parsed.command == '성덕') {
        if (mod.mod.jk == '0') {
            message.channel.send('세상말종쓰레기자식 죽어');
        } else if (mod.mod.jk == '1') {
            message.channel.send('세상말종쓰레기자식 죽는 거예요 하와와')
        }
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

/*     if (parsed.command == '플레이리스트') {
        message.channel.send('.pl https://www.youtube.com/playlist?list=PLj-mFP8wSkPmZwhVRwru2Ej9wlv_30zx2');
    } */
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
