const util = require('../util.js');
const date = require('date-and-time');
const iconv = require('iconv-lite');
const axios = require('axios');


axios.interceptors.response.use(function (response) {
    var ctype = response.headers['content-type'];
    response.data = ctype.includes('charset=euc-kr') ?
        iconv.decode(response.data, 'euc-kr') :
        iconv.decode(response.data, 'utf-8');
    return response;
})


module.exports = (client) => {
    
    client.on('message', message => {
        let parsed = util.slice(message.content);
        if(parsed.command == '북새통') {
            if(parsed.param) {
                message.channel.send(util.embedFormat('북새통 명령어 사용법',[], '`북새통`명령어만 입력하면 오늘의 신간이 나옵니다. \n내용에 `내일`을 입력하면 내일의 신간이 나옵니다. \n내용에 `YYYY-MM-DD`를 입력하면 해당 날짜의 신간이 나옵니다.'));
                return;
            }
            let now = new Date();
            let day;
            if(!parsed.content) day = date.format(now, 'YYYY-MM-DD');
            else if (parsed.content == '내일') day = date.format(date.addDays(now,1), 'YYYY-MM-DD');
            else if (parsed.content && date.parse(parsed.content, 'YYYY-MM-DD')) day = parsed.content;
            else day = date.format(now, 'YYYY-MM-DD');
            axios({
                url: 'http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=' + day,
                method: 'GET',
                responseType: 'arraybuffer' 
            }).then((res) => {
                let bookarr = res.data.split(/<a href='\.\.\/shop\/item.php\?it_id=/g);
                //let bookarr = res.data.split(/<a href='http:\/\/booksaetong.co.kr\/'/g);
                bookarr.splice(0,1);
                for(let i = 0; i <= bookarr.length-1; i++) {
                    bookarr[i] = bookarr[i].split('\n')[0];
                }
                return bookarr;
                
            }).then((bookarr) => {
                let bookobj = [];
                for(let i = 0; i <= bookarr.length-1; i++) {
                    bookobj[i] = {
                        name: `${bookarr[i].slice(bookarr[i].search("\'>")+2, bookarr[i].search('</a>'))}`,
                        id: `${bookarr[i].slice(0,bookarr[i].search("\'>"))}`,
                        realprice: `${bookarr[i].slice(bookarr[i].search('<strike>')+8, bookarr[i].search('</strike>'))}`,
                        saleprice: `${bookarr[i].slice(bookarr[i].search('<span class=amount>')+19, bookarr[i].search('</span>'))}`
                    };
                }
                return bookobj;
            }).then((bookobj) => {
                let content = [];
                for(let i = 0; i < bookobj.length-1; i++) {
                    content[i] = {
                        name: bookobj[i].name,
                        value: `정가: ${bookobj[i].realprice}
                        판매가: ${bookobj[i].saleprice}
                        [제품상세페이지](http://booksaetong.co.kr/shop/item.php?it_id=${bookobj[i].id})`,
                        inline: true
                    };
                }
                message.channel.send({
                    embed: {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: day + ' 의 신간',
                        url: 'http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=' + day,
                        color: '3447003',
                        fields: content,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: '명령어 입력 시간'
                        }
                    }
                });
            }).catch((err) => {
                console.error(err);
                message.channel.send('에러 또는 이 날에 신간이 없습니다. 혹시 모르니까 에러 메세지: ' + err);
            });
        }
    });

};
//const iconv = require('iconv').Iconv;
/*

const fs = require('fs');
const Crawler = require('crawler');

module.exports = (client) => {
    client.on('message', message => {
        let parsed = util.slice(message.content);
        if(parsed.command == '북새통') {
            let c = new Crawler({
                maxConnections : 10,
                // This will be called for each crawled page
                callback : function (error, res, done) {
                    if(error){
                        console.log(error);
                    }else{
                        var $ = res.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        console.log($('title').text());
                    }
                    done();
                }
            })

            c.queue('http://booksaetong.co.kr/shop/list.php?ca_id=90&gdate=2019-01-10');
        }
    });
};
*/