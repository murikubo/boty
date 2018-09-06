exports.urlParse = (string = String, object = Object) => {
    const dbUrl = 'http://www.mhwdb.kr/apis';

    switch (string) {
    case '몬스터':
        return dbUrl + '/monsters';
    case '스킬':
        return dbUrl + '/skills';
    case '무기':
        if(!object.종류) return false;
        return dbUrl + '/weapons/' + encodeURI(object.종류);
    case '장비':
    case '방어구':
        return dbUrl + '/armors';
    case '호석':
        return dbUrl + '/charms';
    case '장식품':
    case '장식주':
        return dbUrl + '/jewels';
    default:
        return false;
    
    }
}


exports.paramParse = (object = Object) => {
    const parameter = {
        이름: 'name',
        타입: 'type'
    };
    let returnObject = {};

    for(let i in parameter) {
        if(object[i]) {
            object[i] = object[i].replace('1','I');
            object[i] = object[i].replace('2','II');
            object[i] = object[i].replace('3','III');
            object[i] = object[i].replace('a','α');
            object[i] = object[i].replace('b','β');
            returnObject[parameter[i]] = object[i];
        }
    }
    return returnObject;
};