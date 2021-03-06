const util = require('../util.js');
const _ = require('lodash');
const discord = require('discord.js');
const date = require('date-and-time');
const axios = require('axios');
const config = require('../../config.json');
const convert = require('../convertEnglishToKorean.js');
const vrcAccountData = require('../../data/vrc_user_data.json');
const fs = require('fs');
const vrc = require('vrchat-client');
const locale = require('../../data/locale.json');
date.locale('ko');

const numberRandom = (array) => {
    if (array == '') {
        array = [1, 100];
    }
    for (let i in array) {
        if (isNaN(array[i]) || array.length == 1) {
            return '올바르지 않은 입력값입니다.';
        }
    }
    return _.random(array[0], array[1]);
};

const getWeekNo = (date) => {
    let someDate = date.getDate();
    let firstDate = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/01');
    let monthFirstDate = firstDate.getDay();

    return Math.ceil((someDate + monthFirstDate) / 7);
};

module.exports = (client) => {
    client.on('message', message => {
        let command = util.slice(message.content);

        if (command.command == '탕수육' || command.command == '탕') {
            require('./tangsoo.js')(message);
        }

        if (command.command == '화상통화' || command.command == '화면공유') {
            if (!message.member.voiceChannel) {
                message.channel.send('음성 채널에 들어가 있지 않습니다. 음성 채널에 들어가서 입력해주세요!');
                return;
            }
            message.channel.send(
                {
                    embed: {
                        color: 3447003,
                        title: '음성채널을 화상채널로 접속할 수 있는 링크입니다.\n화상채널을 나가도 링크를 통해 재접속할 수 있습니다',
                        fields: [{
                            name: message.member.voiceChannel.name,
                            value: `[화상채널 접속 링크](https://canary.discordapp.com/channels/${message.channel.id}/${message.member.voiceChannel.id})`
                        }]

                    }
                });
        }


        if (command.command == '엑셀') {
            if (command.content.length < 2) return message.channel.send('그런건 직접 세어보세요.');
            else {
                const firstAlphabet = (fstAlp) => {
                    const fstAlpInfo = {
                        'A': `${26 * 1}`,
                        'B': `${26 * 2}`,
                        'C': `${26 * 3}`,
                        'D': `${26 * 4}`,
                        'E': `${26 * 5}`,
                        'F': `${26 * 6}`,
                        'G': `${26 * 7}`,
                        'H': `${26 * 8}`,
                        'I': `${26 * 9}`,
                        'J': `${26 * 10}`,
                        'K': `${26 * 11}`,
                        'L': `${26 * 12}`,
                        'M': `${26 * 13}`,
                        'N': `${26 * 14}`,
                        'O': `${26 * 15}`,
                        'P': `${26 * 16}`,
                        'Q': `${26 * 17}`,
                        'R': `${26 * 18}`,
                        'S': `${26 * 19}`,
                        'T': `${26 * 20}`,
                        'U': `${26 * 21}`,
                        'V': `${26 * 22}`,
                        'W': `${26 * 23}`,
                        'X': `${26 * 24}`,
                        'Y': `${26 * 25}`,
                        'Z': `${26 * 26}`
                    };
                    for (let i in fstAlpInfo) {
                        if (fstAlp == i) {
                            return fstAlpInfo[i];
                        }
                    }
                };
                const secondAlphabet = (sndAlp) => {
                    const sndAlpInfo = {
                        'A': '1',
                        'B': '2',
                        'C': '3',
                        'D': '4',
                        'E': '5',
                        'F': '6',
                        'G': '7',
                        'H': '8',
                        'I': '9',
                        'J': '10',
                        'K': '11',
                        'L': '12',
                        'M': '13',
                        'N': '14',
                        'O': '15',
                        'P': '16',
                        'Q': '17',
                        'R': '18',
                        'S': '19',
                        'T': '20',
                        'U': '21',
                        'V': '22',
                        'W': '23',
                        'X': '24',
                        'Y': '25',
                        'Z': '26'
                    };
                    for (let i in sndAlpInfo) {
                        if (sndAlp == i) {
                            return sndAlpInfo[i];
                        }
                    }
                };
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `A부터 ${command.content}까지는 총 **${parseInt(firstAlphabet(command.content[0])) + parseInt(secondAlphabet(command.content[1]))}**칸이네요.`
                    }
                });
            };
        }

        if (command.command == '말') {
            message.delete()
                .then(() => {
                    message.channel.send(command.content);
                }, (reject) => {
                    message.channel.send('Error occurred: `' + reject.message + '`.');
                });
        }
        if (command.command == '퇴근') {
            message.channel.send({ files: ['./data/toegeun.jpg'] });
        }
        if (command.command == '크롱') {
            const http = require('https'); // https모듈과 http모듈이 호환될까?? 궁금하긴 한데 해보진 않았다.
            const url = `${encodeURI(`https://namu.wiki/search/${command.content}`)}`;

            http.get(url, stream => {
                let rawdata = '';
                stream.setEncoding('utf8');
                stream.on('data', buffer => rawdata += buffer);
                stream.on('end', function () {
                    //message.channel.send(rawdata);
                    message.channel.send(rawdata.html);
                });
            });
        }

        if (command.command == '글자') {
            if (command.content == '') return;
            let imoji = '';
            let temp = '';
            for (let i = 0; i < command.content.length; i++) {
                temp = command.content.charAt(i).toLowerCase().replace(/[0-9]|[^\!-z]/gi, " ");
                if (temp == ' ') imoji += '';
                else imoji += `:regional_indicator_${temp}:`
            }
            if (imoji.length == 0) return message.channel.send('영어만 보낼 수 있어요!');
            else message.channel.send(imoji);
        }

        if (command.command == '거꾸로') {
            message.delete()
                .then(() => {
                    message.channel.send(command.content.split("").reverse().join(""));
                }, (reject) => {
                    message.channel.send('Error occurred: `' + reject.message + '`.');
                });
        }

        if (command.command == '나누기') {
            let content = `명령어: ${command.command}, 파라미터: ${command.param}, 내용: ${command.content}`;
            if (command.pparam) {
                content += ', 플러스 파라미터: ';
                for (let key in command.pparam) {
                    content += `${key} - ${command.pparam[key]} `;
                }
            }
            message.channel.send(content);
        }

        if (command.command == '계산') {
            const errHandle = new Promise((resolve, reject) => {
                if (eval(command.content) == undefined) {
                    const err = new Error('제발 멀쩡한 계산만 합시다');
                    reject(err);
                    return;
                }
                message.channel.send(eval(command.content));
            });
            errHandle.catch((err) => {
                message.channel.send('Error occurred: `' + err.message + '`.');
            });
        }
        /* PM 참고용 주석
       # if (command.command == '비밀') {
       #     message.author.send('쉿!');
       # }
        */

        if (command.command == '소비세' && command.content != '') {
            if (isNaN(command.content) == true) return message.channel.send('올바르지 않은 입력값입니다.');
            /*             let tax = 10;
                        if (command.param == '8') tax = 8; */
            let amt1 = Number(command.content) + Number(Number(command.content) / 100 * 10);
            let amt2 = Number(command.content) + Number(Number(command.content) / 100 * 8);
            axios({
                method: 'get',
                url: `http://api.manana.kr/exchange/rate/KRW/JPY.json`
            }).then((res) => {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: '소비세 계산',
                        fields: [{
                            name: `**10%** **:** 총 금액 : **${Math.floor(amt1)}**엔 \n ${res.data[0].date} 기준 ${parseFloat(eval(res.data[0].rate * amt1).toFixed(2)).toLocaleString()}원`,
                            value: `**10%** **:** 원금**${command.content}**엔의 소비세는 **${Math.floor(Number(command.content) / 100 * 10)}**엔 입니다.`
                        },
                        {
                            name: `**8%** **:** 총 금액 : **${Math.floor(amt2)}**엔 \n ${res.data[0].date} 기준 ${parseFloat(eval(res.data[0].rate * amt2).toFixed(2)).toLocaleString()}원`,
                            value: `**8%** **:** 원금**${command.content}**엔의 소비세는 **${Math.floor(Number(command.content) / 100 * 8)}**엔 입니다.`
                        }],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간 '
                        }
                    }
                });
            });
        }

        if (command.command == '홀짝') {
            let rng = _.random(1000000000);
            if (command.content) {
                let answer = command.content;
                if (answer == '홀' || answer == '1') answer = 1;
                else answer = 0;
                if (rng % 2 == answer) message.channel.send('맞았어요 :' + rng, { files: ['./data/correct.jpg'] });
                else message.channel.send('틀렸어요 : ' + rng, { files: ['./data/incorrect.jpg'] });
            }
            else {
                message.channel.send('홀? 짝?')
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        }).then((collected) => {
                            let answer = collected.first().content;
                            if (answer == '홀' || answer == '1') answer = 1;
                            else answer = 0;
                            return answer;
                        }).then((answer) => {
                            if (rng % 2 == answer) message.channel.send('맞았어요 : ' + rng, { files: ['./data/correct.jpg'] });
                            else message.channel.send('틀렸어요 : ' + rng, { files: ['./data/incorrect.jpg'] });
                        }).catch(() => {
                            message.channel.send('제한시간 초과!');
                        });
                    });
            }
        }

        if (command.command == '복권') {
            let lottoCount = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6];
            message.channel.send(`||${lottoCount[_.random(0, lottoCount.length - 1)]}등!||`);
        }

        if (command.command == 'base64') {
            if (command.param == 'd') message.channel.send(Buffer.from(command.content, 'base64').toString('utf8'));
            else message.channel.send(Buffer.from(command.content).toString('base64'));
        }

        /* if (command.command == '금액' && command.content != '') {
            if (isNaN(command.content) == true) return message.channel.send('올바르지 않은 입력값입니다.');
            const cahngeKorean = (senkawa) => {
                const chihiro = {
                    '0': '',
                    '1': '일',
                    '2': '이',
                    '3': '삼',
                    '4': '사',
                    '5': '오',
                    '6': '육',
                    '7': '칠',
                    '8': '팔',
                    '9': '구'
                };
                for (let i in chihiro) {
                    if (senkawa == i) {
                        return chihiro[i];
                    }
                }
            };

            const cahngeKorean2 = (sagisawa) => {
                const fumika = {
                    0 : '',
                    1 : '십',
                    2 : '백',
                    3 : '천',
                    4 : '만',
                    5 : '십',
                    6 : '백',
                    7 : '천',
                    8 : '억',
                    9 : '십',
                    10: '백',
                    11: '천',
                    12: '조',
                    13: '십',
                    14: '백',
                    15: '천'
                };
                for (let i in fumika) {
                    if (sagisawa == i) {
                        return fumika[i];
                    }
                }
            };

            let shimamura = '';
            let uzuki = 0;
            for(let i= Number(command.content.length)-1;i>=0; i--){
                console.log("i===>" + i);
                console.log("uzuki===>" + uzuki);
                if(command.content.charAt(uzuki) != "0"){
                    shimamura += cahngeKorean(command.content.charAt(uzuki)) + cahngeKorean2(i);
                } else {
                    shimamura += cahngeKorean(command.content.charAt(uzuki));
                }
                console.log(shimamura);
                uzuki++;
            }
            message.channel.send({
                embed: {
                    color: `3447003`,
                    description: `${shimamura}`
                }
            });
        } */

        if (command.command == '색') {
            let randomColor = _.random(1, 16777214);
            if (command.content && !isNaN(parseInt(command.content, 16))) {
                randomColor = parseInt(command.content, 16);
            }
            if (command.param == 'p') {
                message.channel.send(`https://www.colorhexa.com/${randomColor.toString(16)}.png`);
                return;
            }
            message.channel.send({
                embed: {
                    color: randomColor,
                    description: `#${randomColor.toString(16).toUpperCase()}`
                }
            }).catch((err) => {
                message.channel.send('ERROR: `' + err + '`');
            });
        }

        if (command.command == '구글커스텀' && command.content != '') {
            axios({
                method: 'get',
                url: `https://www.googleapis.com/customsearch/v1?key=AIzaSyBgQoR4bvutT4mgPyNtRYVYR8AnSXKDM20&cx=001364919714340940362:oablwel-qek&q=${encodeURI(command.content)}&searchType=image`,
            }).then((res) => {
                if (res.data.items == undefined) throw res.data.RESULT.MESSAGE;
                return res.data.items.row;
                console.log(res.data.items.row);
            }).then((google) => {
                console.log(google);
                let content = '';

                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: ' 검색 결과:',
                        color: '3447003',
                        description: 'content',
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                })
            }).catch((err) => {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }


        if (command.command == '길이') {
            if (command.content == '') return;
            message.channel.send(command.content.length);
        }

        if (command.command == '한글') {
            if (!isNaN(parseInt(command.param)) && parseInt(command.param) <= 2000) {
                let content = '';
                for (let i = 1; i <= parseInt(command.param); i++) {
                    content += String.fromCharCode(44031 + Math.ceil(11172 * Math.random()));
                }
                message.channel.send(content);
                return;
            }
            message.channel.send(String.fromCharCode(44031 + Math.ceil(11172 * Math.random())));
        }

        if (command.command == '영어') {
            const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            if (!isNaN(parseInt(command.param)) && parseInt(command.param) <= 2000) {
                let content = '';
                for (let i = 1; i <= parseInt(command.param); i++) {
                    content += alphabet[_.random(0, alphabet.length - 1)];
                }
                message.channel.send(content);
                return;
            }
            message.channel.send(alphabet[_.random(0, alphabet.length - 1)]);
        }

        if (command.command == '일본어') {
            const hiragana = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'ゐ', 'を', 'ん'];
            if (!isNaN(parseInt(command.param)) && parseInt(command.param) <= 2000) {
                let content = '';
                for (let i = 1; i <= parseInt(command.param); i++) {
                    content += hiragana[_.random(0, hiragana.length - 1)];
                }
                message.channel.send(content);
                return;
            }
            message.channel.send(hiragana[_.random(0, hiragana.length - 1)]);
        }

        if (command.command == '선택') {
            let choice = command.content.split(',');
            message.channel.send(choice[_.random(choice.length - 1)]);
        }

        if (command.command == '나이' && command.content != '') {
            return new Promise((resolve, reject) => {
                const nowyear = new Date().getFullYear();
                const birthday = date.parse(command.content, 'YYYY');
                if (isNaN(birthday)) reject('잘못된 포맷입니다. YYYY 형식으로 작성해주십시오.');
                const birthYear = date.parse(command.content, 'YYYY').getFullYear();
                message.channel.send(`나이: ${Math.ceil(eval(nowyear - birthYear + 1))}`);
            }).catch((err) => {
                message.channel.send('Error occurred: `' + err + '`.');
            });
        }

        if (command.command == '오미쿠지') {
            const result = ['대흉', '말흉', '반흉', '소흉', '흉', '평', '말소길', '말길', '반길', '길', '소길', '중길', '대길']
            const luckyNum = _.random(0, result.length - 1);
            message.channel.send(result[luckyNum]);
        }

        if (command.command == "메시지삭제" && command.content != '' || command.command == "메삭" && command.content != '') {
            if (isNaN(command.content) == true) return message.channel.send('올바르지 않은 입력값입니다.');
            message.channel.bulkDelete(Number(command.content)).then(() => {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `${Number(command.content)}개의 메시지만큼 삭제했어요.`
                    }
                });
            }).catch((err) => {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `후미카씨에 **메시지를 삭제할 권한**이 없어요. \n 기능을 이용하시려면 서버 관리자에게 메시지 삭제 권한에 대해 문의하여 권한을 부여해주세요.`
                    }
                });
            });
        }

        // if (command.command == "봇메시지삭제") {
        //     message.channel.fetchMessages().then(messages => {
        //         const botMessages = messages.filter(message => message.author.bot);
        //         message.channel.bulkDelete(botMessages);
        //         messagesDeleted = botMessages.array().length;
        //         message.channel.send(`총 ${messagesDeleted}개의 메시지가 삭제되었습니다.`);
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // }

        if (command.command == '랜덤') {
            message.channel.send(numberRandom(command.content.split(',', 2)));
        }

        if (command.command == '시계') {
            if (!command.content || isNaN(command.content)) command.content = 0;
            if (command.param && !isNaN(command.param)) command.content = parseInt(-command.param);
            message.channel.send(date.format(date.addHours(new Date(), command.content), 'YYYY-MM-DD \nA hh:mm:ss'))
                .catch((err) => {
                    message.channel.send('ERROR: `' + err + '`');
                });
        }

        if (command.command == '한강') {
            axios({
                method: 'get',
                url: 'http://hangang.dkserver.wo.tc',
            }).then((res) => {
                message.channel.send({
                    embed: {
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
        }
        if (command.command == '연어' && command.param == undefined) {
            const salmon = require('../../data/salmon.json');
            let salmonSync = fs.readFileSync('././data/salmon.json', 'utf8');
            let nowDate = new Date();
            let tempMonth = nowDate.getMonth() + 1;
            let tempDate = nowDate.getDate();
            if (1 >= tempMonth.toString().length) {
                tempMonth = `0${tempMonth}`;
            }
            if (1 >= tempDate.toString().length) {
                tempDate = `0${tempDate}`;
            }
            if (`${nowDate.getFullYear()}${tempMonth}${tempDate}` != salmon[0].date) {
                axios({
                    method: 'get',
                    url: 'https://splatoon2.ink/data/coop-schedules.json',
                }).then((res) => {
                    console.log('data pushing');
                    salmon[0].date = `${nowDate.getFullYear()}${tempMonth}${tempDate}`;
                    delete salmon[1];
                    let temp = salmon.filter(function (e) { return e != null; });
                    temp.push(res.data);
                    fs.writeFileSync('././data/salmon.json', JSON.stringify(temp, null, '\t'));
                }).catch((err) => {
                    message.channel.send('Error occured : `' + err + '`');
                });
            }
            let tempWeapons = [];
            let tempMap;
            for (let i = 0; i < Object.keys(locale.weapons).length; i++) {
                for (let x = 0; x < 4; x++) {
                    if (JSON.parse(salmonSync)[1].details[0].weapons[x].id == Object.keys(locale.weapons)[i]) {
                        if (JSON.parse(salmonSync)[1].details[0].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[0].weapons[x].id.slice(0, 2) == '20') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[차저]`);
                        } else if (JSON.parse(salmonSync)[1].details[0].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[0].weapons[x].id.slice(0, 2) == '10') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[롤러]`);
                        } else if (JSON.parse(salmonSync)[1].details[0].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[0].weapons[x].id.slice(0, 2) == '50') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[머뉴버]`);
                        } else if (JSON.parse(salmonSync)[1].details[0].weapons[x].id.length <= 3) {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[슈터]`);
                        } else if (JSON.parse(salmonSync)[1].details[0].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[0].weapons[x].id.slice(0, 2) == '11') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[붓]`);
                        } else if (JSON.parse(salmonSync)[1].details[0].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[0].weapons[x].id.slice(0, 2) == '30') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[슬로셔]`);
                        } else if (JSON.parse(salmonSync)[1].details[0].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[0].weapons[x].id.slice(0, 2) == '40') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[스피너]`);
                        } else if (JSON.parse(salmonSync)[1].details[0].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[0].weapons[x].id.slice(0, 2) == '60') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[셸터]`);
                        }
                    }
                }
            }
            for (let z = 0; z < Object.keys(locale.coop_stages).length; z++) {
                if (JSON.parse(salmonSync)[1].details[0].stage.image == Object.keys(locale.coop_stages)[z]) {
                    tempMap = Object.values(locale.coop_stages)[z].name;
                }
            }
            message.channel.send({
                embed: {
                    thumbnail: {
                        url: `https://splatoon2.ink/assets/splatnet${JSON.parse(salmonSync)[1].details[0].stage.image}`
                    },
                    title: `이번 연어런`,
                    color: '3447003',
                    fields: [
                        {
                            name: `맵 : ${tempMap}`,
                            value: `진행 시간 : ${date.format(new Date(JSON.parse(salmonSync)[1].details[0].start_time * 1000), 'YYYY-MM-DD HH:mm')} ~ ${date.format(new Date(JSON.parse(salmonSync)[1].details[0].end_time * 1000), 'YYYY-MM-DD HH:mm')}\n무기 : ${tempWeapons}`
                        }],
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: `Data Caching Time : ${JSON.parse(salmonSync)[0].date}`
                    }
                }
            });
        }

        if (command.command == '연어' && command.param == '다음') {
            const salmon = require('../../data/salmon.json');
            let salmonSync = fs.readFileSync('././data/salmon.json', 'utf8');
            let nowDate = new Date();
            let tempMonth = nowDate.getMonth() + 1;
            let tempDate = nowDate.getDate();
            if (1 >= tempMonth.toString().length) {
                tempMonth = `0${tempMonth}`;
            }
            if (1 >= tempDate.toString().length) {
                tempDate = `0${tempDate}`;
            }
            if (`${nowDate.getFullYear()}${tempMonth}${tempDate}` != salmon[0].date) {
                axios({
                    method: 'get',
                    url: 'https://splatoon2.ink/data/coop-schedules.json',
                }).then((res) => {
                    console.log('data pushing');
                    salmon[0].date = `${nowDate.getFullYear()}${tempMonth}${tempDate}`;
                    delete salmon[1];
                    let temp = salmon.filter(function (e) { return e != null; });
                    temp.push(res.data);
                    fs.writeFileSync('././data/salmon.json', JSON.stringify(temp, null, '\t'));
                }).catch((err) => {
                    message.channel.send('Error occured : `' + err + '`');
                });
            }
            let tempWeapons = [];
            let tempMap;
            for (let i = 0; i < Object.keys(locale.weapons).length; i++) {
                for (let x = 0; x < 4; x++) {
                    if (JSON.parse(salmonSync)[1].details[1].weapons[x].id == Object.keys(locale.weapons)[i]) {
                        if (JSON.parse(salmonSync)[1].details[1].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[1].weapons[x].id.slice(0, 2) == '20') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[차저]`);
                        } else if (JSON.parse(salmonSync)[1].details[1].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[1].weapons[x].id.slice(0, 2) == '10') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[롤러]`);
                        } else if (JSON.parse(salmonSync)[1].details[1].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[1].weapons[x].id.slice(0, 2) == '50') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[머뉴버]`);
                        } else if (JSON.parse(salmonSync)[1].details[1].weapons[x].id.length <= 3) {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[슈터]`);
                        } else if (JSON.parse(salmonSync)[1].details[1].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[1].weapons[x].id.slice(0, 2) == '11') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[붓]`);
                        } else if (JSON.parse(salmonSync)[1].details[1].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[1].weapons[x].id.slice(0, 2) == '30') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[슬로셔]`);
                        } else if (JSON.parse(salmonSync)[1].details[1].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[1].weapons[x].id.slice(0, 2) == '40') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[스피너]`);
                        } else if (JSON.parse(salmonSync)[1].details[1].weapons[x].id.length == 4 && JSON.parse(salmonSync)[1].details[1].weapons[x].id.slice(0, 2) == '60') {
                            tempWeapons.push(`${locale.weapons[Object.keys(locale.weapons)[i]].name}[셸터]`);
                        }
                    }
                }
            }
            for (let z = 0; z < Object.keys(locale.coop_stages).length; z++) {
                if (JSON.parse(salmonSync)[1].details[1].stage.image == Object.keys(locale.coop_stages)[z]) {
                    tempMap = Object.values(locale.coop_stages)[z].name;
                }
            }
            message.channel.send({
                embed: {
                    thumbnail: {
                        url: `https://splatoon2.ink/assets/splatnet${JSON.parse(salmonSync)[1].details[1].stage.image}`
                    },
                    title: `다음 연어런`,
                    color: '3447003',
                    fields: [
                        {
                            name: `맵 : ${tempMap}`,
                            value: `진행 시간 : ${date.format(new Date(JSON.parse(salmonSync)[1].details[1].start_time * 1000), 'YYYY-MM-DD HH:mm')} ~ ${date.format(new Date(JSON.parse(salmonSync)[1].details[1].end_time * 1000), 'YYYY-MM-DD HH:mm')}\n무기 : ${tempWeapons}`
                        }],
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: `Data Caching Time : ${JSON.parse(salmonSync)[0].date}`
                    }
                }
            });
        }

        if (command.command == '시차') {
            message.channel.send('http://www.korea2424.co.kr/time/worldmap_green.gif');
        }

        if (command.command == '재부팅' || command.command == '재시작') {
            if (config.adminId.includes(message.author.id)) {
                message.channel.send('재시작할게요.')
                    .then(message => client.destroy())
                    .then(() => client.login(config.token));
            } else return message.channel.send('관리자만 재시작이 가능해요.');
        }

        if (command.command == '주일' || command.command == '마트') {
            let martDiv;
            let thisIsUnusefulVariableLol = getWeekNo(new Date());
            if (thisIsUnusefulVariableLol == '2' || thisIsUnusefulVariableLol == '4') martDiv = '의무휴업일 입니다.';
            else martDiv = '정상 영업일 입니다.';
            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: '요일 관련 정보',
                    fields: [{
                        name: `${date.format(new Date(), 'YYYY년MM월DD')}일은 ${getWeekNo(new Date())}주째 입니다.`,
                        value: `해당 주 일요일은 마트의 ${martDiv}`
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        }
        if (command.command == '변환' || command.command == 'qusghks') {
            message.delete();
            message.reply(convert.convertConsonant(convert.convertEngToKor(command.content)));
        }

        if (command.command == '시뮬' && command.content != '' || command.command == '확률' && command.content != '') {
            if (command.content.length >= 7) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: `소숫점 포함해서 7자리까지만 계산이 가능해요.`
                }
            });
            for (let i = 1; i < 5000000; i++) {
                let gacha = Math.floor((Math.random() * 1000000) + 1);
                if (gacha <= Number(command.content) * 10000) {
                    return message.channel.send({
                        embed: {
                            color: 3447003,
                            description: `총 **${i.toLocaleString()}번** 만에 떴어요`
                        }
                    });
                }
            }
        }

        if (command.command == '강화' && command.content != '') {
            if (isNaN(parseInt(command.content))) return message.channel.send('올바르지 않은 입력값이에요.');
            if (command.param != null && isNaN(parseInt(command.param))) return message.channel.send('올바르지 않은 입력값이에요.');
            if (command.content.length >= 7) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '소숫점 포함해서 7자리까지만 강화 시뮬이 가능해요.'
                }
            });
            let tempParam = 0;
            if (command.param) tempParam = parseInt(command.param);
            for (let i = 1; i < 5000000; i++) {
                let gacha = Math.floor((Math.random() * 1000000) + 1);
                if (gacha <= Number(command.content) * 10000 + (tempParam * 10000 * (i - 1))) {
                    return message.channel.send({
                        embed: {
                            color: 3447003,
                            title: '강화 성공!',
                            fields: [{
                                name: `총 **${i.toLocaleString()}번** 만에 성공했어요.`,
                                value: `강화할 때 마다 **${tempParam}%**의 확률이 올라 최종적으로 **${parseInt(command.content) + parseInt(tempParam * (i - 1))}%** 확률로 성공했어요.`
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
        }

        if (command.command == '찬반' && command.content != '') {
            if (command.content.length > 8) return message.channel.send('하지 마세요 과부하걸려요');
            if (isNaN(command.content) == true) return message.channel.send('올바르지 않은 입력값입니다.');
            let senkawa = 0;
            let chihiro = 0;
            for (let i = 0; i < Number(command.content); i++) {
                if (Math.floor((Math.random() * 2) + 1) == 1) {
                    senkawa += 1;
                } else {
                    chihiro += 1;
                }
            }
            message.channel.send({
                embed: {
                    color: 3447003,
                    description: `찬성 : **${senkawa.toLocaleString()}**\n반대 : **${chihiro.toLocaleString()}**\n찬성 총 : **${(senkawa / (Number(command.content)) * 100).toFixed(2)}**%`
                }
            });
        }


        if (command.command == '날짜') {
            if (!command.content || !(date.parse(command.content, 'YYMMDD') ^ date.parse(command.content, 'YYYYMMDD'))) return;
            let inputDate = date.parse(command.content, 'YYMMDD');
            if (!inputDate) inputDate = date.parse(command.content, 'YYYYMMDD');
            const now = new Date();
            const gap = inputDate - now;
            let temp = Math.floor(gap / (1000 * 60 * 60 * 24));
            if (Math.floor(gap % (1000 * 60 * 60 * 24))) temp++;
            message.channel.send(temp + '일');
        }

        if (command.command == 'utc') {
            if (command.param == 'h') return message.channel.send('YYMMDDHHmm 또는 YYYYMMDDHHmm 으로 확인할 수 있습니다. \n `-r`으로 utc -> GMT+0900을 확인할 수 있습니다.');
            let addVar = -9;
            if (command.param == 'r') addVar = 9;
            if (!command.content || !(date.parse(command.content, 'YYMMDDHHmm') ^ date.parse(command.content, 'YYYYMMDDHHmm'))) return;
            let inputDate = date.parse(command.content, 'YYMMDDHHmm');
            if (!inputDate) inputDate = date.parse(command.content, 'YYYYMMDDHHmm');
            message.channel.send(date.format(date.addHours(inputDate, addVar), 'YYYY-MM-DD \nA hh:mm:ss'))
                .catch((err) => {
                    message.channel.send('ERROR: `' + err + '`');
                });
        }

        if (command.command == 'cut' || command.command == '유자') {
            let messageCont = command.content.slice(command.content.search('=') + 1, command.content.search('&')) + '\n`' + command.content.slice(command.content.search('https://'), command.content.search('&')) + '`';
            messageCont = messageCont.replace('music.', 'www.');
            if (command.content.search('&') == -1) {
                messageCont = command.content.slice(command.content.search('=') + 1) + '\n `' + command.content.slice(0) + '`';
            }

            message.channel.send(messageCont);
        }

        if (command.command == '배열거꾸로' || command.command == '배열반대로') {
            message.channel.send(command.content.split(',').reverse().join(','));
        }
    });
    //핑 커멘드 사용을 위한 message async.
    client.on("message", async message => {
        let command = util.slice(message.content);

        if (command.command == 'VRC정보') {
            if (!vrcAccountData[message.author.id]) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '등록된 계정 정보가 없어요. `.계정추가` 명령어로 계정을 등록해주세요.'
                }
            });
            let tempArray = vrcAccountData[message.author.id].split(',');
            let tempId = tempArray[0];
            let tempPw = tempArray[1];
            let api = await vrc.login(`${tempId}`, `${tempPw}`);
            const temp = api.user.getUserInfo().then((data) => {
                const embed = new discord.RichEmbed()
                    .setColor(3447003)
                    .setThumbnail(data.currentAvatarThumbnailImageUrl)
                    .setFooter("명령어 입력 시간", client.user.avatarURL)
                    .setTimestamp()
                    .addField("유저네임", data.displayName, true)
                    .addField("상태표시줄", data.statusDescription, true)

                message.channel.send({ embed });
            });
        }

        if (command.command == '친구') {
            if (!vrcAccountData[message.author.id]) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '등록된 계정 정보가 없어요. `.계정추가` 명령어로 계정을 등록해주세요.'
                }
            });
            let tempArray = vrcAccountData[message.author.id].split(',');
            let tempId = tempArray[0];
            let tempPw = tempArray[1];
            let api = await vrc.login(`${tempId}`, `${tempPw}`);
            const temp = api.user.getFriends().then((data) => {
                if (data.length == 0) return message.channel.send({
                    embed: {
                        color: 3447003,
                        description: '접속해있는 친구가 없어요.'
                    }
                });
                let content = [];
                for (i = 0; i < data.length; i++) {
                    let location = '';
                    if (data[i].location == 'private') {
                        location = 'private';
                    } else {
                        /* let tempLocation = data[i].location.substring(0,41);
                        let tempLocationRoomNumber = data[i].location.substring(42,47);
                        //console.log(tempLocation);
                        //console.log(tempLocationRoomNumver);
                        api.world.getById(`${tempLocation}`).then((worldData)=>{
                            //console.log(worldData);
                            //console.log(worldData.name);
                            location = `**${worldData.name}**#${tempLocationRoomNumber}`;
                        }); */
                        location = 'online';
                    }
                    content.push({
                        name: `**${data[i].displayName}**`,
                        value: `${data[i].statusDescription}\n위치 : ${location}`
                    });
                }
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: '온라인 친구 목록',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간 '
                        }
                    }
                });

            });
        }


        if (command.command == '유저') {
            if (!command.content) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '`.유저 유저명` 형식으로 입력해주세요.'
                }
            });
            let imoji = '';
            let temp1 = '';
            for (let i = 0; i < command.content.length; i++) {
                temp1 = command.content.charAt(i).toLowerCase().replace(/[0-9]|[^\!-z]/gi, " ");
                if (temp1 == ' ') imoji += '';
                else imoji += `${temp1}`
            }
            if (imoji.length == 0) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '현재 영어이름만 검색 가능해요.'
                }
            });
            if (!vrcAccountData[message.author.id]) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '등록된 계정 정보가 없어요. `.계정추가` 명령어로 계정을 등록해주세요.'
                }
            });
            let tempArray = vrcAccountData[message.author.id].split(',');
            let tempId = tempArray[0];
            let tempPw = tempArray[1];
            let api = await vrc.login(`${tempId}`, `${tempPw}`);
            let tempWorld = '';
            const temp = api.user.getByName(command.content).then((data) => {
                if (data.worldId == 'offline') {
                    tempWorld = 'offline';
                } else {
                    tempWorld = 'online';
                }
                const embed = new discord.RichEmbed()
                    .setColor(3447003)
                    .setThumbnail(data.currentAvatarThumbnailImageUrl)
                    .setFooter("명령어 입력 시간", client.user.avatarURL)
                    .setTimestamp()
                    .addField("유저네임", data.displayName, true)
                    .addField("상태", tempWorld, true)

                message.channel.send({ embed });
            }).catch((err) => {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        description: '해당하는 유저가 없어요.'
                    }
                });
            });
        }

        if (command.command == '계정삭제') {
            if (!vrcAccountData[message.author.id]) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '등록된 계정 정보가 없어요. 먼저 `.계정추가` 명령어로 계정을 등록해주세요.'
                }
            });
            vrcAccountData[message.author.id] = null;
            fs.writeFileSync('./data/vrc_user_data.json', JSON.stringify(vrcAccountData, null, '\t'));
            message.channel.send({
                embed: {
                    color: 3447003,
                    description: '등록된 VRC계정을 지웠어요.'
                }
            });
        }

        if (command.command == '계정추가') {
            if (!command.content) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '계정 정보를 `.계정추가 아이디,비밀번호` 형식으로 입력해주세요.'
                }
            });
            let tempArray = command.content.split(',');
            if (tempArray.length != 2) return message.channel.send({
                embed: {
                    color: 3447003,
                    description: '알맞지 않은 형식이에요. `.계정추가 아이디,비밀번호` 형식으로 입력해주세요.'
                }
            });
            vrcAccountData[message.author.id] = `${tempArray[0]},${tempArray[1]}`;
            fs.writeFileSync('./data/vrc_user_data.json', JSON.stringify(vrcAccountData, null, '\t'));
            message.delete()
                .then(() => {
                    message.channel.send({
                        embed: {
                            color: 3447003,
                            description: 'VRC 계정 정보를 추가했어요.'
                        }
                    });
                }, (reject) => {
                    message.channel.send('Error occurred: `' + reject.message + '`.');
                });
        }

        if (command.command === "핑") {
            const awaitMessage = await message.channel.send("계산중!");
            awaitMessage.edit(`:ping_pong: 퐁!! 후미카씨 서버와의 지연속도는 **${awaitMessage.createdTimestamp - message.createdTimestamp}ms**에요. \nAPI자체의 지연속도는 **${Math.round(client.ping)}ms**에요.`);
        }
    });
};
