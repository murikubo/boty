
const tangsoo = (said) => {
    let tangsoo = ['탕','수','육'];
    if(tangsoo.indexOf(said) == -1 ) {
        return false;
    } else if(said == tangsoo[0]) {
        return '수';
    } else if (said == tangsoo[1]) {
        return '육';
    } else if (said == tangsoo[2]) {
        return '탕';
    }
}