const fs = require('fs');
const prefix = require('../../config.json').prefix;
let saveId = '';
//This is index of Kancolle Fleet Management system

function handleFleetManage(id) {
    
}

function fleetManage() {
    
}

module.exports = (client) => {
    client.on('message', message => {
        if (!message.content.startsWith(prefix + '함대')) {
            return;
        }
        handleFleetManage(message.author.id);
    });
};


/*
"{user_id}": [
    "{fleet_name}": [
        "{kanmusu_name1}": { "equipment": ["{equipment1}", "{equipment2}", "{equipment3}"], "type": "destroyer" },
        "{kanmusu_name2}": { "equipment": ["{equipment1}", "{equipment2}", "{equipment3}"], "type": "destroyer" },    // 1명 완료될 때마다 더 추가할건지 물어봄.
        "{kanmusu_name3}": { "equipment": ["{equipment1}", "{equipment2}", "{equipment3}"], "type": "destroyer" },
        "{kanmusu_name4}": { "equipment": ["{equipment1}", "{equipment2}", "{equipment3}"], "type": "destroyer" },
        "{kanmusu_name5}": { "equipment": ["{equipment1}", "{equipment2}", "{equipment3}"], "type": "destroyer" },
        "{kanmusu_name6}": { "equipment": ["{equipment1}", "{equipment2}", "{equipment3}"], "type": "destroyer" },
    ]
]

*/