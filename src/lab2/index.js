const util = require('../util.js');
const fs = require('fs');
const tempJson = require('../../data/tempCapsule_data.json');

const capsuleHappiness = (capsuleInput) => {
    fs.writeFileSync('./data/capsule_data.json', JSON.stringify(capsuleInput, null, '\t'));
}

const capsuleSadness = (capsuleInput) => {
    fs.writeFileSync('./data/capsule_data.json', JSON.stringify(capsuleInput, null, '\t'));
}

const capsuleAnger = (capsuleInput) => {
    fs.writeFileSync('./data/capsule_data.json', JSON.stringify(capsuleInput, null, '\t'));
}   

const capsuleCuriosity = (capsuleInput) => {
    fs.writeFileSync('./data/capsule_data.json', JSON.stringify(capsuleInput, null, '\t'));
}

const capsuleWorry = (capsuleInput) => {
    fs.writeFileSync('./data/capsule_data.json', JSON.stringify(capsuleInput, null, '\t'));
}

const capsuleUnknown = (capsuleInput) => {
    fs.writeFileSync('./data/capsule_data.json', JSON.stringify(capsuleInput, null, '\t'));
}

const tempCapsule = (capsuleInput) => {
    let tempData = [];
    tempData.push(capsuleInput);
    console.log(capsuleInput);
    fs.writeFileSync('./data/tempCapsule_data.json', JSON.stringify(tempData, null, '\t'));
    console.log(tempJson);

}

const capsuleFor = (capsuleInput) => {
    
}

const capsuleResult = (capsuleInput) => {
    
}

module.exports = (client) => {
    client.on('message', message => {
        let command = util.slice(message.content);
        const parsed = util.slice(message.content);
        if (command.command == '~' && parsed.content != '') {
            let capsuleInput = parsed.content.split(' ');
            for(i=0;i<capsuleInput.length;i++){
                tempCapsule(capsuleInput[i]);
                message.channel.send(capsuleInput[i]);
            }
        }
    });
};