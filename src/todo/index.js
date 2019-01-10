const util = require('../util.js');
const todoData = require('../../data/todo_data.json');
const fs = require('fs');
const _ = require('lodash');

function move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        var k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing
};

function folderlist(keys) {
    let arr = '';
    for(let i in keys) {
        if(keys[i] == 'selectedFolder') continue;
        arr += i + '. ' + keys[i] + '\n';
    }
    return arr;
}


module.exports = (client) => {
    client.on('message', message => {

        let todoObject = todoData[message.author.id];
        function listup() {
            let arr = todoObject[todoObject.selectedFolder].concat();//.map((list, index) => `${index+1}. ${list}\n`).toString().replace(/,/g,'');
            for(let i=0; i< arr.length; i++) {
                arr[i] = (i+1)+'. '+arr[i];
            }
            let cutArr = util.arrayCut(arr);
            let index = 0;
            let embed = [{ name: `${index+1} 페이지`, value: cutArr[index].toString().replace(/,/g,'\n')}];
            message.channel.send(util.embedFormat(todoObject.selectedFolder + ' 폴더의 할 일 리스트',embed))
                .then(async (sentMessage) => {
                    await sentMessage.react('\u2B05')
                        .then(() => {
                            const filter = (reaction, user) => reaction.emoji.name === '\u2B05' && user.id === message.author.id;
                            const collector = sentMessage.createReactionCollector(filter);
                            collector.on('collect', reaction => {
                                if(index!=0)index--;
                                
                                embed = [{ name: `${index+1} 페이지`, value: cutArr[index].toString().replace(/,/g,'\n')}];
                                sentMessage.edit(util.embedFormat(todoObject.selectedFolder + ' 폴더의 할 일 리스트',embed));
                            });
                        });
                    await sentMessage.react('\u27A1')
                        .then(() => {
                            const filter = (reaction, user) => reaction.emoji.name === '\u27A1' && user.id === message.author.id;
                            const collector = sentMessage.createReactionCollector(filter, { time: 30000 });
                            collector.on('collect', reaction => {
                                if(cutArr.length>index+1)index++;
                                
                                embed = [{ name: `${index+1} 페이지`, value: cutArr[index].toString().replace(/,/g,'\n')}];
                                sentMessage.edit(util.embedFormat(todoObject.selectedFolder + ' 폴더의 할 일 리스트',embed));
                            });
                            collector.on('end', () => sentMessage.clearReactions());
                        });
                });
        }
        
        client.setMaxListeners(100);
        let parsed = util.slice(message.content);
        if(message.author.bot) return;
        if(parsed.command != '할일') return;
        if(parsed.param == '추가') {
            if(parsed.content) {
                if(!todoObject) todoObject = {
                    'selectedFolder': 'default',
                    'default': []
                };
                todoObject[todoObject.selectedFolder].push(parsed.content);
                todoData[message.author.id] = todoObject;
                fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                message.channel.send('`' + parsed.content + '` 할일 이 추가되었습니다.');
            } else {
                message.channel.send('할 일을 입력해주세요.')
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((collected) => {
                                if(!todoObject) todoObject = {
                                    'selectedFolder': 'default',
                                    'default': []
                                };
                                todoObject[todoObject.selectedFolder].push(collected.first().content);
                                todoData[message.author.id] = todoObject;
                                fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                                message.channel.send('`' + collected.first().content + '` 할일 이 추가되었습니다.');
                            }, (err) => {
                                message.channel.send(err.message);
                            })
                            .catch(() => {
                                message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                            });
                    });
            }
        } else if (!todoObject || todoObject.length == 0 || todoObject[todoObject.selectedFolder].length == 0) {
            message.channel.send('리스트가 없습니다. `할일 -추가`로 추가해주세요.');
            return;
        }
        if(parsed.param == '리스트' || !parsed.param) {
            
            if(parsed.content) {
                if(isNaN(parsed.content) || todoObject[todoObject[todoObject.selectedFolder][parseInt(parsed.content)-1]]) return;
                message.channel.send(todoObject[todoObject.selectedFolder][parseInt(parsed.content)-1]);
                return;
            }
            listup();
        }
        if(parsed.param == '삭제') {
            if(parsed.content) {
                if(isNaN(parseInt(parsed.content)) || !todoObject[todoObject.selectedFolder][parseInt(parsed.content)-1] ) return message.channel.send('올바르지 않은 입력값입니다.');
                let delData = todoObject[todoObject.selectedFolder][parseInt(parsed.content)-1];
                todoObject[todoObject.selectedFolder].splice(parseInt(parsed.content)-1,1);
                fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                message.channel.send('`' + delData + '` 할일이 삭제되었습니다.');
            } else {
                Promise.resolve(listup())
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((collected) => {
                                if(collected.first().content == '나가기') throw new Error('취소했습니다.');
                                if(isNaN(parseInt(collected.first().content)) || !todoObject[todoObject.selectedFolder][parseInt(collected.first().content)-1] ) throw new Error('올바르지 않은 입력값입니다.');
                                todoObject[todoObject.selectedFolder].splice(parseInt(collected.first().content)-1,1);
                                fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                                message.channel.send(collected.first().content + '번 할일이 삭제되었습니다.');
                            })
                            .catch((err) => {
                                if(!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                                else message.channel.send(err.message);
                            });
                    });
            }
        }
        if(parsed.param == '일괄삭제') {
            message.channel.send('시원하게 날려버리는중..')
                .then(() => {
                    if(!todoObject[todoObject.selectedFolder] || todoObject[todoObject.selectedFolder].length == 0) {
                        message.channel.send('날릴 데이터가 없어요.');
                        return;
                    }
                    todoObject[todoObject.selectedFolder] = [];
                    fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                    message.channel.send('시원하게 날렸어요.');
                });
        }
        if(parsed.param == '변경') {
            if(!isNaN(parseInt(parsed.content)) || todoObject[todoObject.selectedFolder][parseInt(parsed.content)-1]) {
                let selectedList = parseInt(parsed.content)-1;
                message.channel.send(`${selectedList+1}번 할일을 선택하셨습니다. 변경할 할일을 입력해주세요. \n\n기존 입력값: ${todoObject[todoObject.selectedFolder][selectedList]}`)
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((collected) => {
                                todoObject[todoObject.selectedFolder][selectedList] = collected.first().content;
                                fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                                message.channel.send('`' + collected.first().content + '` 할일로 변경되었습니다.');

                            });
                    });
                return;
            }
            
            Promise.resolve(listup())
                .then(() => {
                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((collected) => {
                            if(collected.first().content == '나가기') throw new Error('취소했습니다.');
                            if(isNaN(parseInt(collected.first().content)) || !todoObject[todoObject.selectedFolder][parseInt(collected.first().content)-1] ) throw new Error('올바르지 않은 입력값입니다.');
                            let selectedList = parseInt(collected.first().content)-1;
                            message.channel.send(`${selectedList+1}번 할일을 선택하셨습니다. 변경할 할일을 입력해주세요. \n\n기존 입력값: ${todoObject[todoObject.selectedFolder][selectedList]}`)
                                .then(() => {
                                    const filter = m => m.author.id === message.author.id;
                                    message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                        .then((collected) => {
                                            todoObject[todoObject.selectedFolder][selectedList] = collected.first().content;
                                            fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                                            message.channel.send('`' + collected.first().content + '` 할일로 변경되었습니다.');

                                        });
                                });
                        })
                        .catch((err) => {
                            if(!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                            else message.channel.send(err.message);
                        });
                });
        }

        if(parsed.param == '이동' && parsed.content != '') {
            let changeNumber = parsed.content.split(',');
            if(isNaN(parseInt(changeNumber[0])) || isNaN(parseInt(changeNumber[1])) || !todoObject[todoObject.selectedFolder][parseInt(changeNumber[0])-1] || !todoObject[todoObject.selectedFolder][parseInt(changeNumber[1])-1]) {
                message.channel.send('올바르지 않은 입력값입니다.');
                return;
            }
            todoObject[todoObject.selectedFolder] = move(todoObject[todoObject.selectedFolder], parseInt(changeNumber[0])-1, parseInt(changeNumber[1])-1);
            fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
            message.channel.send(`${changeNumber[0]}번 할일을 ${changeNumber[1]}번으로 이동하였습니다.`);
        }

        if(parsed.param == '폴더') {
            if(parsed.content == '추가') {
                message.channel.send('폴더 이름을 입력해주세요.')
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((collected) => {
                                todoObject[collected.first().content] = [];
                                fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                                message.channel.send('`' + collected.first().content + '` 폴더가 추가되었습니다.');
                            }, (err) => {
                                message.channel.send(err.message);
                            })
                            .catch(() => {
                                message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                            });
                    });
            }
            let todoFolderKey = Object.keys(todoObject);
            if(parsed.content == '변경' || parsed.content == '선택') {
                message.channel.send({
                    embed: {
                        title: ' ',
                        color: '3447003',
                        fields: [{
                            name: '변경할 폴더의 번호룰 입력해주세요.',
                            value: folderlist(todoFolderKey)
                        }],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                }).then(() => {
                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((collected) => {
                            let selectedList = parseInt(collected.first().content);
                            if(collected.first().content == '나가기') throw new Error('취소했습니다.');
                            if(isNaN(selectedList) || !todoObject[todoFolderKey[selectedList]] || collected.first().content == '0' ) throw new Error('올바르지 않은 입력값입니다.');
                            if(todoFolderKey[selectedList] == todoObject.selectedFolder) throw new Error('현재 선택된 폴더로 변경할 수 없습니다.');
                            todoData[message.author.id].selectedFolder = todoFolderKey[selectedList];
                            fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                            message.channel.send('`' + todoFolderKey[selectedList] + '`폴더로 이동했습니다.');

                        })
                        .catch((err) => {
                            if(!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                            else message.channel.send(err.message);
                        });
                });
            }
            
            if(parsed.content == '이름변경') {
                message.channel.send({
                    embed: {
                        title: ' ',
                        color: '3447003',
                        fields: [{
                            name: '이름을 변경할 폴더의 번호룰 입력해주세요.',
                            value: `선택된 폴더: **${todoObject.selectedFolder}**\n${folderlist(todoFolderKey)}`
                        }],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                })
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((collected) => {
                                if(collected.first().content == '나가기') throw new Error('취소했습니다.');
                                if(isNaN(parseInt(collected.first().content)) || !todoObject[todoFolderKey[parseInt(collected.first().content)]] || collected.first().content == '0') throw new Error('올바르지 않은 입력값입니다.');
                                let selectedList = parseInt(collected.first().content);
                                message.channel.send(`${selectedList}번 폴더를 선택하셨습니다. 변경할 이름을 입력해주세요. \n\n기존 입력값: ${todoFolderKey[selectedList]}`)
                                    .then(() => {
                                        const filter = m => m.author.id === message.author.id;
                                        message.channel.awaitMessages(filter, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                            .then((collected) => {
                                                if(todoFolderKey[selectedList] == todoObject.selectedFolder) todoObject.selectedFolder = collected.first().content;
                                                todoData[message.author.id][collected.first().content] = todoData[message.author.id][todoFolderKey[selectedList]];
                                                delete todoData[message.author.id][todoFolderKey[selectedList]];
                                                fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                                                message.channel.send('`' + collected.first().content + '` 폴더로 변경되었습니다.');

                                            });
                                    });
                            })
                            .catch((err) => {
                                if(!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                                else message.channel.send(err.message);
                            });
                    });
            }
            if(parsed.content == '삭제') {
                
                if(!isNaN(parseInt(parsed.content)) || todoObject[todoObject.selectedFolder][parseInt(parsed.content)-1]) {
                    todoObject[todoObject.selectedFolder].splice(parseInt(parsed.content)-1,1);
                    fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                    message.channel.send(parsed.content + '번 할일이 삭제되었습니다.');
                    return;
                }

                message.channel.send({
                    embed: {
                        title: ' ',
                        color: '3447003',
                        fields: [{
                            name: '삭제할 폴더의 번호룰 입력해주세요.',
                            value: `선택된 폴더: **${todoObject.selectedFolder}**\n${folderlist(todoFolderKey)}`
                        }],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                })
                    .then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((collected) => {
                                let selectedList = parseInt(collected.first().content);
                                if(collected.first().content == '나가기') throw new Error('취소했습니다.');
                                if(isNaN(parseInt(collected.first().content)) || !todoObject[todoFolderKey[parseInt(collected.first().content)]] || collected.first().content == '0' ) throw new Error('올바르지 않은 입력값입니다.');
                                if(todoFolderKey[selectedList] == todoObject.selectedFolder) throw new Error('현재 선택된 폴더는 삭제할 수 없습니다.');
                                delete todoObject[todoFolderKey[selectedList]];
                                fs.writeFileSync('./data/todo_data.json', JSON.stringify(todoData, null, '\t'));
                                message.channel.send(selectedList + '번 폴더가 삭제되었습니다.');
                            })
                            .catch((err) => {
                                if(!err) message.channel.send('시간이 초과되었습니다. 명령어를 다시 입력해주세요.');
                                else message.channel.send(err.message);
                            });
                    });
            }
            if(!parsed.content || parsed.content == '리스트') {
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: ' ',
                        color: '3447003',
                        fields: [{
                            name: '폴더 리스트',
                            value: `선택된 폴더: **${todoObject.selectedFolder}**\n${folderlist(todoFolderKey)}`
                        }],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }
        }
        
    });
};
