//const cacheLocation = "../../cache"
let axios = require('axios');
const util = require('../util');
const fs = require('fs');
const mergeImg = require('merge-img');


let download = async function(url, dest) {
    let writer=fs.createWriteStream(dest);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      })
    response.data.pipe(writer)
  };

module.exports = (client) => {
    client.on('message', async message => {
        let command = util.slice(message.content);
        if (command.command == '김상근사망'){
            await axios('https://splatoon2.ink/data/coop-schedules.json')
            .then(async (res) => {
                let jmax = res.data.details.length;
                for(let j=0; j<jmax; j++) {
                    let imax = res.data.details[j].weapons.length
                    let jcheck= (j==0)?'now':'next';
                    for(let i=0; i<imax; i++) {
                        console.log(j,i);
                        let link = "http://splatoon2.ink/assets/splatnet" + res.data.details[j].weapons[i].weapon.image;
                        await download(link, './cache/salmon-'+jcheck+'-'+(i+1)+'.png')
                    }
                    setTimeout(async function(){
                        await mergeImg(['./cache/salmon-'+jcheck+'-1.png', './cache/salmon-'+jcheck+'-2.png', './cache/salmon-'+jcheck+'-3.png', './cache/salmon-'+jcheck+'-4.png'])
                        .then((img) => {
                            img.write('./cache/salmon-'+jcheck+'-sum.png');
                        }).catch(err => console.error(err));
                    }, 1000);
                    
                }
            })
                
        }
        if(command.command == '안성무'){
            
        }
    });
}




//axios(https://splatoon2.ink/data/coop-schedules.json)

/*
nawabari - now/next - 1/2/sum

salmon - now/next - 1/2/3/4/sum

salmon info
nawabari info
*/