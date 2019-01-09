const config = require('../config.json');
const botData = require('../data/offline_bot_data.json');

exports.embedFormat = (title = String, valObjArr = Array, description = String) => {
    let emptyCheck = (arr) => {
        if(arr) return arr;
        else return null;
    };
    let embed = {
        embed: {
            author: {
                name: botData.username,
                icon_url: botData.avatarURL
            },
            title: title,
            description: description,
            fields: emptyCheck(valObjArr),
            color: '3447003',
            timestamp: new Date(),
            footer: {
                icon_url: botData.avatarURL,
                text: '명령어 입력 시간'
            }
        }
    };
    return embed;
};
// Cuts array 
exports.arrayCut = (oriArr = Array) => {
    let retArr = [];
    for(let j=0; j < Math.ceil(oriArr.length/10); j++) {
        let tmpArr = [];
        for(let i=j*10; i<(j+1)*10 ;i++) {
            if(oriArr.length<=i) break;
            tmpArr.push(oriArr[i]);
        }
        retArr.push(tmpArr);
    }

    return retArr;
};



exports.slice = (message = String) => {
    if(!message.startsWith(config.prefix)) {
        return false;
    }
    let object = {content: '', pparam: {}};
    let separated = message.replace(config.prefix, '').split(/\s/g);
    separated.map((val, index) => {
        if(val.startsWith('/')) {
            if(!separated[index + 1]) return;
            const key = separated[index].replace('/', '');
            object.pparam[key] = separated[index + 1];
            object.pparam[key] = object.pparam[key].replace('_', ' ');
            separated.splice(index+1, 1);
        } else if(val.startsWith('-')) {
            object.param = separated[index].replace('-','');
        } else if(index == 0) {
            object.command = separated[index];
        } else if(separated.length != 1) {
            const checkLast = () => {
                if (index == separated.length -1) return '';
                else return ' ';
            }
            object.content += separated[index] + checkLast();
        }
    });
    return object;
};

// ,명령어 -param 내용
// ,명령어 -param 만약 내용이 이렇게 나뉘어져 있다면