const discord = require('discord.js');
const client = new discord.Client();
const token = '';

//import kancolle_fm
//import todo
//import translate


client.on('ready', () => {
    console.info('I am ready!');
});
//Test message
client.on('message', message => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
    if (message.content === '앙') {
        message.reply('기모띠', {code: 'true'});
    }
    if (message.content === '야') {
        message.reply('기분좋다');
    }
    if (message.content === '아바타 테스트') {
        message.reply(message.author.avatarURL);
    }
});

client.login(token);
