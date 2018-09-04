const config = require('../config.json');
const axios = require('axios');
const util = require('./util.js');
const date = require('date-and-time');
const _ = require('lodash');
const moment = require('moment');
const guide = {
    'embed': {
        'title': '날씨 명령어 및 도움말 일람',
        'description': '모든 명령어는 `날씨 -파라미터` 로 사용합니다. \n 아래는 사용 가능한 파라미터들입니다.',
        'color': 3447003,
        'fields': [
            {
                'name': '지역(기본 값 서울)',
                'value': '해당 지역의 현재 날씨를 불러옵니다.'
            },
            {
                'name': '예보 /지역(기본 값 서울) /시간(기본 값 12시간)',
                'value': '해당 지역의 설정한 시간 뒤의 일기예보를 불러옵니다.'
            },
            {
                'name': '도움말',
                'value': '도움말을 알려드려요.'
            },
            {
                'name': '현재 지원하는 지역',
                'value': '`☆대한민국 \n서울, 대구, 광주, 청주, 대전, 전주, 부산, 춘천, 제주 \n☆일본\n도쿄, 오사카, 후쿠오카 \n☆미국\n뉴욕`'
            }
        ]
    }
}


module.exports = (client) => {
    client.on('message', message => {

        const parsed = util.slice(message.content);
        if (parsed.command == '날씨' && parsed.param == '예보') {
            const cityParam = (shimamura) => {
                const uzuki = {
                    '서울': 'seoul',
                    '도쿄': 'tokyo',
                    '오사카': 'Osaka',
                    '광주': 'Gwangju',
                    '대구': 'Daegu',
                    '청주': 'Cheongju',
                    '전주': 'Jeonju',
                    '대전': 'Daejeon',
                    '부산': 'Busan',
                    '춘천': 'Chuncheon',
                    '제주': 'Jeju',
                    '뉴욕': 'New York',
                    '후쿠오카': 'Fukuoka'
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
                    '도쿄': '일본국 도쿄도',
                    '오사카': '일본국 오사카부 오사카시',
                    '광주': '대한민국 광주광역시',
                    '대구': '대한민국 대구광역시',
                    '청주': '대한민국 충청북도 청주시',
                    '전주': '대한민국 전라북도 전주시',
                    '대전': '대한민국 대전광역시',
                    '부산': '대한민국 부산광역시',
                    '춘천': '대한민국 강원도 춘천시',
                    '제주': '대한민국 제주특별자치도 제주시',
                    '뉴욕': '미합중국 뉴욕주',
                    '후쿠오카': '일본국 후쿠오카현 후쿠오카시'
                };
                for (let i in fumika) {
                    if (sagisawa == i) {
                        return fumika[i];
                    }
                } return '대한민국 서울특별시';
            };
            return axios({
                method: 'get',
                url: `http://api.openweathermap.org/data/2.5/forecast?q=${cityParam(parsed.pparam.지역)}&appid=${config.weatherApiKey}`,
            }).then((res) => {
                const weatherEngToKor = (weatherEng) => {
                    const weatherInfo = {
                        'Haze': '스모그',
                        'Thunderstorm': '뇌우',
                        'Clouds': '구름',
                        'Rain': '비',
                        'Clear': '맑음',
                        'Snow': '눈',
                        'Mist': '안개',
                        'Drizzle': '이슬비'
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
                        '맑음': ':sunny:'
                    };
                    for (let i in imojiList) {
                        if (weatherKor == i) {
                            return imojiList[i];
                        }
                    }
                };
                let parsedTime = ''
                if (parsed.pparam.시간 == '' || parsed.pparam.시간 == '12') {
                    parsedTime = 0;
                } else if (parsed.pparam.시간 == '24') {
                    parsedTime = 5;
                } else if (parsed.pparam.시간 == '36') {
                    parsedTime = 10;
                } else if (parsed.pparam.시간 == '48') {
                    parsedTime = 15;
                } else if (parsed.pparam.시간 == '60') {
                    parsedTime = 20;
                } else if (parsed.pparam.시간 == '72') {
                    parsedTime = 25;
                } else {
                    parsedTime = 0;
                }
                let content = [];
                content.push({
                    name: `${moment.unix(res.data.list[parsedTime].dt).format('MMMM Do dddd, A h:mm')} ${Math.floor(res.data.list[parsedTime].main.temp - 273.15)}°C`,
                    value: `날씨 : ${weatherEngToKor(res.data.list[parsedTime].weather[0].main)} ${imojiChange(weatherEngToKor(res.data.list[parsedTime].weather[0].main))} 습도 : ${res.data.list[parsedTime].main.humidity}%`
                },
                    {
                        name: `${moment.unix(res.data.list[parsedTime + 1].dt).format('MMMM Do dddd, A h:mm')} ${Math.floor(res.data.list[parsedTime + 1].main.temp - 273.15)}°C`,
                        value: `날씨 : ${weatherEngToKor(res.data.list[parsedTime + 1].weather[0].main)} ${imojiChange(weatherEngToKor(res.data.list[parsedTime + 1].weather[0].main))} 습도 : ${res.data.list[parsedTime + 1].main.humidity}%`
                    },
                    {
                        name: `${moment.unix(res.data.list[parsedTime + 2].dt).format('MMMM Do dddd, A h:mm')} ${Math.floor(res.data.list[parsedTime + 2].main.temp - 273.15)}°C`,
                        value: `날씨 : ${weatherEngToKor(res.data.list[parsedTime + 2].weather[0].main)} ${imojiChange(weatherEngToKor(res.data.list[parsedTime + 2].weather[0].main))} 습도 : ${res.data.list[parsedTime + 2].main.humidity}%`
                    },
                    {
                        name: `${moment.unix(res.data.list[parsedTime + 3].dt).format('MMMM Do dddd, A h:mm')} ${Math.floor(res.data.list[parsedTime + 3].main.temp - 273.15)}°C`,
                        value: `날씨 : ${weatherEngToKor(res.data.list[parsedTime + 3].weather[0].main)} ${imojiChange(weatherEngToKor(res.data.list[parsedTime + 3].weather[0].main))} 습도 : ${res.data.list[parsedTime + 3].main.humidity}%`
                    }
                    , {
                        name: `${moment.unix(res.data.list[parsedTime + 4].dt).format('MMMM Do dddd, A h:mm')} ${Math.floor(res.data.list[parsedTime + 4].main.temp - 273.15)}°C`,
                        value: `날씨 : ${weatherEngToKor(res.data.list[parsedTime + 4].weather[0].main)} ${imojiChange(weatherEngToKor(res.data.list[parsedTime + 4].weather[0].main))} 습도 : ${res.data.list[parsedTime + 4].main.humidity}%`
                    });
                return content;
            }).then((content) => {
                message.channel.send({
                    embed: {
                        title: `${cityName(parsed.pparam.지역)}`,
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: `명령어 입력 시간`
                        }
                    }
                });
            }).catch((err) => {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

        if (parsed.command == '날씨') {
            if (parsed.param == '도움말') return message.channel.send(guide);
            const cityParam = (shimamura) => {
                const uzuki = {
                    '서울': 'seoul',
                    '도쿄': 'tokyo',
                    '오사카': 'Osaka',
                    '광주': 'Gwangju',
                    '대구': 'Daegu',
                    '청주': 'Cheongju',
                    '전주': 'Jeonju',
                    '대전': 'Daejeon',
                    '부산': 'Busan',
                    '춘천': 'Chuncheon',
                    '제주': 'Jeju',
                    '뉴욕': 'New York',
                    '후쿠오카': 'Fukuoka'
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
                    '도쿄': '일본국 도쿄도',
                    '오사카': '일본국 오사카부 오사카시',
                    '광주': '대한민국 광주광역시',
                    '대구': '대한민국 대구광역시',
                    '청주': '대한민국 충청북도 청주시',
                    '전주': '대한민국 전라북도 전주시',
                    '대전': '대한민국 대전광역시',
                    '부산': '대한민국 부산광역시',
                    '춘천': '대한민국 강원도 춘천시',
                    '제주': '대한민국 제주특별자치도 제주시',
                    '뉴욕': '미합중국 뉴욕주',
                    '후쿠오카': '일본국 후쿠오카현 후쿠오카시'
                };
                for (let i in fumika) {
                    if (sagisawa == i) {
                        return fumika[i];
                    }
                } return '대한민국 서울특별시';
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
                        'Drizzle': '이슬비'
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
                        '맑음': ':sunny:'
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