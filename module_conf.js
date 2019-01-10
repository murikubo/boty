const axios = require('axios');
const iconv = require('iconv-lite');

// booksaetong.co.kr 에만 euc-kr -> utf-8 디코딩, 다른 euc-kr이 있다면 저 써치식을 ||로 추가하세요
axios.interceptors.response.use(function (response) {
    var ctype = response.headers['content-type'];
    if(response.config.url.search('http://booksaetong.co.kr') != -1) {
        response.data = ctype.includes('charset=euc-kr') ?
            iconv.decode(response.data, 'euc-kr') :
            iconv.decode(response.data, 'utf-8');
    }
    return response;
});
