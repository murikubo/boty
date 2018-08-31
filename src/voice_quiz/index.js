const config = require('../../config.json');
const voiceQuiz = require('../../data/voice_quiz.json');
const _ = require('lodash');

module.exports = client => {
    client.on('message', (message) => {
        if (!message.content.startsWith(config.prefix + '퀴즈')) {
            return;
        }

        if (!message.member.voiceChannel) {
            message.channel.send('먼저 들어가시고 말씀하시죠.');
            return;
        }

        message.member.voiceChannel
            .join()
            .then(connection => {
                const correct = 
                    _.first(
                        _.shuffle(
                            _.filter(voiceQuiz, q => q.voiceLink)
                        )
                    );

                const incorrect = 
                    _.slice(
                        _.shuffle(
                            _.filter(voiceQuiz, q => !q.voiceLink)
                        ), 0, 3 
                    );

                connection.playArbitraryInput(correct.voiceLink);

                const quiz = _.shuffle([correct, ...incorrect]);
                message.channel.send(
                    '누굴까요? 맞춰보세요!\n'
                    + quiz.map(q => q.voiceName).join('\n')
                );
            })
            .catch(e => console.error(e));
    });
};

