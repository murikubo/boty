const axios = require('axios');
const util = require('./util.js');
const tempData = require('../data/temp_data.json');
const fs = require('fs');
const date = require('date-and-time');
const moment = require('moment');
moment.locale('ko');
const _ = require('lodash');

const overlap = (array = Array) => {
    let tempArray = [];
    if (array.length != _.uniq(array).length) {
        for (let i = 0; i < 6; i++) {
            tempArray.push(_.random(1, 45));
        }
        return overlap(tempArray);
    } else {
        return array;
    }
};

const lottoDataUpdate = () => {
    const now = new Date();
    const sendDate = date.parse(tempData.lottoTurn.date + tempData.lottoTurn.time, 'YYYY-MM-DDHH:mm');
    if (sendDate < now) {
        tempData.lottoTurn.date = moment(tempData.lottoTurn.date, 'YYYY-MM-DD').add(7, 'day').format('YYYY-MM-DD');
        tempData.lottoTurn.episode++;
        fs.writeFileSync('./data/temp_data.json', JSON.stringify(tempData, null, '    '));
        console.info('Updated Lotto data');

        return lottoDataUpdate();
    } else {
        return;
    }

}

module.exports = (client) => {
    client.on('message', message => {

        const parsed = util.slice(message.content);

        /* if (parsed.command == '로또시뮬') {
            let randomLotto = {};
            let Vdata = [];
            let tempRandomLotto;
            let length;
            if (parseInt(parsed.content) <= 5) {
                length = parseInt(parsed.content) - 1;
            } else {
                length = 0;
            }
            for (let j = 0; j <= length; j++) {
                randomLotto[j] = [];
                for (let i = 0; i < 6; i++) {
                    tempRandomLotto = _.random(1, 45);
                    randomLotto[j].push(tempRandomLotto);
                }
                randomLotto[j] = overlap(randomLotto[j]);
                randomLotto[j] = randomLotto[j].sort((a, b) => a - b);
                Vdata.push(
                    randomLotto[j].map(i => i)
                );
            }
            let content = [];
            for (i = 0; i < Vdata.length; i++) {
                let lottoNumCol = Vdata[i].toString().split(',');
                lottoNumCol.sort(function (a, b) {
                    return a - b;
                });
                const lottoHandle = Promise.resolve();
                lottoHandle.then(() => {
                    return lottoDataUpdate();
                }).then(() => {
                    return axios({
                        method: 'get',
                        url: `http://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo=${encodeURI(tempData.lottoTurn.episode)}`,
                    }).then((res) => {
                        let ranking;
                        if (res.data.returnValue != 'success') throw new Error('Request Error.');
                        let lottoNumNow = [`${res.data.drwtNo1}`, `${res.data.drwtNo2}`, `${res.data.drwtNo3}`, `${res.data.drwtNo4}`, `${res.data.drwtNo5}`, `${res.data.drwtNo6}`];
                        let lottoBnsNum = [`${res.data.bnusNo}`];
                        let intersection = lottoNumCol.filter(x => lottoNumNow.includes(x));
                        let bns = lottoNumCol.filter(x => lottoBnsNum.includes(x));
                        if (intersection.length == 3) ranking = '5등';
                        else if ((intersection.length == 5) && (bns.length == 1)) ranking = '2등';
                        else if (intersection.length == 4) ranking = '4등';
                        else if (intersection.length == 5) ranking = '3등';
                        else if (intersection.length == 6) ranking = '1등';
                        else ranking = '꽝! 다시 해봐요'
                        content.push({
                            name: `입력된 번호 : ${lottoNumCol}`,
                            value: `일치한 숫자 갯수 **${intersection.length + bns.length}**개 / **${ranking}!**`
                        });
                        return content;
                    }).then((content) =>{
                        message.channel.send({
                            embed: {
                                title: '시뮬레이션 결과',
                                color: '3447003',
                                fields: content,
                                timestamp: new Date(),
                                footer: {
                                    icon_url: client.user.avatarURL,
                                    text: '명령어 입력 시간'
                                }
                            }
                        });
                    });
                }); 
            } */
            /* console.log(content);
            message.channel.send({
                embed: {
                    title: '시뮬레이션 결과',
                    color: '3447003',
                    fields: content,
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간'
                    }
                }
            }); 
        }  */

        /* if (parsed.command == '로또') {
            const lottoHandle = Promise.resolve();
            lottoHandle.then(() => {
                return lottoDataUpdate();
            }).then(() => {
                if (parsed.content == '') {
                    parsed.content = tempData.lottoTurn.episode;
                }
                return true;
            }).then(() => {
                return axios({
                    method: 'get',
                    url: `http://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo=${encodeURI(parsed.content)}`,
                }).then((res) => {
                    if (res.data.returnValue != 'success') throw new Error('Request Error.');
                    let content = [];
                    content.push({
                        name: `날짜 : ${res.data.drwNoDate} 제 ${res.data.drwNo}회차`,
                        value: `당첨번호: ${res.data.drwtNo1} ${res.data.drwtNo2} ${res.data.drwtNo3} ${res.data.drwtNo4} ${res.data.drwtNo5} ${res.data.drwtNo6} + **${res.data.bnusNo}**`
                    },
                        {
                            name: `1등 당첨 금액 : ${parseInt(res.data.firstWinamnt).toLocaleString()}원`,
                            value: `당첨 인원 : ${res.data.firstPrzwnerCo}명`
                        },
                        {
                            name: `누적 상금 : ${parseInt(res.data.totSellamnt).toLocaleString()}원`,
                            value: '당첨이 안 되었어도 이번 주는 수고 많으셨습니다!'
                        });
                    return content;
                });
            }).then((content) => {
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: '행운의 로또!',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }).catch((err) => {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

        if (parsed.command == '로또확인') {
            let tempLotto = parsed.content.split('/');
            for (i = 0; i < tempLotto.length; i++) {
                let lottoNumCol = tempLotto[i].split(',');
                lottoNumCol.sort(function (a, b) {
                    return a - b;
                });
                const lottoHandle = Promise.resolve();
                lottoHandle.then(() => {
                    return lottoDataUpdate();
                }).then(() => {
                    return axios({
                        method: 'get',
                        url: `http://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo=${encodeURI(tempData.lottoTurn.episode)}`,
                    }).then((res) => {
                        let ranking;
                        if (res.data.returnValue != 'success') throw new Error('Request Error.');
                        let lottoNumNow = [`${res.data.drwtNo1}`, `${res.data.drwtNo2}`, `${res.data.drwtNo3}`, `${res.data.drwtNo4}`, `${res.data.drwtNo5}`, `${res.data.drwtNo6}`];
                        let lottoBnsNum = [`${res.data.bnusNo}`];
                        let intersection = lottoNumCol.filter(x => lottoNumNow.includes(x));
                        let bns = lottoNumCol.filter(x => lottoBnsNum.includes(x));


                        if (intersection.length == 3) ranking = '5등';
                        else if ((intersection.length == 5) && (bns.length == 1)) ranking = '2등';
                        else if (intersection.length == 4) ranking = '4등';
                        else if (intersection.length == 5) ranking = '3등';
                        else if (intersection.length == 6) ranking = '1등';
                        else ranking = '꽝! 다음 주를 노려봐요'
                        let content = [];
                        for (x = 0; x < lottoNumCol.length; x++) {
                            if (46 <= Number(lottoNumCol[x])) {
                                content.push({
                                    name: `입력된 번호 : ${lottoNumCol}`,
                                    value: `**오류** 입력된 숫자에 너무 큰 숫자가 존재합니다.`
                                });
                                break;
                            }
                        }
                        if (content.length >= 1) return content;
                        else {
                            if (lottoNumCol.length != 6) {
                                content.push({
                                    name: `입력된 번호 : ${lottoNumCol}`,
                                    value: `**오류** 입력한 숫자의 갯수가 6개 미만입니다.`
                                });
                            } else {
                                content.push({
                                    name: `날짜 : ${res.data.drwNoDate} 제 ${res.data.drwNo}회차`,
                                    value: `당첨번호: ${res.data.drwtNo1} ${res.data.drwtNo2} ${res.data.drwtNo3} ${res.data.drwtNo4} ${res.data.drwtNo5} ${res.data.drwtNo6} + **${res.data.bnusNo}**`
                                },
                                    {
                                        name: `입력된 번호 : ${lottoNumCol}`,
                                        value: `일치한 숫자 갯수 **${intersection.length + bns.length}**개 / **${ranking}!**`
                                    });
                            }
                            return content;
                        }
                    });
                }).then((content) => {
                    message.channel.send({
                        embed: {
                            author: {
                                name: client.user.username,
                                icon_url: client.user.avatarURL
                            },
                            title: '행운의 로또!',
                            color: '3447003',
                            fields: content,
                            timestamp: new Date(),
                            footer: {
                                icon_url: client.user.avatarURL,
                                text: '명령어 입력 시간'
                            }
                        }
                    });
                }).catch((err) => {
                    message.channel.send('Error occurred : `' + err + '`');
                });
            }
        } */

        if (parsed.command == '로또로또') {
            let lottoNumber = parsed.content.split('/', 5);
            for (let i in lottoNumber) {
                lottoNumber[i] = lottoNumber[i].split(',', 6);
            }
            return lottoNumber;
        }

        if (parsed.command == '로또번호') {

            let randomLotto = {};
            let content = [];
            let tempRandomLotto;
            let length;
            if (parseInt(parsed.content) <= 5) {
                length = parseInt(parsed.content) - 1;
            } else {
                length = 0;
            }
            for (let j = 0; j <= length; j++) {
                randomLotto[j] = [];
                for (let i = 0; i < 6; i++) {
                    tempRandomLotto = _.random(1, 45);
                    randomLotto[j].push(tempRandomLotto);
                }
                randomLotto[j] = overlap(randomLotto[j]);
                randomLotto[j] = randomLotto[j].sort((a, b) => a - b);
                content.push({
                    name: `${j + 1}번:`,
                    value: `${randomLotto[j].map(i => i)}`
                });

            }
            message.channel.send({
                embed: {
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: '행운의 로또!',
                    color: '3447003',
                    fields: content,
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간'
                    }
                }
            });
        }
    });
}