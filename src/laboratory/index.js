const util = require('../util.js');
const _ = require('lodash');
const date = require('date-and-time');
const axios = require('axios');
const config = require('../../config.json');
const convert = require('../convertEnglishToKorean.js');
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

        if (command.command == '엑셀') {
            if (command.content.length < 2) return message.channel.send('그런건 직접 세어보세요.');
            else {
                const firstAlphabet = (fstAlp) => {
                    const fstAlpInfo = {
                        'A': `${26*1}`,
                        'B': `${26*2}`,
                        'C': `${26*3}`,
                        'D': `${26*4}`,
                        'E': `${26*5}`,
                        'F': `${26*6}`,
                        'G': `${26*7}`,
                        'H': `${26*8}`,
                        'I': `${26*9}`,
                        'J': `${26*10}`,
                        'K': `${26*11}`,
                        'L': `${26*12}`,
                        'M': `${26*13}`,
                        'N': `${26*14}`,
                        'O': `${26*15}`,
                        'P': `${26*16}`,
                        'Q': `${26*17}`,
                        'R': `${26*18}`,
                        'S': `${26*19}`,
                        'T': `${26*20}`,
                        'U': `${26*21}`,
                        'V': `${26*22}`,
                        'W': `${26*23}`,
                        'X': `${26*24}`,
                        'Y': `${26*25}`,
                        'Z': `${26*26}`
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
                message.channel.send({embed: {
                    color: 3447003,
                    description: `A부터 ${command.content}까지는 총 **${parseInt(firstAlphabet(command.content[0])) + parseInt(secondAlphabet(command.content[1]))}**칸이네요.`
                }});
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
            if(command.pparam) {
                content += ', 플러스 파라미터: ';
                for(let key in command.pparam) {
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
            let amt = Number(command.content) + Number(Number(command.content) / 100 * 8);
            axios({
                method: 'get',
                url: `http://api.manana.kr/exchange/rate/KRW/JPY.json`
            }).then((res) => {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: '소비세 계산',
                        fields: [{
                            name: `총 금액 : **${Math.floor(amt)}**엔 \n ${res.data[0].date} 기준 ${parseFloat(eval(res.data[0].rate * amt).toFixed(2)).toLocaleString()}원`,
                            value: `원금**${command.content}**엔의 소비세는 **${Math.floor(Number(command.content) / 100 * 8)}**엔 입니다.`
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
            const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            if (!isNaN(parseInt(command.param)) && parseInt(command.param) <= 2000) {
                let content = '';
                for (let i = 1; i <= parseInt(command.param); i++) {
                    content += alphabet[_.random(0,alphabet.length-1)];
                }
                message.channel.send(content);
                return;
            }
            message.channel.send(alphabet[_.random(0,alphabet.length-1)]);
        }
        
        if (command.command == '일본어') {
            const hiragana = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'ゐ', 'を', 'ん'];
            if (!isNaN(parseInt(command.param)) && parseInt(command.param) <= 2000) {
                let content = '';
                for (let i = 1; i <= parseInt(command.param); i++) {
                    content += hiragana[_.random(0,hiragana.length-1)];
                }
                message.channel.send(content);
                return;
            }
            message.channel.send(hiragana[_.random(0,hiragana.length-1)]);
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
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
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

        if (command.command == '시뮬' && command.content != '') {
            for (let i = 1; i < 50000; i++) {
                let gacha = Math.floor((Math.random() * 10000) + 1);
                if (gacha <= Number(command.content)*100) {
                    return message.channel.send(`총 **${i}번** 만에 떴어요`);
                } else i++;
            }
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
            let messageCont = command.content.slice(command.content.search('=')+1,command.content.search('&')) + '\n `' + command.content.slice(0,command.content.search('&')) + '`';
            if(command.content.search('&') == -1) {
                messageCont = command.content.slice(command.content.search('=')+1) + '\n `' + command.content.slice(0) + '`';
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
        if (command.command === "핑") {
            const awaitMessage = await message.channel.send("계산중!");
            awaitMessage.edit(`:ping_pong: 퐁!! 후미카씨 서버와의 지연속도는 **${awaitMessage.createdTimestamp - message.createdTimestamp}ms**에요. API자체의 지연속도는 **${Math.round(client.ping)}ms**에요.`);

        }
    });
};