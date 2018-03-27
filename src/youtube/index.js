let {google} = require('googleapis');
const config = require('../../config.json');

function handleParam(content) {
    return new Promise ((resolve) => {
        let options = {
            auth: config.googleApiKey,
            part: 'id, snippet',
            q: content
        };

        if(content.search('-p') != -1) {
            options.type = 'playlist';
            options.q = content.replace('-p', '');
            resolve(options);
        } else resolve(options);
    });
}

async function getSearch(options) {
    let service = google.youtube('v3');
    return await new Promise((resolve) => {
        service.search.list(options, (err, response) => {
            if (err) {
                throw err;
            }
            let result = response.data.items;
            if (result.length == 0) {
                throw 'No result found.';
            } else {
                let returnContent = '';
                for(let i in result) {
                    let typeCase = () => {
                        if(options.type == 'playlist') return result[i].id.playlistId;
                        else return result[i].id.videoId;
                    };
                    returnContent += parseInt(i)+1 + '. 제목: ' + result[i].snippet.title + ', ID: ' + typeCase() + '\n\n';
                }
                resolve(returnContent);
            }   
        });
    });
}


module.exports = (client) => {
    client.on('message', message => {
        if (!(message.content.startsWith(config.prefix + '유튜브') ^ message.content.startsWith(config.prefix + '유튭'))) {
            return;
        }
        handleParam(message.content.slice(message.content.search(/\s/)))
            .then((options) => {
                return getSearch(options);
            })
            .then((content) => {
                message.channel.send(content);
            })
            .catch((err) => {
                message.channel.send('This is an error: ' + err);
            });
    });
};