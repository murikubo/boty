const config = require('../../config.json');
const voiceQuize = require('../../data/voice_quize.json');
const discord = require('discord.js');
const yt = require('ytdl-core');
const ytdl = require('ytdl-core');
const prefix = config.prefix;


module.exports = (client) => {
    client.on('message', message => {

        if (message.content.startsWith(prefix + '퀴즈')) {
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                        .then(connection => {
                            let correctObjectCount = Object.keys(voiceQuize.correctName).length;
                            let correctVoiceResult= voiceQuize.correctName[correctObjectCount - Math.floor((Math.random() * correctObjectCount) + 1)]; 
                            let correctVoiceName = correctVoiceResult.voiceName; 
                            let voiceLink = correctVoiceResult.voiceLink;
                            let nonCorrectObjectCount = Object.keys(voiceQuize.nonCorrectName).length;
                            let nonCorrectNameResult = voiceQuize.nonCorrectName[nonCorrectObjectCount - Math.floor((Math.random)*nonCorrectObjectCount)+1];
                            let nonCorrectNameSet = nonCorrectNameResult.voiceName;
                            let konmaiSwitch = Math.floor((Math.random() * 4) + 1);
                            if(konmaiSwitch == '1'){
                                connection.playArbitraryInput(voiceLink);
                                message.channel.send('누굴까요?'+'\n'+correctVoiceName+'\n'+nonCorrectNameSet+'\n'+nonCorrectNameSet+'\n'+nonCorrectNameSet);
                            } else if(konmaiSwitch =='2'){
                                connection.playArbitraryInput(voiceLink);
                                message.channel.send('누굴까요?'+'\n'+nonCorrectNameSet+'\n'+correctVoiceName+'\n'+nonCorrectNameSet+'\n'+nonCorrectNameSet);
                            } else if(konmaiSwitch =='3'){
                                connection.playArbitraryInput(voiceLink);
                                message.channel.send('누굴까요?'+'\n'+nonCorrectNameSet+'\n'+nonCorrectNameSet+'\n'+correctVoiceName+'\n'+nonCorrectNameSet);
                            } else if(konmaiSwitch =='4'){
                                connection.playArbitraryInput(voiceLink);
                                message.channel.send('누굴까요?'+'\n'+nonCorrectNameSet+'\n'+nonCorrectNameSet+'\n'+nonCorrectNameSet+'\n'+correctVoiceName);
                            }
                            //connection.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/c/c4/Mutsuki-Introduction.ogg/revision/latest?cb=20150216193917');
                            //connection.playArbitraryInput('https://truecolor.kirara.ca/va2/134f5710462116ab.mp3')
                            message.reply(message.author.tag + ' 맞춰보세요!');
                        })
                        .catch(console.log);
                } else {
                    message.channel.send('먼저 들어가시고 말씀하시죠.');
                }
        }

    });
};

