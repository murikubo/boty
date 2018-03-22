const config = require('../../config.json');
const prefix = config.prefix;
module.exports = (client) => {
    client.on('message', message => {
        if (message.content.startsWith(prefix + '말 ')) {
            message.delete()
                .then(() => {
                    message.channel.send(message.content.slice(3));
                }, (reject) => {
                    message.channel.send('Error occured: `' + reject.message + '`.');
                });
        }
        if (message.content.startsWith(prefix + '자르기 ')) {
            message.channel.send(message.content.slice(message.content.search(/\s/)));
        }
    });
};