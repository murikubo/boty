const discord = require('discord.js');
const prefix = require('../../config.json').prefix;
const fs = require('fs');
const _ = require('lodash');
let mod = JSON.parse(fs.readFileSync("./data/mod_data.json", "utf8"));

module.exports = (client) => {
    client.on('message', message => {

        if (message.content.startsWith(prefix + '모드')) {
            let cindeFestMod = '';
            let skipMod = '';
            let JKMod = '';
            if (mod.mod.cindeFest == '1') {
                cindeFestMod = '신데페스 모드가 적용되어있어요.';
            } else if (mod.mod.cindeFest == '0') {
                cindeFestMod = '통상모드가 적용되어있어요.';
            } else if (mod.mod.cindeFest == '2') {
                cindeFestMod = '한정가챠 모드가 적용되어있어요.';
            }
            if (mod.mod.skip == '1') {
                skipMod = 'SSR을 제외한 카드는 결과로만 알려줘요.';
            } else if (mod.mod.skip == '0') {
                skipMod = '모든 카드들을 읊어드려요.';
            } else if (mod.mod.skip == '2'){
                skipMod = '테스트 가챠 결과를 읊어드려요';
            }
            if (mod.mod.jk == '1') {
                JKMod = '적용되어 있는 거예요';
            } else if (mod.mod.jk == '0') {
                JKMod = '해제되어 있어요.';
            }
            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: '적용 모드',
                    description: '현재 적용되어 있는 모드들입니다.',
                    fields: [{
                        name: '여고생모드',
                        value: '현재 여고생모드가 ' + JKMod
                    },
                    {
                        name: '가챠 모드',
                        value: '현재 가챠에는 ' + cindeFestMod
                    },
                    {
                        name: '생략/비생략',
                        value: '현재 가챠 시 ' + skipMod
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        }

        if (message.content.startsWith(prefix + '여고생모드')) {
            if (mod.mod.jk == 0) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '여고생 모드를 켤게요.'
                }});
                mod.mod.jk = 1;
            } else if (mod.mod.jk == 1); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 여고생 모드 on 인거예요.'
                }});
            }
        }
        
        if (message.content.startsWith(prefix + '테스트모드')) {
            if (mod.mod.skip == 0 || mod.mod.skip == 1) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '테스트 모드를 켤게요.'
                }});
                mod.mod.skip = 2;
            } else if (mod.mod.skip == 2); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 테스트 모드가 적용되었어요.'
                }});
            }
        }
    
        if (message.content.startsWith(prefix + '테스트해제')) {
            if (mod.mod.skip == 2) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '테스트 모드를 해제할게요.'
                }});
                mod.mod.skip = 1;
            } else if (mod.mod.skip == 1); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 테스트 모드가 해제되었어요.'
                }});
            }
        }
    
        if (message.content.startsWith(prefix + '페스')) {
            if (mod.mod.cindeFest == 0 || mod.mod.cindeFest == 2) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '신데렐라 페스 모드를 적용할게요.'
                }});
                mod.mod.cindeFest = 1;
            } else if (mod.mod.cindeFest == 1); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 신데렐라 페스 확률과 페스돌이 적용되었어요.'
                }});
            }
        }
    
        if (message.content.startsWith(prefix + '생략')) {
            if (mod.mod.skip == 0) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '가챠시 SSR 외의 카드들은 결과로만 알려드릴게요.'
                }});
                mod.mod.skip = 1;
            } else if (mod.mod.skip == 1); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 생략 모드가 적용되었어요.'
                }});
            }
        }
    
    
        if (message.content.startsWith(prefix + '해제')) {
            if (mod.mod.jk == 1) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '여고생 모드를 해제할게요.'
                }});
                mod.mod.jk = 0;
            } else if (mod.mod.jk == 0); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 여고생 모드 off에요.'
                }});
            }
        }
    
        if (message.content.startsWith(prefix + '전부')) {
            if (mod.mod.skip == 1) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '가챠시 SSR 외의 카드들도 알려드릴게요.'
                }});
                mod.mod.skip = 0;
            } else if (mod.mod.skip == 0); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 생략 모드가 해제되었어요.'
                }});
            }
        }
    
        if (message.content.startsWith(prefix + '한정')) {
            if (mod.mod.cindeFest == 0 || mod.mod.cindeFest == 1) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '한정가챠 모드를 적용할게요.'
                }});
                mod.mod.cindeFest = 2;
            } else if (mod.mod.cindeFest == 2); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 한정가챠 모드가 적용되었어요.'
                }});
            }
        }
    
        if (message.content.startsWith(prefix + '통상')) {
            if (mod.mod.cindeFest == 1 || mod.mod.cindeFest == 2) {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '신데렐라 페스 모드/한정가챠 모드를 해제할게요.'
                }});
                mod.mod.cindeFest = 0;
            } else if (mod.mod.cindeFest == 0); {
                message.channel.send({embed: {
                    color: 3447003,
                    description: '현재 상태 : 신데렐라 페스 확률과 페스돌/한정돌이 롤백되어있어요.'
                }});
            }
        }
        if(_.isEmpty(mod)) return;
        else fs.writeFileSync("./data/mod_data.json", JSON.stringify(mod));
    });
};
