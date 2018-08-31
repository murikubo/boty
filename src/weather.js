const config = require('../config.json');
const axios = require('axios');
const util = require('./util.js');
const date = require('date-and-time');
const _ = require('lodash');
const moment = require('moment');


module.exports = (client) => {
    client.on('message', message => {

        const parsed = util.slice(message.content);
        if (parsed.command == '날씨') {
            const cityParam = (shimamura) => {
                const uzuki = {
                    '서울': 'seoul',
                    '도쿄': 'tokyo',
                    '오사카': 'Osaka',
                    '광주': 'Gwangju',
                    '대구': 'Daegu',
                    '청주': 'Cheongju',
                    '전주': 'Jeonju',
                    '대전' : 'Daejeon',
                    '부산' : 'Busan',
                    '춘천' : 'Chuncheon',
                    '제주' : 'Jeju',
                    '뉴욕' : 'New York'
                };
                for (let i in uzuki) {
                    if (shimamura == i) {
                        return uzuki[i];
                    }
                } return 'seoul';
            };
            const cityName = (sagisawa) => {
                const fumika = {
                    '서울': '대한민국 서울특별시',
                    '도쿄': '일본국 도쿄',
                    '오사카': '일본국 오사카시',
                    '광주': '대한민국 광주광엯;',
                    '대구': '대한민국 대구광역시',
                    '청주': '대한민국 충청북도 청주시',
                    '전주': '대한민국 전라북도 전주시',
                    '대전' : '대한민국 대전광역시',
                    '부산' : '대한민국 부산광역사',
                    '춘천' : '대한민국 강원도 춘천시',
                    '제주' : '대한민국 제주특별자치도 제주시',
                    '뉴욕' : '미합중국 뉴욕주'
                };
                for (let i in fumika) {
                    if (sagisawa == i) {
                        return fumika[i];
                    }
                }  return '대한민국 서울특별시';
            };
            let time = '';
            return axios({
                method: 'get',
                url: `http://api.openweathermap.org/data/2.5/weather?q=${cityParam(parsed.param)}&appid=${config.weatherApiKey}`,
            }).then((res) => {
                //console.log(res.data);
                //console.log(res.data.weather[0].main);
                const weatherEngToKor = (weatherEng) => {
                    const weatherInfo = {
                        'Haze': '스모그',
                        'Thunderstorm': '뇌우',
                        'Clouds': '구름',
                        'Rain': '비',
                        'Clear': '맑음',
                        'Snow': '눈',
                        'Mist': '안개',
                        'Drizzle' : '이슬비'
                    };
                    for (let i in weatherInfo) {
                        if (weatherEng == i) {
                            return weatherInfo[i];
                        }
                    }
                };
                const imojiChange = (weatherKor) => {
                    const imojiList = {
                        '스모그': ':foggy:',
                        '뇌우': ':thunder_cloud_rain:',
                        '구름': ':cloud:',
                        '비': ':cloud_rain:',
                        '눈': ':cloud_snow:',
                        '안개': ':fog:',
                        '이슬비': ':cloud_rain:',
                        '맑음' : ':sunny:'
                    };
                    for (let i in imojiList) {
                        if (weatherKor == i) {
                            return imojiList[i];
                        } 
                    }
                };
                let content = [];
                content.push({
                    name: `현재기온 ${Math.floor(res.data.main.temp - 273.15)}°C`,
                    value: `최저기온 ${Math.floor(res.data.main.temp_min - 273.15)}°C/최고기온 ${Math.floor(res.data.main.temp_max - 273.15)}°C`
                },
                    {
                        name: `현재날씨`,
                        value: `${weatherEngToKor(res.data.weather[0].main)} ${imojiChange(weatherEngToKor(res.data.weather[0].main))} 습도 : ${res.data.main.humidity}%`
                    });
                time = moment.unix(res.data.dt).format('YYYY년 MMMM Do dddd, A h:mm 기준');
                return content;
            }).then((content) => {
                message.channel.send({
                    embed: {
                        title: `${cityName(parsed.param)}`,
                        color: '3447003',
                        fields: content,
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: `${time}`
                        }
                    }
                });
            }).catch((err) => {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

    });
}