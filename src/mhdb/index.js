const axios = require('axios');
const util = require('../util.js');
const parsing = require('./parsing.js');
const command = ['몬헌', '몬월', 'mh', 'MH', 'Mh', 'mH'];

const guide = {
    'embed': {
        'title': '몬스터 헌터 월드 DB 커맨드 가이드',
        'description': '현재 리스트 전체보기는 불가능합니다.\n 장비 검색은 `/이름 내용`으로 검색 가능합니다\n 검색시 이름을 그대로 적어야 합니다.\n ex) 오그헬름 -> X | 오그헬름a -> **O** \n ex2) 볼보클럽 -> X | 볼보클럽I -> **O**\n 자동 변환: a → **α**, b → **β**, 1 → **I**, 2 → **II**, 3 → **III**',
        'url': 'http://www.mhwdb.kr/',
        'color': 3447003,
        'timestamp': new Date(),
        'fields': [
            {
                'name': '-몬스터',
                'value': '몬스터 정보를 가져옵니다.'
            },
            {
                'name': '-무기',
                'value': '무기 정보를 가져옵니다. `/종류` + `대검/태도/한손검/쌍검/해머/수렵피리/랜스/건랜스/슬래시액스/차지액스/조충곤/라이트보우건/헤비보우건/활` 파라미터가 필수입니다.'
            },
            {
                'name': '-장비',
                'value': '장비 정보를 가져옵니다.'
            },
            {
                'name': '-호석',
                'value': '호석 정보를 가져옵니다.'
            },
            {
                'name': '-장식품',
                'value': '장식품 정보를 가져옵니다.'
            }
        ]
    }
};

module.exports = (client) => {
    client.on('message', message => {

        const parsed = util.slice(message.content);
        if(!command.includes(parsed.command)) return;
        if(!parsed.param || parsed.param == 'h') return message.channel.send(guide);
        axios({
            method: 'get',
            url: parsing.urlParse(parsed.param, parsed.pparam),
            params: parsing.paramParse(parsed.pparam)
        })
            .then((res) => {
                let data;
                if(Array.isArray(res.data)) data = JSON.stringify(res.data[0],null,'\t');
                else data = JSON.stringify(res.data,null,'\t');
                message.channel.send('```json\n' + data + '```');
            })
            .catch((err) => {
                message.channel.send('Error Occurred : `' + err + '`');
            });
    });
};

/*


    const guide = {
        embed: {
            title: '몬스터 헌터 DB 가이드',
            color: '3447003',
            description: 'Guide Here',
            timestamp: new Date()
        }
    }
*/