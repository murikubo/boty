const axios = require('axios');
const config = require('../../config.json');

exports.dictionary = (content = String) => {
    return axios({
        method: 'get',
        url: 'https://openapi.naver.com/v1/search/encyc.json?query=' + encodeURI(content),
        headers: {
            'X-Naver-Client-Id': config.transId,
            'X-Naver-Client-Secret': config.transSecret
        }
    })
        .then((res) => {
            return res;
        })
        .catch((reject) => {
            return reject;
        });
};