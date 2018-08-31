const _ = require('lodash');

const flowerCards = {
    '1광': [1, '광'],
    '1띠': [1],
    '2그림': [2],
    '2띠': [2],
    '3광': [3, '광', '땡잡이'],
    '3띠': [3],
    '4그림': [4, '암행어사', '구사', '멍구사'],
    '4띠': [4, '구사'],
    '5그림': [5],
    '5띠': [5],
    '6띠': [6],
    '6그림': [6],
    '7띠': [7],
    '7그림': [7, '땡잡이', '암행어사'],
    '8광': [8, '광'],
    '8그림': [8],
    '9그림': [9, '구사', '멍구사'],
    '9띠': [9, '구사'],
    '10그림': [10],
    '10띠': [10]
};

const jokbo = {
    '망통': 0,
    '한끗': 1,
    '두끗': 2,
    '세끗': 3,
    '네끗': 4,
    '다섯끗': 5,
    '여섯끗': 6,
    '일곱끗': 7,
    '여덟끗': 8,
    '갑오': 9,
    '세륙': 10,
    '장사': 11,
    '장삥': 12,
    '구삥': 13,
    '독사': 14,
    '알리': 15,
    '삥땡': [16, '땡'],
    '이땡': [17, '땡'],
    '삼땡': [18, '땡'],
    '사땡': [19, '땡'],
    '오땡': [20, '땡'],
    '육땡': [21, '땡'],
    '칠땡': [22, '땡'],
    '팔땡': [23, '땡'],
    '구땡': [24, '땡'],
    '장땡': 26, //25는 땡잡이가 땡이 있을때 부여되는 숫자
    '13광땡': [27, '광땡'],
    '18광땡': [27, '광땡'], // 28은 암행어사가 광땡일때 부여되는 숫자
    '38광땡': 29,
    '땡잡이': 0,
    '암행어사': 1,
    '구사': 0,
    '멍텅구리구사': 0
};

const cardGen = (currentCard) => {
    const ramdom = _.random(0, Object.keys(currentCard).length-1);
    const returnCard = Object.keys(currentCard)[ramdom];
    delete currentCard[Object.keys(currentCard)[ramdom]];
    return returnCard;
};

const giveCard = (playerObj, currentCard) => {
    for(let i in playerObj) {
        playerObj[i].push(cardGen(currentCard));
    }
    return playerObj;
}

const jokboCalc = (array) => {
    //광땡
    //땡
    //일반족보
    //else 계산 후 끗/망통
    //calc 족보
    //return 족보;
}

const startGame = (players = Object) => {
    //let currentCard = flowerCards;
    //players = giveCard(players, currentCard);
    //bet()
    //players = giveCard(players, currentCard);
    percent(players);
}

const percent = (players) => {
    let currentCard = Object.assign({}, flowerCards);
    players = giveCard(players, currentCard);
    players = giveCard(players, currentCard);
    for(let i in players) {
        gwangCheck(players[i]);
    }
}
var a = 1;
let players = ({'id':[], 'id':[], 'id':[], 'id':[], 'id':[]})
const gwangCheck = (array) => {
    if(flowerCards[array[0]][1] == '광' && flowerCards[array[1]][1] == '광') throw '광땡!';
    else {
        console.log(a);
        a++;
        return startGame(players);
    }
}

const reGame = (rePlayers) => {
    let currentCard = Object.assign({}, flowerCards);

}

const bet = () => {

}

const endGame = () => {
    //calc 돈
}
startGame(players)

const sutda = Promise.resolve();
sutda.then(() => {
    let currentCard = Object.assign({}, flowerCards); //현재 남은 장수를 세기 위함
})