
const config = require('../../config.json');
const axios = require('axios');
const xml2js = require('xml2js');
const util = require('../util.js');
let date = require('date-and-time');

const getTimetable = (staCode) => {
    axios({
        method: 'get',
        url: `http://openapi.seoul.go.kr:8088/${config.seoulMetroTimeTableApiKey}/json/SearchSTNTimeTableByIDService/1/5/${staCode}/1/1/`
    }).then((res) => {
        //console.log(res.data.SearchSTNTimeTableByIDService);
    })
    return staCode;
}

module.exports = (client) => {
    client.on('message', message => {  

        const parsed = util.slice(message.content);

        if(parsed.command == '시간' && parsed.content != '') {
            axios({
                method: 'get',
                url: 'http://openapi.seoul.go.kr:8088/'+config.seoulMetroStationNameToCodeApiKey+'/xml/'+'SearchInfoBySubwayNameService/1/100/'+encodeURI(parsed.content),
/*                 params: {
                    'KEY': config.seoulMetroStationNameToCodeApiKey,
                    'TYPE': 'xml',
                    'SERVICE': 'SearchInfoBySubwayNameService',
                    'START_INDEX' :'1',
                    'END_INDEX' : '5', //국내에는 5개 이상의 환승역이 존재하지 않음으로 제한은 5로 한다.
                    'STATION_NM' : parsed.content,
                }  */
            }).then(async (res) => {
                let parser = new xml2js.Parser();
                return await new Promise((resolve, reject) => {
                    parser.parseString(res.data, (err, result) => {
                        if(result.SearchInfoBySubwayNameService == undefined) reject(result.RESULT.MESSAGE[0]);
                        resolve(result.SearchInfoBySubwayNameService.row);
                    });
                });
            }).then((stationCont) => {
                let content = [];
/*                 const lineChange = (lineCode) => {
                    const lineInfo = {
                        '1': '1호선',
                        '2': '2호선',
                        '3': '3호선',
                        '4': '4호선',
                        '5': '5호선',
                        '6': '6호선',
                        '7': '7호선',
                        '8': '8호선',
                        '9': '9호선',
                        'K': '경의중앙선',
                        'A': '공항철도',
                        'KK': '경강선',
                        'UI': '우이신설선',
                        'S': '신분당선',
                        'B': '분당선',
                        'G': '경춘선',
                        'I2': '인천2호선',
                        'I1': '인천1호선',
                        'E': '용인경전철',
                        'U': '의정부경전철',
                        'SU': '수인선',
                        'SE': '서해선',
                    };
                    for(let i in lineInfo) {
                        if(lineCode == i) {
                            return lineInfo[i];
                        }
                    }
                }; */
                for(let i in stationCont) {
                    if(i >= 5) {
                        break; //국내에는 5개 이상의 환승역이 존재하지 않음으로 5번까지만.
                    }
                    content.push({
                        name: /* parseInt(i)+1 + '. ' +  */parseInt(i)+1 + '. ' + stationCont[i].LINE_NUM[0] +' '+' '+stationCont[i].STATION_NM[0]+'역',
                        value: `역 코드: **${stationCont[i].STATION_CD[0]}**`
                    });
                }
                if(content.length == 0) {
                    content.push({
                        name: '해당하는 역이 없습니다.',
                        value: '다른 역명으로 검색해주세요.'
                    });
                }
                message.channel.send({
                    embed: {
                        title: parsed.content + '역 검색 결과:',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                }).then(async (sentMessage) => {
                    for(let i = 1; i <= content.length; i++) {
                        await sentMessage.react(i+'⃣')
                            .then(() => {
                                const filter = (reaction, user) => reaction.emoji.name === i+'⃣' && user.id === message.author.id;
                                const collector = sentMessage.createReactionCollector(filter, { time: 15000 });
                                collector.on('collect', reaction => {
                                    const codeInfo = new Promise((resolve) => {
                                        resolve(getTimetable(stationCont[i-1].STATION_CD[0]));
                                        reaction.remove(message.author.id);
                                    });
                                    codeInfo.then((result) => {
                                        sentMessage.edit({
                                            embed: {
                                                title: `${parsed.content}역 시간표 조회`,
                                                description: `보통 서울 안쪽으로 들어오면 상행, 바깥으로 나가면 하행입니다.`,
                                                fields: [
                                                    {
                                                        name: '상행(내선)',
                                                        value: '가고싶은 다음 역을 기준으로 번호가 감소하면 상행/올라가면 내선',
                                                        inline: true
                                                    },
                                                    {
                                                        name: '하행(외선)',
                                                        value: '가고싶은 다음 역을 기준으로 번호가 증가하면 하행/내려가면 외선',
                                                        inline: true
                                                    }
                                                ],
                                                color: '3447003',
                                                timestamp: new Date(),
                                                footer: {
                                                    icon_url: client.user.avatarURL,
                                                    text: '명령어 입력 시간'
                                                }
                                            }
                                        }) .then(async (sentMessage) => {
                                            let stationCode = result;
                                            for(let i = 1; i <= 2; i++) {
                                                await sentMessage.react(i+'⃣')
                                                    .then(() => {
                                                        const filter = (reaction, user) => reaction.emoji.name === i+'⃣' && user.id === message.author.id;
                                                        const collector = sentMessage.createReactionCollector(filter, { time: 15000 });
                                                        collector.on('collect', reaction => {
                                                            const timeInfo = new Promise((resolve) => {
                                                                resolve(stationCode);         
                                                                reaction.remove(message.author.id);                                              
                                                            });
                                                            timeInfo.then((result) => {
                                                                let week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'); 
                                                                let today = new Date(new Date()).getDay();
                                                                let todayLabel = week[today]; 
                                                                let filterDate = '';
                                                                if(todayLabel == '월요일' || todayLabel == '월요일' || todayLabel == '화요일' || todayLabel == '수요일' || todayLabel == '목요일' || todayLabel == '금요일'){
                                                                    filterDate = '1';
                                                                } else if(todayLabel == '토요일'){
                                                                    filterDate = '2';
                                                                } else if(todayLabel == '일요일'){
                                                                    filterDate = '3';
                                                                }
                                                                let filterUpDown;
                                                                let temp_emoji = encodeURI(reaction.emoji.name);
                                                                if(temp_emoji == '1%E2%83%A3') {
                                                                    filterUpDown = '1';
                                                                } else if(temp_emoji == '2%E2%83%A3'){
                                                                    filterUpDown = '2';
                                                                }
                                                                axios({
                                                                    method: 'get',
                                                                    url: 'http://openapi.seoul.go.kr:8088/'+config.seoulMetroTimeTableApiKey+'/xml/'+'SearchSTNTimeTableByIDService/1/1000/'+encodeURI(stationCode)+'/'+encodeURI(filterDate)+'/'+encodeURI(filterUpDown)+'/',
                                                                }).then(async (res) => {
                                                                    let parser = new xml2js.Parser();
                                                                    return await new Promise((resolve, reject) => {
                                                                        parser.parseString(res.data, (err, result) => {
                                                                            if(result.SearchSTNTimeTableByIDService == undefined) reject(result.RESULT.MESSAGE[0]);
                                                                            resolve(result.SearchSTNTimeTableByIDService.row);
                                                                        });
                                                                    });
                                                                }).then((stationCont) => {
                                                                    const now = new Date();
                                                                    const afterHour = date.addHours(now, 1);
                                                    
                                                                    let absData = [];
                                                                    for (let i in stationCont) {
                                                                        const parsedDateObj = date.parse(stationCont[i].LEFTTIME[0], 'HH:mm:ss');
                                                                        let stationLeftTime = new Date(new Date().setHours(parsedDateObj.getHours(), parsedDateObj.getMinutes(), parsedDateObj.getSeconds()));
                                                                        if (stationLeftTime <= afterHour && stationLeftTime >= now) {
                                                                            absData.push(stationCont[i]);
                                                                        } else if (stationLeftTime > afterHour) {
                                                                            break;
                                                                        }
                                                                    }
                                                                    return absData;
                                                                    
                                                                }).then((stationCont) => {
                                                    
                                                                    let stationName = stationCont[0].STATION_NM[0];
                                                                    //console.log(stationCont);
                                                                    let content = [];
                                                                    const directChange = (directCode) => {
                                                                        const directInfo = {
                                                                            'D': '급행',
                                                                            'G': '일반',
                                                                        };
                                                                        for(let i in directInfo) {
                                                                            if(directCode == i) {
                                                                                return directInfo[i];
                                                                            }
                                                                        }
                                                                    }; //급행이나 일반 교체 함수
                                                                    const startDestnChange = (startDestnStarion) => {
                                                                        const startDestnInfo = {
                                                                            '00:00:00': '해당 역 종착/시발',
                                                                        };
                                                                        for(let i in startDestnInfo) {
                                                                            if(startDestnStarion == i) {
                                                                                return startDestnInfo[i];
                                                                            }else return startDestnStarion;
                                                                        }
                                                                    }; //00:00:00을 시발역이나 종착역으로 바꿔주는 함수  
                                                    
                                                                    for(let i in stationCont) {
                                                                        if(content.length >= 5) {
                                                                            break; //5개까지만 출력
                                                                        } 
                                                                        content.push({
                                                                            name: parseInt(i)+1 + '. ' + stationCont[i].LINE_NUM[0] + ' ' +stationCont[i].STATION_NM[0]+' #'+stationCont[i].TRAIN_NO[0],
                                                                            value: `시발역: **${stationCont[i].SUBWAYSNAME[0]}**\n종착역: **${stationCont[i].SUBWAYENAME[0]}**\n도착 시간: **${startDestnChange(stationCont[i].ARRIVETIME[0])}**\n출발 시간: **${startDestnChange(stationCont[i].LEFTTIME[0])}**\n열차 종류:**${directChange(stationCont[i].EXPRESS_YN[0])}**`
                                                                        });
                                                                    }
                                                                    if(content.length == 0) {
                                                                        content.push({
                                                                            name: '해당하는 역이 없습니다.',
                                                                            value: '다른 역명으로 검색해주세요.'
                                                                        });
                                                                    }
                                                                    sentMessage.edit({
                                                                        embed: {
                                                                            title: stationName + '역 검색 결과:',
                                                                            color: '3447003',
                                                                            fields: content,
                                                                            timestamp: new Date(),
                                                                            footer: {
                                                                                icon_url: client.user.avatarURL,
                                                                                text: '명령어 입력 시간'
                                                                            }
                                                                        }
                                                                    })
                                                                }).catch((err)=> {
                                                                    message.channel.send({
                                                                        embed: {
                                                                            color: 3447003,
                                                                            description: `해당 노선의 상/하행은 기지 입출고행입니다. \n 다시 선택해주세요.`
                                                                        }
                                                                    });
                                                                })
                                                                .then(() => collector.stop());
                                                            })
                                                                .catch((err) => message.channel.send('This is an error: ' + err));
                                                        });
                                                        collector.on('end', () => sentMessage.clearReactions());
                                                    });
                                            }
                                        }) 
                                            .then(() => collector.stop());
                                        
                                    })
                                        .catch((err) => message.channel.send('This is an error: ' + err));
                                });
                                //collector.on('end', () => sentMessage.clearReactions());
                            });
                    }
                });
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

        if(parsed.command == '길찾기' && parsed.content != '') {
            axios({
                method: 'get',
                url: `http://swopenapi.seoul.go.kr/api/subway/${config.seoulMetroShortTimeApiKey}/xml/shortestRoute/0/1/${encodeURI(parsed.content)}`
            }).then(async (res) => {
                let parser = new xml2js.Parser();
                return await new Promise((resolve, reject) => {
                    parser.parseString(res.data, (err, result) => {
                        if(result.shortestRoute == undefined) reject(result.RESULT.message[0]);
                        resolve(result.shortestRoute.row);
                    });
                });
            }).then((stationCont) => {
                let content = [];
                content.push({
                    name:  '최단시간 :' +  stationCont[0].shtTravelMsg[0],
                    value: `역 목록: **${stationCont[0].shtStatnNm[0].replace(/\s/g, '').replace(/,/g, ', ').slice(0,-2)}**`
                },
                {
                    name:  '최소환승 :' +  stationCont[0].minTravelMsg[0],
                    value: `역 목록: **${stationCont[0].minStatnNm[0].replace(/\s/g, '').replace(/,/g, ', ').slice(0,-2)}**`
                });
                if(content.length == 0) {
                    content.push({
                        name: '해당하는 역이 없습니다.',
                        value: '다른 역명으로 검색해주세요.'
                    });
                }
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: parsed.content + ':',
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
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

        if(parsed.command == '상행평일' && parsed.content != '') {
            axios({
                method: 'get',
                url: 'http://openapi.seoul.go.kr:8088/'+config.seoulMetroTimeTableApiKey+'/json/'+'SearchSTNTimeTableByIDService/1/1000/'+encodeURI(parsed.content)+'/1/1/',
            }).then((res) => {
                if(res.data.SearchSTNTimeTableByIDService == undefined) throw res.data.RESULT.MESSAGE;
                return res.data.SearchSTNTimeTableByIDService.row;
            }).then((stationCont) => {
                let content = '';
                const directChange = (directCode) => {
                    const directInfo = {
                        'D': '급행',
                        'G': '일반',
                    };
                    for(let i in directInfo) {
                        if(directCode == i) {
                            return directInfo[i];
                        }
                    }
                }; //급행이나 일반 교체 함수
                const startDestnChange = (startDestnStarion) => {
                    const startDestnInfo = {
                        '00:00:00': '해당 역 종착/시발',
                    };
                    for(let i in startDestnInfo) {
                        if(startDestnStarion == i) {
                            return startDestnInfo[i];
                        } else return startDestnStarion;
                    }
                }; //00:00:00을 시발역이나 종착역으로 바꿔주는 함수  
                const messageFormatting = () => {
                    for(let i in stationCont) {
                        if(i > 30) break;
                        if(stationCont[0].LINE_NUM == '09호선' ^ stationCont[0].LINE_NUM == '01호선') {
                            content += `${stationCont[i].ARRIVETIME}, ${directChange(stationCont[i].EXPRESS_YN)} \n`;
                        } else {
                            //console.log(stationCont[i]);
                            content += `${stationCont[i].ARRIVETIME} \n`;
                        }
                    }
                };
                messageFormatting();
                /*
                for(let i in stationCont) {
                    content.push({
                        name: parseInt(i)+1 + '. ' + stationCont[i].LINE_NUM[0] + ' ' +stationCont[i].STATION_NM[0],
                        value: `시발역: **${stationCont[i].SUBWAYSNAME[0]}**\n종착역: **${stationCont[i].SUBWAYENAME[0]}**\n도착 시간: **${startDestnChange(stationCont[i].ARRIVETIME[0])}**\n출발 시간: **${startDestnChange(stationCont[i].LEFTTIME[0])}**\n열차 종류:**${directChange(stationCont[i].EXPRESS_YN[0])}**`
                    });
                }
                */
                if(content.length == 0) {
                    content = '해당하는 역이 없습니다. 다른 역명으로 검색해주세요.';
                }
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: stationCont[0].STATION_NM + ' 검색 결과:',
                        color: '3447003',
                        description: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                })
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

        if(parsed.command == '코드' && parsed.content != '') {
            const parsedMessage = util.slice(message.content);
            let week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'); 
            let today = new Date(new Date()).getDay();
            let todayLabel = week[today]; 
            let filterDate = '';
            if(todayLabel == '월요일' || todayLabel == '월요일' || todayLabel == '화요일' || todayLabel == '수요일' || todayLabel == '목요일' || todayLabel == '금요일'){
                filterDate = '1';
            } else if(todayLabel == '토요일'){
                filterDate = '2';
            } else if(todayLabel == '일요일'){
                filterDate = '3';
            }
            let filterUpDown = '';
            if(parsedMessage.param == ('상행' || '내선')) {
                filterUpDown = '1';
            } else if(parsedMessage.param == ('하행' || '외선')) {
                filterUpDown = '2';
            }
            axios({
                method: 'get',
                url: 'http://openapi.seoul.go.kr:8088/'+config.seoulMetroTimeTableApiKey+'/xml/'+'SearchSTNTimeTableByIDService/1/1000/'+encodeURI(parsed.content)+'/'+encodeURI(filterDate)+'/'+encodeURI(filterUpDown)+'/',
            }).then(async (res) => {
                let parser = new xml2js.Parser();
                return await new Promise((resolve, reject) => {
                    parser.parseString(res.data, (err, result) => {
                        if(result.SearchSTNTimeTableByIDService == undefined) reject(result.RESULT.MESSAGE[0]);
                        resolve(result.SearchSTNTimeTableByIDService.row);
                    });
                });
            }).then((stationCont) => {
                const now = new Date();
                const afterHour = date.addHours(now, 1);

                let absData = [];
                for (let i in stationCont) {
                    const parsedDateObj = date.parse(stationCont[i].LEFTTIME[0], 'HH:mm:ss');
                    let stationLeftTime = new Date(new Date().setHours(parsedDateObj.getHours(), parsedDateObj.getMinutes(), parsedDateObj.getSeconds()));
                    if (stationLeftTime <= afterHour && stationLeftTime >= now) {
                        absData.push(stationCont[i]);
                    } else if (stationLeftTime > afterHour) {
                        break;
                    }
                }
                return absData;
                
            }).then((stationCont) => {

                let stationName = stationCont[0].STATION_NM[0];
                //console.log(stationCont);
                let content = [];
                const directChange = (directCode) => {
                    const directInfo = {
                        'D': '급행',
                        'G': '일반',
                    };
                    for(let i in directInfo) {
                        if(directCode == i) {
                            return directInfo[i];
                        }
                    }
                }; //급행이나 일반 교체 함수
                const startDestnChange = (startDestnStarion) => {
                    const startDestnInfo = {
                        '00:00:00': '해당 역 종착/시발',
                    };
                    for(let i in startDestnInfo) {
                        if(startDestnStarion == i) {
                            return startDestnInfo[i];
                        }else return startDestnStarion;
                    }
                }; //00:00:00을 시발역이나 종착역으로 바꿔주는 함수  

                for(let i in stationCont) {
                    if(content.length >= 5) {
                        break; //5개까지만 출력
                    } 
                    content.push({
                        name: parseInt(i)+1 + '. ' + stationCont[i].LINE_NUM[0] + ' ' +stationCont[i].STATION_NM[0]+' #'+stationCont[i].TRAIN_NO[0],
                        value: `시발역: **${stationCont[i].SUBWAYSNAME[0]}**\n종착역: **${stationCont[i].SUBWAYENAME[0]}**\n도착 시간: **${startDestnChange(stationCont[i].ARRIVETIME[0])}**\n출발 시간: **${startDestnChange(stationCont[i].LEFTTIME[0])}**\n열차 종류:**${directChange(stationCont[i].EXPRESS_YN[0])}**`
                    });
                }
                if(content.length == 0) {
                    content.push({
                        name: '해당하는 역이 없습니다.',
                        value: '다른 역명으로 검색해주세요.'
                    });
                }
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: stationName + '역 검색 결과:',
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                })
            }).catch((err)=> {
                message.channel.send('Error occurred : `' + err + '`');
            });
        }

    });
};