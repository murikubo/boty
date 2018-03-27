let fs = require('fs');
let {google} = require('googleapis');
const config = require('../../config.json');

function getSearch(content) {
    let options = {
        auth: config.googleApiKey,
        part: 'id, snippet',
        q: content
    };
    if(content.search('-p') != -1) {
        options.type = 'playlist';
        options.q = content.replace('-p', '');
    }
    let service = google.youtube('v3');
    return new Promise((resolve, reject) => {
        service.search.list(options, function(err, response) {
            if (err) {
                reject(err);
            }
            let result = response.data.items;
            if (result.length == 0) {
                reject('No result found.');
            } else {
                let returnContent = '';
                for(let i in result) {
                    returnContent += parseInt(i)+1 + '. 제목: ' + result[i].snippet.title + ', ID: ' + result[i].id.videoId + '\n\n';
                }
                resolve(returnContent);
            }
        });

    });;
}


module.exports = (client) => {
    client.on('message', message => {
        if (!(message.content.startsWith(config.prefix + '유튜브') ^ message.content.startsWith(config.prefix + '유튭'))) {
            return;
        }
        getSearch(message.content.slice(message.content.search(/\s/)))
            .then((content) => {
                message.channel.send(content);
            })
            .catch((err) => {
                message.channel.send('This is an error: ' + err);
            });
    });
};