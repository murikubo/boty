exports.convertEngToKor = (content) => {
    let engChosung = 'rRseEfaqQtTdwWczxvg';
    let engChosungReg = '[' + engChosung + ']';
    let engJungsung = {k:0,o:1,i:2,O:3,j:4,p:5,u:6,P:7,h:8,hk:9,ho:10,hl:11,y:12,n:13,nj:14,np:15,nl:16,b:17,m:18,ml:19,l:20};
    let engJungsungReg = 'hk|ho|hl|nj|np|nl|ml|k|o|i|O|j|p|u|P|h|y|n|b|m|l';
    let engJongsung = {'':0,r:1,R:2,rt:3,s:4,sw:5,sg:6,e:7,f:8,fr:9,fa:10,fq:11,ft:12,fx:13,fv:14,fg:15,a:16,q:17,qt:18,t:19,T:20,d:21,w:22,c:23,z:24,x:25,v:26,g:27};
    let engJongsungReg = 'rt|sw|sg|fr|fa|fq|ft|fx|fv|fg|qt|r|R|s|e|f|a|q|t|T|d|w|c|z|x|v|g|';
    let regExp = new RegExp(`(${engChosungReg})(${engJungsungReg})((${engJongsungReg})(?=(${engChosungReg})(${engJungsungReg}))|(${engJongsungReg}))`,'g');
    let converter = (args, cho, jung, jong) => {
        return String.fromCharCode(engChosung.indexOf(cho) * 588 + engJungsung[jung] * 28 + engJongsung[jong] + 44032);
    };
    let result = content.replace(regExp, converter);
    return result;
};

exports.convertConsonant = (content) => {
    let engChosung = {r:1,R:2,rt:3,s:4,sw:5,sg:6,e:7,E:8,f:9,fr:10,fa:11,fq:12,ft:13,fx:14,fv:15,fg:16,a:17,q:18,Q:19,qt:20,t:21,T:22,d:23,w:24,W:25,c:26,z:27,x:28,v:29,g:30};
    let engChosungReg = 'rt|sw|sg|fr|fa|fq|ft|fx|fv|fg|qt|r|R|s|e|f|a|q|Q|t|T|d|w|W|c|z|x|v|g|';
    let regExp = new RegExp(`(${engChosungReg})`,'g');
    let converter = (cho) => {
        if(cho == '') {
            return '';
        }
        return String.fromCharCode(engChosung[cho] + 12592);
    };
    return content.replace(regExp, converter);
};