const config = require('../config.json');

var convertEngToKor = function(variable) {
	var engChosung = "rRseEfaqQtTdwWczxvg"
	var engChosungReg = "[" + engChosung + "]";
	var engJungsung = {k:0,o:1,i:2,O:3,j:4,p:5,u:6,P:7,h:8,hk:9,ho:10,hl:11,y:12,n:13,nj:14,np:15,nl:16,b:17,m:18,ml:19,l:20};
	var engJungsungReg = "hk|ho|hl|nj|np|nl|ml|k|o|i|O|j|p|u|P|h|y|n|b|m|l";
	var engJongsung = {"":0,r:1,R:2,rt:3,s:4,sw:5,sg:6,e:7,f:8,fr:9,fa:10,fq:11,ft:12,fx:13,fv:14,fg:15,a:16,q:17,qt:18,t:19,T:20,d:21,w:22,c:23,z:24,x:25,v:26,g:27};
	var engJongsungReg = "rt|sw|sg|fr|fa|fq|ft|fx|fv|fg|qt|r|R|s|e|f|a|q|t|T|d|w|c|z|x|v|g|";
	var regExp = new RegExp("("+engChosungReg+")("+engJungsungReg+")(("+engJongsungReg+")(?=("+engChosungReg+")("+engJungsungReg+"))|("+engJongsungReg+"))","g");
	var converter = function (args, cho, jung, jong) {
		return String.fromCharCode(engChosung.indexOf(cho) * 588 + engJungsung[jung] * 28 + engJongsung[jong] + 44032);
	};
	var result = variable.replace(regExp, converter);
	return result;
}

module.exports = (client) => {
    client.on('message', message => {
		if (message.content.startsWith(config.prefix + '변환 ')) {
			message.delete();
			let variable = message.content.slice(message.content.search(/\s/));
			message.reply(convertEngToKor(variable));
		}
		if (message.content.startsWith(config.prefix + 'qusghks ')) {
			message.delete()
			let variable = message.content.slice(message.content.search(/\s/));
			message.reply(convertEngToKor(variable));
        }
    });
};