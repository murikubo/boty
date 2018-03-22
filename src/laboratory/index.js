const config = require('../../config.json');
const prefix = config.prefix;
module.exports = (client) => {
    client.on('message', message => {
        if (message.content.startsWith(prefix + 'lab ')) {
            message.delete()
                .then(() => {
                    message.channel.send(message.content.slice(5));
                }, (reject) => {
                    message.channel.send('Error occured: `' + reject.message + '`.');
                });
        }
    });
};