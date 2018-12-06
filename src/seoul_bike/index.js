const config = require('../../config.json');
const axios = require('axios');
const util = require('../util.js');
const date = require('date-and-time');
const _ = require('lodash');
const moment = require('moment');
const guide = {
    'embed': {
        'title': '따릉이 명령어 및 도움말 일람',
        'description': '모든 명령어는 `따릉이 -파라미터` 로 사용합니다. \n 아래는 사용 가능한 파라미터들입니다.',
        'color': 3447003,
        'fields': [
            {
                'name': '명칭',
                'value': '해당 명칭이 포함된 거치소 정보를 10건까지 불러옵니다.'
            },
        ]
    }
}

module.exports = (client) => {
    client.on('message', message => {

        const parsed = util.slice(message.content);
        if (parsed.command == '따릉이') {
            if (parsed.param == '도움말') return message.channel.send(guide);
            let cutArr1 = [];
            let cutArr2 = [];
            const handle = Promise.resolve();
            handle.then(() => {
                let requestResult = [];
                return axios({
                    method: 'get',
                    url: `http://openapi.seoul.go.kr:8088/${config.seoulBikeApiKey}/json/bikeList/1/1000/`
                }).then((res) => {
                    if(!res.data.rentBikeStatus) throw new Error(res.data.RESULT.MESSAGE);
                    return res.data.rentBikeStatus.row;
                
                }).then((requestData) => {
                    requestResult.push(requestData);
                    return requestResult;
                });
            }).then((requestResult) => {
                return axios({
                    method: 'get',
                    url: `http://openapi.seoul.go.kr:8088/${config.seoulBikeApiKey}/json/bikeList/1001/2000/`
                }).then((res) => {
                    if(!res.data.rentBikeStatus) throw new Error(res.data.RESULT.MESSAGE);
                    return res.data.rentBikeStatus.row;
                }).then((requestData) => {
                    requestResult.push(requestData);
                    return requestResult;
                });
            }).then((requestResult) => {
                let stationName = new Array();
                let parkingBikeCount = new Array();
                let content = [];
                for(i=0;i<1000;i++){
                    if(_.includes(requestResult[0][i].stationName, parsed.content)){
                        stationName.push(requestResult[0][i].stationName);
                        parkingBikeCount.push(`**${requestResult[0][i].parkingBikeTotCnt}** / ${requestResult[0][i].rackTotCnt}`);
                    }
                }
                for(i=0;i<requestResult[1].length;i++){
                    if(_.includes(requestResult[1][i].stationName, parsed.content)){
                        stationName.push(requestResult[1][i].stationName);
                        parkingBikeCount.push(`**${requestResult[1][i].parkingBikeTotCnt}** / ${requestResult[1][i].rackTotCnt}`);
                    }
                }
                if(stationName.length==0){
                    content.push({
                        name: `해당하는 이름의 거치소가 없습니다`,
                        value: `조건에 맞는 이름으로 다시 검색해주세요.`
                    });
                } else {
                    cutArr1 = util.arrayCut(stationName);
                    cutArr2 = util.arrayCut(parkingBikeCount);
                    for(let i in cutArr1[0]) {
                        content.push({
                            name: `${cutArr1[0][i]}`,
                            value: `${cutArr2[0][i]} 대`
                        })
                    }
                }
                return content;
                    
            }).then((content)=> {
                message.channel.send({
                    embed: {
                        title: '서울시 공공자전거 따릉이 거치현황',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '기준시간'
                        }
                    }
                });
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }
    });
}
        