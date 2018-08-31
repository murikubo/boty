const config = require('../../config.json');
const axios = require('axios');
const xml2js = require('xml2js');
const util = require('../util.js');
const moment = require('moment');

const cautionChange = (cautionCode) => {
    const cautionInfo = {
        'f': '예보',
        'a': '경보',
    };
    for(let i in cautionInfo) {
        if(cautionCode == i) {
            return cautionInfo[i];
        }
    }
}; //예보, 경보 교체함수

const maskWear = (arr) => {
    if((arr[0].CAISTEP == '나쁨' || arr[1].CAISTEP == '나쁨') || (arr[0].CAISTEP == '매우 나쁨' || arr[1].CAISTEP == '매우 나쁨')) return '필수';
    else if(arr[0].CAISTEP == '보통' || arr[1].CAISTEP == '보통') return '권장';
    else return '불필요 (써도 안 말림)';
};

module.exports = (client) => {
    client.on('message', message => {  

        const parsed = util.slice(message.content);

        if(parsed.command == '미세먼지') {
            const handleDust = Promise.resolve();
            handleDust.then(() => {
                let requestResult = [];
                return axios({
                    method: 'get',
                    url: `http://openapi.seoul.go.kr:8088/${config.seoulDustForecastApiKey}/json/ForecastWarningMinuteParticleOfDustService/1/5/`//미세먼지
                }).then((res) => {
                    if(!res.data.ForecastWarningMinuteParticleOfDustService) throw new Error(res.data.RESULT.MESSAGE);
                    return res.data.ForecastWarningMinuteParticleOfDustService.row[0];
                
                }).then((requestData) => {
                    requestResult.push(requestData);
                    return requestResult;
                });
            }).then((requestResult) => {
                return axios({
                    method: 'get',
                    url: `http://openapi.seoul.go.kr:8088/${config.seoulUltraDustForecastApiKey}/json/ForecastWarningUltrafineParticleOfDustService/1/5/`//초미세먼지
                }).then((res) => {
                    if(!res.data.ForecastWarningUltrafineParticleOfDustService) throw new Error(res.data.RESULT.MESSAGE);
                    return res.data.ForecastWarningUltrafineParticleOfDustService.row[0];
                }).then((requestData) => {
                    requestResult.push(requestData);
                    return requestResult;
                });
            }).then((requestResult) => {
                let content = [
                    {
                        name: `미세먼지 **${cautionChange(requestResult[0].FA_ON)}** : ${requestResult[0].CAISTEP}`,
                        value: `**${requestResult[0].POLLUTANT}** / ${requestResult[0].ALARM_CNDT} ${requestResult[0].CNDT1}`
                    },
                    {
                        name: `초미세먼지 **${cautionChange(requestResult[1].FA_ON)}** : ${requestResult[1].CAISTEP}`,
                        value: `**${requestResult[1].POLLUTANT}** / ${requestResult[1].ALARM_CNDT} ${requestResult[1].CNDT1}`
                    },
                    {
                        name: `마스크 착용: **${maskWear(requestResult)}**`,
                        value: `${moment(requestResult[1].APPLC_DT,'YYYYMMDDhhmm').format('MM월 DD일 hh시')} 기준`
                    }
                ];
                return content;
                    
            }).then((content)=> {
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: '서울시 미세먼지 현황',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }).catch((err)=> {
                console.error(err)
                message.channel.send('Error occurred : `' + err + '`');
            });
        }
    });
};

/*
{
                        name: `미세먼지 **${cautionChange(res[0].FA_ON[0])}** : ${res[0].CAISTEP[0]}`,
                        value: `**${res[0].POLLUTANT[0]}** / ${res[0].ALARM_CNDT[0]} ${res[0].CNDT1[0]}`
                    }


                    
                    requestResult.push({
                        name: `초미세먼지 **${cautionChange(res[0].FA_ON[0])}** : ${res[0].CAISTEP[0]}`,
                        value: `**${res[0].POLLUTANT[0]}** / ${res[0].ALARM_CNDT[0]} ${res[0].CNDT1[0]} (${moment(res[0].APPLC_DT[0],'YYYYMMDDhhmm').format('MM월 DD일 hh시')} 기준)`
                    });
                    */