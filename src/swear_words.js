const swearWords = require('../data/swear_words.json');

module.exports = (client) => {
    client.on('message', message => {
        let milled = message.content;
        for(let i in swearWords) {
            const reg = new RegExp(i, 'g');
            if(message.content.match(reg)) {
                milled = milled.replace(reg, swearWords[i]);
            }
        }
        if (milled != message.content) {
            message.delete()
                .then(() => {
                    message.reply(milled);
                });
        }
    });
};