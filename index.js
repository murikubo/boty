const discord = require('discord.js');
const client = new discord.Client();
const yt = require('ytdl-core');
//const token = 'NDE1MzcwMDYzODk4NDc2NTU1.DW1jjw.JMmcjr9Kv97DuBVFUf7WRYCTbQs'; bottest계정
const token = 'NDE1NjgxNTc3MDMzNDAwMzIw.DW5gCg.S0y5FFh_QY4g94UtZW-JG6i8UMc';
//import kancolle_fm
//import todo
//import translate


let prefix='.';
let inChannel='0'; //채널에 봇이 들어가있을 때를 구별하기 위한 전역변수. 만약 채널에 들어가있으면 1, 들어가있지 않으면 0.
let KRW_JPY = 0; //환율에 사용할 변수
let pie = '3.14'; //원주율
let JK = '0'; //여고생모드 스위치

client.on('ready', () => {
    console.info('I am ready!');
    client.user.setActivity('벚꽃 필 무렵');
});
//Test message

// Play streams using ytdl-core
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
client.on('message', message => {
    let word1 = ["아니요","아닐걸요?","꼭 그래야만 하나요?", "글쎄요", "그럴까요?", "진짜요?", "진심이세요?", "아마도요.", "그렇나봐요.", "저는 잘 모르죠.", "별로요.", "어떻게 그럴 수 있나요"];//"제가 이런 말 잘 안 하는데 이번만 말씀드릴게요."+'\n'+'\n'+"네 그래요!"
    let word2 = ["아니예요", "아닐걸요? 인거예요", "하와와 꼭 그래야만 하나요?", "하와와...글쎄요", "호에에 그럴까요?", "호에에~ 진짜요?", "호게겟 진심이세요??", "아마도 인 것 같아예요.", "그렇나봐요 인거예요", "하와와 저는 잘 모르죠.", "호에에 별로에요.", "하와와..어떻게 그럴 수 있나요??"]
    let result = [];
    let result2 = [];
    result[0] = word1[Math.floor(Math.random() * word1.length)];
    result2[0] = word2[Math.floor(Math.random() * word2.length)];
    let song = ["버스커버스커 - 벚꽃엔딩", "로이킴 - 봄봄봄", "유니 - 벚꽃비","버스커버스커 - 꽃송이가","버스커버스커 - 봄바람","天海春香,島村卯月 - M@sterpiece","vy1v4 - fairytale,","島村卯月 - Romantic Now","윤종신 - 좋니","シンデレラガールズ劇場 - キラッ！満開スマイル(eurobeat remix)","初音ミク - 千本桜","千石撫子 - 恋愛サーキュレーション", "10cm - 봄이 좋냐", "김광진 - 동경소녀", "울랄라세션 - 달의 몰락", "桜の頃 EDM remix", "LG 빡치게 하는 노래"];
    let result1 = [];
    result1[0] = song[Math.floor(Math.random() * song.length)];

    if (message.content.search(prefix) != -1) {
        if (message.content.slice(prefix.length) === '도움말') {
            if (JK == '1') {
                message.channel.send('.추천곡', { code: 'true' });
                message.channel.send('해당 명령어로 후미카씨가 각 계절에 맞는 곡들을 랜덤으로 추천해주는 것 같아 인거예요!');
                message.channel.send('> *__하와와~ 그러나 후미카씨가 25%의 확률로 자신의 곡을 추천!__*');
            } else if (JK == '0') {
                message.channel.send('.추천곡', { code: 'true' });
                message.channel.send('해당 명령어로 후미카씨가 각 계절에 맞는 곡들을 랜덤으로 추천해줍니다!');
                message.channel.send('> *__그러나 후미카씨가 25%의 확률로 자신의 곡을 추천합니다.__*');
            }
        }
    }
    if (message.content.search(prefix) != -1) {
        if (message.content.slice(prefix.length) === '명령어') {
            if (JK == '1') {
                message.channel.send('.추천곡' + '\n' + '\n' +
                    '.도움말 -> 추천곡 기능의 도움말을 제공하는거예요.' + '\n' + '\n' +
                    '.야 -> +할말로 일정 대답을 얻을 수 있는 거예요.' + '\n' + '\n' +
                    '.채널아이디 -> 속해있는 채널의 아이디를 제공하는거예요.' + '\n' + '\n' +
                    '.아이디 -> 해당 명령어를 사용한 유저의 아이디를 제공하는거예요.' + '\n' + '\n' +
                    '.계정정보 -> 해당 명령어를 사용한 유저의 계정정보를 제공하는거예요.' + '\n' + '\n' +
                    '.이름 -> 해당 명령어를 사용한 유저의 이름을 제공하는 거예요.' + '\n' + '\n' +
                    '.이리와/.들어와 -> 속해있는 음성채널에 참여하는 거예요.' + '\n' + '\n' +
                    '.나가/꺼져 -> 속해있던 음성채널에서 내보내는 거예요.' + '\n' + '\n' +
                    '.나갔다들어와 -> 속해있던 음성채널에서 내보냈다가 들이는거예요.' + '\n' + '\n' +
                    '.시무슈 -> 음성채널에 속해있을 경우 시무슈 거리는 것 같아 인거예요?' + '\n' + '\n' +
                    '.원주율 -> 쓸대없이 원주율을 알려주는거예요. 도배 방지로 다시 보기 위해선 재부팅이 필요 한 것 같아 인거예요.' + '\n' + '\n' +
                    '.이과 -> *하와와 이과충은 죽는 것 이예요*' + '\n' + '\n' +
                    '.성덕 -> *세상말종쓰레기자식 죽는 거예요 하와와*' + '\n' + '\n' +
                    '.여고생모드 -> 히와와 일부 대답을 여고생 말투로 하는 후미카씨의 여고생모드를 on하는 거예요. ' + '\n' + '\n' +
                    '.해제 -> 하와와 여고생모드를 해제하는거예요.' + '\n' + '\n' +
                    '.범죄계수 -> 해당 명령어를 입력한 유저의 범죄계수를 측정하여 알려주는 거예요. (하와와 이건 여고생모드가 적용되지 않는 거예요.)'
                    , { code: 'true' });
            } else if (JK == '0') {
                message.channel.send('.추천곡' + '\n' + '\n' +
                    '.도움말 -> 추천곡 기능의 도움말을 제공합니다.' + '\n' + '\n' +
                    '.야 -> +할말로 일정 대답을 얻을 수 있습니다.' + '\n' + '\n' +
                    '.채널아이디 -> 속해있는 채널의 아이디를 제공합니다.' + '\n' + '\n' +
                    '.아이디 -> 해당 명령어를 사용한 유저의 아이디를 제공합니다.' + '\n' + '\n' +
                    '.계정정보 -> 해당 명령어를 사용한 유저의 계정정보를 제공합니다.' + '\n' + '\n' +
                    '.이름 -> 해당 명령어를 사용한 유저의 이름을 제공합니다.' + '\n' + '\n' +
                    '.이리와/.들어와 -> 속해있는 음성채널에 참여시킵니다.' + '\n' + '\n' +
                    '.나가/꺼져 -> 속해있던 음성채널에서 내보냅니다.' + '\n' + '\n' +
                    '.나갔다들어와 -> 속해있던 음성채널에서 내보냈다가 들입니다.' + '\n' + '\n' +
                    '.시무슈 -> 음성채널에 속해있을 경우 시무슈 거립니다?' + '\n' + '\n' +
                    '.원주율 -> 쓸대없이 원주율을 알려줍니다. 도배 방지로 다시 보기 위해선 재부팅이 필요합니다.' + '\n' + '\n' +
                    '.이과 -> *이과충 죽어*' + '\n' + '\n' +
                    '.성덕 -> *세상말종쓰레기자식*' + '\n' + '\n' +
                    '.여고생모드 -> 일부 대답을 여고생 말투로 하는 후미카씨의 여고생모드를 on합니다. ' + '\n' + '\n' +
                    '.해제 -> 여고생모드를 해제합니다.'+ '\n' + '\n' +
                    '.범죄계수 -> 해당 명령어를 입력한 유저의 범죄계수를 측정하여 알려줍니다. (여고생모드가 적용되지 않습니다.)'
                    , { code: 'true' });
            }
        }
    }

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('추천곡') === message.content.search(prefix) + 1) {
            let flag = Math.floor((Math.random() * 4) + 1);
            if(flag == '1') {
                message.channel.send(result1[0]);
            } else if(flag == '2'){
                message.channel.send(result1[0]);
            } else if(flag == '3'){
                message.channel.send('sagisawa fumika - bright blue old clock remix');
            } else if(flag == '4'){
                message.channel.send(result1[0]);
            }
        }
    }

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('범죄계수') === message.content.search(prefix) + 1) {
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
    }

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('야') === message.content.search(prefix) + 1) {
            if (JK == '1') {
                message.channel.send(result2[0]);
            } else if (JK == '0') {
                message.channel.send(result[0]);
            }
        }
    }

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('범수') === message.content.search(prefix) + 1) {
            if (JK == '1') {
                message.channel.send('하와와 가수 김범수 너무 멋진거예요');
            } else if (JK == '0') {
                message.channel.send('개수작 부리지 마세요');
            }
        }
    }

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('모드') === message.content.search(prefix) + 1) {
            if (JK == '1') {
                message.channel.send('현재 여고생모드는 '+'> *__On__*'+' 인거예요');
            } else if (JK == '0') {
                message.channel.send('현재 여고생모드는 '+'> *__Off__*'+' 입니다.');
            }
        }
    }

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('원주율') === message.content.search(prefix) + 1) {
            if (pie == '3.14') {
                message.channel.send('자, 한 번만 말씀드릴게요.');
                message.channel.send('pi = 3.1415926535 8979323846 2643383279 5028841971 6939937510 5820974944 5923078164 0628620899 8628034825 3421170679 8214808651 3282306647 0938446095 5058223172 5359408128 4811174502 8410270193 8521105559 6446229489 5493038196 4428810975 6659334461 2847564823 3786783165 2712019091 4564856692 3460348610 4543266482 1339360726 0249141273 7245870066 0631558817 4881520920 9628292540 9171536436 7892590360 0113305305 4882046652 1384146951 9415116094 3305727036 5759591953 0921861173 8193261179 3105118548 0744623799 6274956735 1885752724 8912279381 8301194912 9833673362 4406566430 8602139494 6395224737 1907021798 6094370277 0539217176 2931767523 8467481846 7669405132 0005681271 4526356082 7785771342 7577896091 7363717872 1468440901 2249534301 4654958537 1050792279 6892589235 4201995611 2129021960 8640344181 5981362977 4771309960 5187072113 4999999837 2978049951 0597317328 1609631859 5024459455 3469083026 4252230825 3344685035 2619311881 7101000313 7838752886 5875332083 8142061717 7669147303 5982534904 2875546873 1159562863 8823537875 9375195778 1857780532 1712268066 1300192787 6611195909 2164201989 ');
                pie='6.28';
            } else if(pie=='6.28');{
                message.channel.send('저는 한 번만 말씀드린다고 했어요.');
                message.channel.send('이제 재부팅 전에는 말씀 안 해드릴거에요.');
            }
        }
    }

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('여고생모드') === message.content.search(prefix) + 1) {
            if (JK == '0') {
                message.channel.send('여고생 모드를 켤게요.');
                JK='1';
            } else if(JK=='1');{
                message.channel.send('현재 상태 : 여고생 모드 on 인거예요');
            }
        }
    }

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('해제') === message.content.search(prefix) + 1) {
            if (JK == '1') {
                message.channel.send('여고생 모드를 해제할게요.');
                JK='0';
            } else if(JK=='0');{
                message.channel.send('현재 상태 : 여고생 모드 off에요.');
            }
        }
    }

    

    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('업다운') === message.content.search(prefix) + 1) {
            let flag = Math.floor((Math.random() * 50) + 1);
            message.channel.send('현재 개발중...');
        }
    }
    if (message.content.search(prefix) != -1 && message.content.search(prefix) === 0) {
        if (message.content.search('이벤트') === message.content.search(prefix) + 1) {
            // 디데이 설정
            var d_day = new Date(2018, 3, 23);

            // 오늘날짜 설정
            var t_day = new Date();
            console.log(d_day);
            console.log(t_day);

            message.channel.send('이벤트까지 남은 시간은 ' +d_day-t_day+ '입니다.'); //몰라 언젠간 완료하겠지
        }
    }

    if (message.content === '.아바타') {
        message.reply(message.author.avatarURL);
    }
    if (message.content === '나는') {
        message.channel.send('파리의 택시운전사');
    }
    if (message.content === '.채널아이디') {
        if (JK == '1') {
            message.channel.send('현재 속해있는 채널의 아이디는 : ' + message.channel.id + '인거예요.');
        } else if (JK == '0') {
            message.channel.send('현재 속해있는 채널의 아이디는 : ' + message.channel.id + '입니다.');
        }
    }
    if (message.content.search(prefix) != -1) {
        if (message.content.slice(prefix.length) === '흥흥흥흥~') {
            message.channel.send('프레데리카~');
        }
    }
    if (message.content === '.아이디') {
        if (JK == '1') {
            message.channel.send('당신의 아이디는 : ' + message.author.id + '인거예요.');
        } else if (JK == '0') {
            message.channel.send('당신의 아이디는 : ' + message.author.id + '입니다.');
        }
    }
    if (message.content === '.이름') {
        if (JK == '0') {
            message.channel.send('당신의 이름은 ' + message.author.username + ' 입니다.');
        } else if (JK == '1') {
            message.channel.send('하와와 당신의 이름은 ' + message.author.username + ' 인거예요.');
        }
    }
    if (message.content === '.계정정보') {
        message.channel.send('계정 생성 시간 : '+message.author.createdTimestamp+'\n'+'가입시 입력 한 이름 : '+message.author.username+'\n'+'현재 계정 상태 : '+message.author.presence.status+'\n'+'계정 tag : '+message.author.tag ,{code: 'true'});
    }
    if (message.content === '.이과') {
        if (JK == '1') {
            message.channel.send('하와와 이과충은 죽는 것 이예요');
        } else if (JK == '0') {
            message.channel.send('이과충 죽어');
        }
    }
    if (message.content === '.성덕') {
        if (JK == '0') {
            message.channel.send('세상말종쓰레기자식 죽어');
        } else if (JK == '1') {
            message.channel.send('세상말종쓰레기자식 죽는 거예요 하와와')
        }
    }
    if (message.content === '.플레이리스트') {
        message.channel.send('.pl https://www.youtube.com/playlist?list=PLj-mFP8wSkPmZwhVRwru2Ej9wlv_30zx2');
    }
    if (message.content === '.니시무라함대' || message.content === '.니시무라 함대' || message.content === '.니시무라') {
        message.channel.send('전함 : 후소, 야마시로'+'\n'+'중순양함 : 모가미'+'\n'+'구축함 : 시구레, 미치시오, 아사구모, 야마구모');
    }
    if (message.content === '.우군함머') {
        message.channel.send('니시무라 함대 : 후소改2, 야마시로改2, 모가미, 야마구모, 아사구모, 미치시오改2, 시구레改2'+'\n'+'\n'+
        '정신함대 : 히에이改2, 키리시마改2, 유우다치改2, 하루사메, 유키카제, 아마츠카제'+'\n'+'\n'+
        '영국함대 : 워스파이트, 아크로열, 적.함.발.견, 저비스'+'\n'+'\n'+
        '제4함대 : 타카오, 아타고, 쵸카이改2, 마야改2'+'\n'+'\n'+
        '제19구축대 : 아야나미改2, 시키나미, 우라나미, 이소나미', {code: 'true'});
    }
    if (message.content === '.우군함대') {
        message.channel.send('니시무라 함대 : 후소改2, 야마시로改2, 모가미, 야마구모, 아사구모, 미치시오改2, 시구레改2'+'\n'+'\n'+
        '정신함대 : 히에이改2, 키리시마改2, 유우다치改2, 하루사메, 유키카제, 아마츠카제'+'\n'+'\n'+
        '영국함대 : 워스파이트, 아크로열, 적.함.발.견, 저비스'+'\n'+'\n'+
        '제4함대 : 타카오, 아타고, 쵸카이改2, 마야改2'+'\n'+'\n'+
        '제19구축대 : 아야나미改2, 시키나미, 우라나미, 이소나미');
    }
    if (message.content === '.진짜?' || message.content === '.그럴까?' || message.content === '.그래?' || message.content ==='.그치?' || message.content === '.퇴근할까' || message.content === '.퇴근하고싶다' || message.content==='.살아있지?') {
        message.channel.send(result[0]);
    }
    if (!message.guild) return;

    if (message.content === '.이리와' || message.content === '.들어와') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => { 
                    message.channel.send('들어왔어요!');
                    connection.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/c/c4/Mutsuki-Introduction.ogg/revision/latest?cb=20150216193917');
                    message.reply(message.author.tag+' 님의 명령어로 들어왔어요.');
                    inChannel = '1';
                })
                .catch(console.log);
        } else {
            message.channel.send('먼저 들어가시고 말씀하시죠.');
        }
    }
    if (message.content === '.나가') {
        if (message.member.voiceChannel) {
            //message.member.voiceChannel.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/3/37/Shimushu-Minor_Damage_2.ogg/revision/latest?cb=20170502222723');
            message.member.voiceChannel.leave();
            message.channel.send('네 나갈게요...');
            inChannel='0';
        } else {
            message.channel.send('어디 있지도 않은데 무슨 소리세요');
        }
    }
    if (message.content === '.나갔다들어와') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave();
            message.channel.send('네 나갈게요...');
            inChannel='0';
            message.member.voiceChannel.join()
                .then(connection => { 
                    message.channel.send('들어왔어요!');
                    connection.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/c/c4/Mutsuki-Introduction.ogg/revision/latest?cb=20150216193917');
                    message.reply(message.author.tag + ' 님의 명령어로 들어왔어요.');
                    inChannel='1';    
                })
        }
    }
    if (message.content === '.시무슈') {
        if (message.member.voiceChannel) {
            if (inChannel == '1') {
                message.member.voiceChannel.join()
                    .then(connection => {
                        connection.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/3/37/Shimushu-Minor_Damage_2.ogg/revision/latest?cb=20170502222723');
                    })
            } else if (inChannel == '0'){
                message.channel.send('음성채널 안에 있을 때만 들으실 수 있어요.');
            }
        }
    }
    if (message.content === '.꺼져') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave()
            message.channel.send('다른 분들께는 말조심 하시는게 좋을거에요.');
        } else {
            message.channel.send('그건 밖에 있어도 기분나쁘네요.');
        }
    }
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`환영합니다!, ${member}`);
  });
  


/* client.on('MessageEmbedImage',MessageEmbedImage => {
    if (MessageEmbedImage.content === '.이미지') {
        MessageEmbedImage.channel.send(MessageEmbedImage.url="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Korail_logo.svg/425px-Korail_logo.svg.png");
    } 
}); */

//client.uptime()

client.login(token);
