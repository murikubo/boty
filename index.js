const discord = require('discord.js');
const client = new discord.Client();
const fs = require('fs');
const yt = require('ytdl-core');
const config = require('./config.json');
const data = require('./data.json');
//const token = 'NDE1MzcwMDYzODk4NDc2NTU1.DW1jjw.JMmcjr9Kv97DuBVFUf7WRYCTbQs'; bottest계정
const talkedRecently = new Set();
//import kancolle_fm
//import todo
const translate = require('./src/translate')(client);
const laboratory = require('./src/laboratory')(client);


const prefix = '.';
let inChannel = '0'; //채널에 봇이 들어가있을 때를 구별하기 위한 전역변수. 만약 채널에 들어가있으면 1, 들어가있지 않으면 0.
let KRW_JPY = 0; //환율에 사용할 변수
let pie = '3.14'; //원주율
let JK = '0'; //여고생모드 스위치
let SR_COUNT = '0'; //10연챠시 SR확정 구현을 위한 카운트
let cindeFest = '0'; //페스모드 활성화 스위치
let skip = '0'; //통한의 스킵! 생략 모드의 스위치.
let SR_RESULT = 0;
let RARE_RESULT = 0;
let testModSwitch = '0';

client.on('ready', () => {
    console.info('Fumikasan Ver.2.5.0(Radio Happy)');
    client.user.setActivity('Radio Happy');
});

// Play streams using ytdl-core
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
client.on('message', message => {
    //if (!message.content.startsWith(prefix)) return; //프리픽스로 시작되지 않는 명령어들은 비활성화.

    const swearWords = ['됬', '됌', '엇을', '엇음', '겻', '깻', '햇음', '햇삼', '햇다', '햇을', '잇음', '밋음', '왓음', '겟음', '겟다', '엇다', '잇나', '잇게', '잇엇', '랫나', '랫엇','됏음','됏다','됏어'];
    if (swearWords.some(word => message.content.includes(word))) {
        let Sibyl_System = Math.floor((Math.random() * 999) + 100);
        if (Sibyl_System >= '300') {
            let Sibyl_low = Math.floor((Math.random() * 2) + 1); // 300이상이 나올 확률이 압도적으로 높으므로 줄여주는 코드들.
            if (Sibyl_low == 1) {
                message.reply('*범죄계수*' + Sibyl_System);
                message.reply('*범죄계수 오버 300, 신중하게 조준하여, 대상을 배제하십시오.*');
            } else if (Sibyl_low == 2) {
                let Sibyl_reTry_hight = Math.floor((Math.random() * 300) + 100);
                if (Sibyl_reTry_hight >= '100') {
                    message.reply('*범죄계수* ' + Sibyl_reTry_hight + ',*신중하게 조준하여 대상을 제압해주십시오.*');
                } else if (Sibyl_reTry_hight == 300) {
                    message.reply('*범죄계수*' + Sibyl_reTry_hight);
                    message.reply('*범죄계수 오버 300, 신중하게 조준하여, 대상을 배제하십시오.*');
                }
            }
        } else if (Sibyl_System >= '100') {
            message.reply('*범죄계수* ' + Sibyl_System + ',*신중하게 조준하여 대상을 제압해주십시오.*');
        }
    } 

    let word1 = ['아니요', '아닐걸요?', '꼭 그래야만 하나요?', '글쎄요', '그럴까요?', '진짜요?', '진심이세요?', '아마도요.', '그렇나봐요.', '저는 잘 모르죠.', '별로요.', '어떻게 그럴 수 있나요'];//'제가 이런 말 잘 안 하는데 이번만 말씀드릴게요.'+'\n'+'\n'+'네 그래요!'
    let word2 = ['아니예요', '아닐걸요? 인거예요', '하와와 꼭 그래야만 하나요?', '하와와...글쎄요', '호에에 그럴까요?', '호에에~ 진짜요?', '호게겟 진심이세요??', '아마도 인 것 같아예요.', '그렇나봐요 인거예요', '하와와 저는 잘 모르죠.', '호에에 별로에요.', '하와와..어떻게 그럴 수 있나요??']
    let result = [];
    let result2 = [];
    result[0] = word1[Math.floor(Math.random() * word1.length)];
    result2[0] = word2[Math.floor(Math.random() * word2.length)];
    let song = ['버스커버스커 - 벚꽃엔딩', '로이킴 - 봄봄봄', '유니 - 벚꽃비', '버스커버스커 - 꽃송이가', '버스커버스커 - 봄바람', '天海春香,島村卯月 - M@sterpiece', 'vy1v4 - fairytale,', '島村卯月 - Romantic Now', '윤종신 - 좋니', 'シンデレラガールズ劇場 - キラッ！満開スマイル(eurobeat remix)', '初音ミク - 千本桜', '千石撫子 - 恋愛サーキュレーション', '10cm - 봄이 좋냐', '김광진 - 동경소녀', '울랄라세션 - 달의 몰락', '桜の頃 EDM remix', 'LG 빡치게 하는 노래', '모리야마 나오타로 - 벛꽃'];
    let result1 = [];
    result1[0] = song[Math.floor(Math.random() * song.length)];
    let SSR = ['[SSR 스테이지 오브 매직] 시마무라 우즈키', '[SSR 게으른 왕국] 후타바 안즈', '[SSR 스테이지 오브 매직] 시부야 린', '[SSR 장미의 암희] 칸자키 란코', '[SSR 스테이지 오브 매직] 혼다 미오', '[SSR 그레이트 프레젠트] 모로보시 키라리', '[SSR 캣 파티] 마에카와 미쿠', '[SSR 펌프킨 파티] 토토키 아이리', '[SSR 화이트 위치] 미무라 카나코', '[SSR 노블 비너스] 닛타 미나미', '[SSR 꿈빛 클로버] 오가타 치에리', '[SSR 히트&비트] 타다 리이나', '[SSR 브라이트 메모리즈] 사기사와 후미카', '[SSR 키라데코☆퍼레이드] 죠가사키 리카', '[SSR 크리스탈 스노우] 아나스타샤', '[SSR 버닝 프레젠트] 히노 아카네', '[SSR 자칭 완벽] 코시미즈 사치코', '[SSR 친구가 잔뜩] 이치하라 니나', '[SSR 탱글탱글 우사밍] 아베 나나', '[SSR 하트★오버플로우] 죠가사키 미카', '[SSR 엔들리스 나이트] 하야미 카나데', '[SSR 플스윙☆엘] 히메카와 유키', '[SSR 필 마이 하트] 사쿠마 마유', '[SSR 해피 휩] 아카기 미리아', '[SSR 럭셔리 메모리] 카와시마 미즈키', '[SSR 미스틱 엘릭서] 이치노세 시키', '[SSR 오버 더 레인보우] 카미야 나오', '[SSR 손으로 만드는 행복] 타카모리 아이코', '[SSR 밤바람의 유혹] 타카가키 카에데', '[SSR 유스풀 로맨스] 코히나타 미호', '[SSR 빛나는 한때] 호죠 카렌', '[SSR 매쉬업★볼테이지] 호시 쇼코', '[SSR 꽃잎 흩날리는 절경] 코바야카와 사에', '[SSR 로즈 플뢰르] 사쿠라이 모모카', '[SSR 권화상등] 무카이 타쿠미', '[SSR <<우상>>의 플래그먼트] 니노미야 아스카', '[SSR 꿈꾸는 프린세스] 키타 히나코', '[SSR 따뜻한 하트] 이가라시 쿄코', '[SSR 처음 짓는 표정] 타치바나 아리스', '[SSR 이모셔널 비트] 키무라 나츠키', '[SSR 전율의 밤] 시라사카 코우메', '[SSR 애비뉴 모드] 미야모토 프레데리카', '[SSR 해신의 인도자] 요리타 요시노', '[SSR 드리밍 브라이드] 마에카와 미쿠', '[SSR 기다려지는 운명의 사람] 칸자키 란코', '[SSR 발랄 하베스트] 오이카와 시즈쿠', '[SSR 야경의 새벽바람] 시오미 슈코', '[SSR 마이 페어리테일] 오가타 치에리', '[SSR 피스풀 데이즈] 시마무라 우즈키', '[SSR 오버 마이셀프] 시부야 린', '[SSR 원더 엔터테이너] 혼다 미오', '[SSR 게으름뱅이 페어리] 후타바 안즈', '[SSR 섬머타임☆하이] 오오츠키 유이', '[SSR 루쥬 꾸뛰르] 미후네 미유', '[SSR 마음 한 다발] 아이바 유미', '[SSR 스타팅 데이즈] 오토쿠라 유우키', '[SSR 여름빛 남풍] 닛타 미나미', '[SSR 헤롱헤롱 섬머] 모로보시 키라리', '[SSR 메이크★임팩트] 하야사카 미레이', '[SSR 맑게 갠 세계] 카미죠 하루나', '[SSR 컵 오브 러브] 토토키 아이리', '[SSR 인비테이션 다이브] 이치노세 시키', '[SSR 조용한 향연] 사기사와 후미카', '[SSR 청춘 에너지] 호리 유코', '[SSR P.C.S] 코히나타 미호', '[SSR 별에 감싸인 이야기] 아나스타샤', '[SSR 자칭 스위트 히로인] 코시미즈 사치코', '[SSR 붉은빛 색채] 타카가키 카에데', '[SSR 글로리어스★글로우] 죠가사키 미카', '[SSR 트릿 오어 트릿] 사쿠마 마유', '[SSR 파티★햣하] 호시 쇼코', '[SSR 여닌자의 첫걸음] 하마구치 아야메', '[SSR 단 하나의 그릇] 후지와라 하지메', '[SSR 돌체 클래시카] 미무라 카나코', '[SSR 송 포 라이프] 호죠 카렌', '[SSR 따스한 거처] 타카모리 아이코', '[SSR 디어 마이 레이디] 사쿠라이 모모카', '[SSR 하트 투 하트] 사토 신', '[SSR 숲의 이야기] 모리쿠보 노노', '[SSR 류미엘 에트왈] 미야모토 프레데리카', '[SSR 드레스업 나이트] 카미야 나오', '[SSR 해바라기 서니데이] 류자키 카오루', '[SSR 에어리얼 멜로디어] 미즈모토 유카리', '[SSR 넥스트☆페이지] 아라키 히나', '[SSR 우사밍 더 시크릿] 아베 나나', '[SSR 비몽사몽 꽃 모양] 시오미 슈코', '[SSR 솔 파라이소] 오오츠키 유이', '[SSR 꽃피는 연회] 코바야카와 사에', '[SSR 축복의 기도] 요리타 요시노', '[SSR 메이크 미 키스 유] 아카기 미리아', '[SSR 인사이트 익스텐드] 야가미 마키노', '[SSR 러브!스트레이트] 나카노 유카', '[SSR 팰리스 오브 판타지아] 나노미야 아스카', '[SSR 겹쳐진 꽃잎] 아이바 유미', '[SSR Ring♪Ring♪필링] 시이나 노리코', '[SSR 하이텐션 스매쉬] 키타미 유즈', '[SSR 눈을 뜬 채로 꾸는 꿈] 타다 리이나', '[SSR 드라마틱 나이트] 이가라시 쿄코', '[SSR 마음, 취하게 해] 미후네 미유', '[SSR 섹시 BANG☆BANG] 카타기리 사나에', '[SSR SOUND A ROUND] 마츠나가 료', '[SSR 만나게 된 동경] 세키 히로미', '[SSR 엔드 오브 더 블루] 하야미 카나데', '[SSR 컴 위드 미!] 오토쿠라 유우키', '[SSR 서클☆오브☆프렌즈] 죠가사키 리카', '[SSR 비밀의 소야곡] 사죠 유키미', '[SSR 포지티브 패션] 히노 아카네', '[SSR 러브모리☆파리] 후지모토 리나', '[SSR 요모스가라 파티] 사라사카 코우메', '[SSR 렛츠 고☆퍼레이드] 히메카와 유키', '[SSR 요정의 아이] 유사 코즈에', '[SSR 스텝 투 미라이] 사사키 치에', '[SSR 붉은 주먹] 무라카미 토모에', '[SSR 인열을 밎는 이] 도묘지 카린', '[SSR 이터널 블룸] 시부야 린', '[SSR FELL SO FREE] 키무라 나츠키', '[SSR 주물주물 원더포] 무나카타 아츠미', '[SSR 커맨드 오브 스테이지] 야마토 아키', '[SSR 아방튀르 샤토] 마에카와 미쿠', '[SSR 자칭 파티 피플] 코시미즈 사치코', '[SSR 러브 음메 스위트] 오이카와 시즈쿠', '[SSR 진검일섬] 와키야마 타마미', '[SSR 비비드★에고이스트] 마토바 리사', '[SSR 꺾이지 않는 꽃] 시라기쿠 호타루', '[SSR 태양보다 뜨겁게!] 나카노 유카', '[SSR 블루 호라이즌] 시오미 슈코', '[SSR 오늘의 주역] 남바 에미', '[SSR 앰비벌런트 액트] 카와시마 미즈키', '[SSR 메모리얼 데이즈] 이마이 카나', '[SSR 프라이빗 메이드] 토토키 아이리', '[SSR 기프트 포 앤서] 모리쿠보 노노', '[SSR 브릴리언트 하아트] 사토 신', '[SSR 있는 그대로의 거리로] 타카가키 카에데', '[SSR 퓨어 유포리아] 사이온지 코토카', '[SSR 하트비트 삼바!] 나탈리아', '[SSR 스마일 앤드 트릿] 시마무라 우즈키', '[SSR 할로윈 몬스터] 이치하라 니나', '[SSR 아리스의 티 파티] 타치바나 아리스', '[SSR 플레이 더 게임] 미요시 사나', '[SSR 동경하던 공주님] 코가 코하루', '[SSR 극광의 선율] 아나스타샤', '[SSR 미스틱 던] 하야미 카나데', '[SSR 트릭☆조커] 호리 유코', '[SSR 꿈을 좇는 사람의 빛] 쿠도 시노부', '[SSR 롤리팝 허니] 오오츠키 유이', '[SSR 이국에 부는 바람] 라일라', '[SSR 메리 메리 화이트] 오가타 치에리', '[SSR 칼레이도 스노우] 혼다 미오', '[SSR 오더 포 톱] 키류 츠카사', '[SSR 축복의 눈빛] 클라리스', '[SSR 복숭앗빛 분노] 무카이 타쿠미', '[SSR 올 포 펀] 후타바 안즈', '[SSR 하삐하삐☆원더랜드] 모로보시 키라리', '[SSR 신춘의 채색] 미무라 카나코', '[SSR 복을 부르는 무희] 타카후지 카코', '[SSR 퀸 오브 퀸] 자이젠 토키코', '[SSR 드리밍☆우사밍] 아베 나나', '[SSR 설레이는 어드벤처] 우지이에 무츠미', '[SSR 비터 스위트 타임] 코히나타 미호', '[SSR 두근콩닥! 유즈 레시피] 키타미 유즈', '[SSR 뉴 웨이브 네이비] 오오이시 이즈미', '[SSR 센터 오브 스트리트] 죠가사키 미카', '[SSR 견실한 소망] 쿠리하라 네네', '[SSR 아이러니컬 에트랑제] 이치노세 시키', '[SSR 깜찍한 소악마] 사사키 치에', '[SSR 팝핀 하이☆] 아카기 미리아', '[SSR 뉴 웨이브 피치] 무라마츠 사쿠라', '[SSR 번 앤 던!] 코세키 레이나'];
    let SSR_tsujyou = ['[SSR 스테이지 오브 매직] 시마무라 우즈키', '[SSR 게으른 왕국] 후타바 안즈', '[SSR 스테이지 오브 매직] 시부야 린', '[SSR 장미의 암희] 칸자키 란코', '[SSR 스테이지 오브 매직] 혼다 미오', '[SSR 그레이트 프레젠트] 모로보시 키라리', '[SSR 캣 파티] 마에카와 미쿠', '[SSR 펌프킨 파티] 토토키 아이리', '[SSR 화이트 위치] 미무라 카나코', '[SSR 노블 비너스] 닛타 미나미', '[SSR 꿈빛 클로버] 오가타 치에리', '[SSR 히트&비트] 타다 리이나', '[SSR 브라이트 메모리즈] 사기사와 후미카', '[SSR 키라데코☆퍼레이드] 죠가사키 리카', '[SSR 크리스탈 스노우] 아나스타샤', '[SSR 버닝 프레젠트] 히노 아카네', '[SSR 자칭 완벽] 코시미즈 사치코', '[SSR 친구가 잔뜩] 이치하라 니나', '[SSR 탱글탱글 우사밍] 아베 나나', '[SSR 하트★오버플로우] 죠가사키 미카', '[SSR 엔들리스 나이트] 하야미 카나데', '[SSR 플스윙☆엘] 히메카와 유키', '[SSR 필 마이 하트] 사쿠마 마유', '[SSR 해피 휩] 아카기 미리아', '[SSR 럭셔리 메모리] 카와시마 미즈키', '[SSR 미스틱 엘릭서] 이치노세 시키', '[SSR 오버 더 레인보우] 카미야 나오', '[SSR 손으로 만드는 행복] 타카모리 아이코', '[SSR 밤바람의 유혹] 타카가키 카에데', '[SSR 유스풀 로맨스] 코히나타 미호', '[SSR 빛나는 한때] 호죠 카렌', '[SSR 매쉬업★볼테이지] 호시 쇼코', '[SSR 꽃잎 흩날리는 절경] 코바야카와 사에', '[SSR 로즈 플뢰르] 사쿠라이 모모카', '[SSR 권화상등] 무카이 타쿠미', '[SSR <<우상>>의 플래그먼트] 니노미야 아스카', '[SSR 꿈꾸는 프린세스] 키타 히나코', '[SSR 따뜻한 하트] 이가라시 쿄코', '[SSR 처음 짓는 표정] 타치바나 아리스', '[SSR 이모셔널 비트] 키무라 나츠키', '[SSR 전율의 밤] 시라사카 코우메', '[SSR 애비뉴 모드] 미야모토 프레데리카', '[SSR 해신의 인도자] 요리타 요시노', '[SSR 드리밍 브라이드] 마에카와 미쿠', '[SSR 기다려지는 운명의 사람] 칸자키 란코', '[SSR 발랄 하베스트] 오이카와 시즈쿠', '[SSR 야경의 새벽바람] 시오미 슈코', '[SSR 마이 페어리테일] 오가타 치에리', '[SSR 게으름뱅이 페어리] 후타바 안즈', '[SSR 섬머타임☆하이] 오오츠키 유이', '[SSR 루쥬 꾸뛰르] 미후네 미유', '[SSR 마음 한 다발] 아이바 유미', '[SSR 스타팅 데이즈] 오토쿠라 유우키', '[SSR 여름빛 남풍] 닛타 미나미', '[SSR 헤롱헤롱 섬머] 모로보시 키라리', '[SSR 메이크★임팩트] 하야사카 미레이', '[SSR 맑게 갠 세계] 카미죠 하루나', '[SSR 컵 오브 러브] 토토키 아이리', '[SSR 인비테이션 다이브] 이치노세 시키', '[SSR 조용한 향연] 사기사와 후미카', '[SSR 청춘 에너지] 호리 유코', '[SSR P.C.S] 코히나타 미호', '[SSR 별에 감싸인 이야기] 아나스타샤', '[SSR 트릿 오어 트릿] 사쿠마 마유', '[SSR 파티★햣하] 호시 쇼코', '[SSR 여닌자의 첫걸음] 하마구치 아야메', '[SSR 단 하나의 그릇] 후지와라 하지메', '[SSR 돌체 클래시카] 미무라 카나코', '[SSR 송 포 라이프] 호죠 카렌', '[SSR 따스한 거처] 타카모리 아이코', '[SSR 디어 마이 레이디] 사쿠라이 모모카', '[SSR 하트 투 하트] 사토 신', '[SSR 숲의 이야기] 모리쿠보 노노', '[SSR 류미엘 에트왈] 미야모토 프레데리카', '[SSR 드레스업 나이트] 카미야 나오', '[SSR 해바라기 서니데이] 류자키 카오루', '[SSR 에어리얼 멜로디어] 미즈모토 유카리', '[SSR 넥스트☆페이지] 아라키 히나', '[SSR 꽃피는 연회] 코바야카와 사에', '[SSR 축복의 기도] 요리타 요시노', '[SSR 메이크 미 키스 유] 아카기 미리아', '[SSR 인사이트 익스텐드] 야가미 마키노', '[SSR 러브!스트레이트] 나카노 유카', '[SSR 팰리스 오브 판타지아] 나노미야 아스카', '[SSR 겹쳐진 꽃잎] 아이바 유미', '[SSR Ring♪Ring♪필링] 시이나 노리코', '[SSR 하이텐션 스매쉬] 키타미 유즈', '[SSR 눈을 뜬 채로 꾸는 꿈] 타다 리이나', '[SSR 드라마틱 나이트] 이가라시 쿄코', '[SSR 마음, 취하게 해] 미후네 미유', '[SSR 섹시 BANG☆BANG] 카타기리 사나에', '[SSR SOUND A ROUND] 마츠나가 료', '[SSR 만나게 된 동경] 세키 히로미', '[SSR 컴 위드 미!] 오토쿠라 유우키', '[SSR 서클☆오브☆프렌즈] 죠가사키 리카', '[SSR 비밀의 소야곡] 사죠 유키미', '[SSR 포지티브 패션] 히노 아카네', '[SSR 러브모리☆파리] 후지모토 리나', '[SSR 요모스가라 파티] 사라사카 코우메', '[SSR 렛츠 고☆퍼레이드] 히메카와 유키', '[SSR 요정의 아이] 유사 코즈에', '[SSR 스텝 투 미라이] 사사키 치에', '[SSR 붉은 주먹] 무라카미 토모에', '[SSR 인열을 밎는 이] 도묘지 카린', '[SSR 이터널 블룸] 시부야 린', '[SSR FELL SO FREE] 키무라 나츠키', '[SSR 주물주물 원더포] 무나카타 아츠미', '[SSR 커맨드 오브 스테이지] 야마토 아키', '[SSR 자칭 파티 피플] 코시미즈 사치코', '[SSR 러브 음메 스위트] 오이카와 시즈쿠', '[SSR 진검일섬] 와키야마 타마미', '[SSR 비비드★에고이스트] 마토바 리사', '[SSR 꺾이지 않는 꽃] 시라기쿠 호타루', '[SSR 태양보다 뜨겁게!] 나카노 유카', '[SSR 블루 호라이즌] 시오미 슈코', '[SSR 오늘의 주역] 남바 에미', '[SSR 앰비벌런트 액트] 카와시마 미즈키', '[SSR 메모리얼 데이즈] 이마이 카나', '[SSR 기프트 포 앤서] 모리쿠보 노노', '[SSR 브릴리언트 하아트] 사토 신', '[SSR 있는 그대로의 거리로] 타카가키 카에데', '[SSR 퓨어 유포리아] 사이온지 코토카', '[SSR 하트비트 삼바!] 나탈리아', '[SSR 스마일 앤드 트릿] 시마무라 우즈키', '[SSR 할로윈 몬스터] 이치하라 니나', '[SSR 아리스의 티 파티] 타치바나 아리스', '[SSR 플레이 더 게임] 미요시 사나', '[SSR 동경하던 공주님] 코가 코하루', '[SSR 미스틱 던] 하야미 카나데', '[SSR 트릭☆조커] 호리 유코', '[SSR 꿈을 좇는 사람의 빛] 쿠도 시노부', '[SSR 롤리팝 허니] 오오츠키 유이', '[SSR 이국에 부는 바람] 라일라', '[SSR 메리 메리 화이트] 오가타 치에리', '[SSR 칼레이도 스노우] 혼다 미오', '[SSR 오더 포 톱] 키류 츠카사', '[SSR 축복의 눈빛] 클라리스', '[SSR 복숭앗빛 분노] 무카이 타쿠미', '[SSR 신춘의 채색] 미무라 카나코', '[SSR 복을 부르는 무희] 타카후지 카코', '[SSR 퀸 오브 퀸] 자이젠 토키코', '[SSR 드리밍☆우사밍] 아베 나나', '[SSR 설레이는 어드벤처] 우지이에 무츠미', '[SSR 비터 스위트 타임] 코히나타 미호', '[SSR 두근콩닥! 유즈 레시피] 키타미 유즈', '[SSR 뉴 웨이브 네이비] 오오이시 이즈미', '[SSR 센터 오브 스트리트] 죠가사키 미카', '[SSR 견실한 소망] 쿠리하라 네네', '[SSR 깜찍한 소악마] 사사키 치에', '[SSR 팝핀 하이☆] 아카기 미리아', '[SSR 뉴 웨이브 피치] 무라마츠 사쿠라', '[SSR 번 앤 던!] 코세키 레이나'];
    let SSR_gentei = ['[SSR 스테이지 오브 매직] 시마무라 우즈키', '[SSR 게으른 왕국] 후타바 안즈', '[SSR 스테이지 오브 매직] 시부야 린', '[SSR 장미의 암희] 칸자키 란코', '[SSR 스테이지 오브 매직] 혼다 미오', '[SSR 그레이트 프레젠트] 모로보시 키라리', '[SSR 캣 파티] 마에카와 미쿠', '[SSR 펌프킨 파티] 토토키 아이리', '[SSR 화이트 위치] 미무라 카나코', '[SSR 노블 비너스] 닛타 미나미', '[SSR 꿈빛 클로버] 오가타 치에리', '[SSR 히트&비트] 타다 리이나', '[SSR 브라이트 메모리즈] 사기사와 후미카', '[SSR 키라데코☆퍼레이드] 죠가사키 리카', '[SSR 크리스탈 스노우] 아나스타샤', '[SSR 버닝 프레젠트] 히노 아카네', '[SSR 자칭 완벽] 코시미즈 사치코', '[SSR 친구가 잔뜩] 이치하라 니나', '[SSR 탱글탱글 우사밍] 아베 나나', '[SSR 하트★오버플로우] 죠가사키 미카', '[SSR 엔들리스 나이트] 하야미 카나데', '[SSR 플스윙☆엘] 히메카와 유키', '[SSR 필 마이 하트] 사쿠마 마유', '[SSR 해피 휩] 아카기 미리아', '[SSR 럭셔리 메모리] 카와시마 미즈키', '[SSR 미스틱 엘릭서] 이치노세 시키', '[SSR 오버 더 레인보우] 카미야 나오', '[SSR 손으로 만드는 행복] 타카모리 아이코', '[SSR 밤바람의 유혹] 타카가키 카에데', '[SSR 유스풀 로맨스] 코히나타 미호', '[SSR 빛나는 한때] 호죠 카렌', '[SSR 매쉬업★볼테이지] 호시 쇼코', '[SSR 꽃잎 흩날리는 절경] 코바야카와 사에', '[SSR 로즈 플뢰르] 사쿠라이 모모카', '[SSR 권화상등] 무카이 타쿠미', '[SSR <<우상>>의 플래그먼트] 니노미야 아스카', '[SSR 꿈꾸는 프린세스] 키타 히나코', '[SSR 따뜻한 하트] 이가라시 쿄코', '[SSR 처음 짓는 표정] 타치바나 아리스', '[SSR 이모셔널 비트] 키무라 나츠키', '[SSR 전율의 밤] 시라사카 코우메', '[SSR 애비뉴 모드] 미야모토 프레데리카', '[SSR 해신의 인도자] 요리타 요시노', '[SSR 드리밍 브라이드] 마에카와 미쿠', '[SSR 기다려지는 운명의 사람] 칸자키 란코', '[SSR 발랄 하베스트] 오이카와 시즈쿠', '[SSR 야경의 새벽바람] 시오미 슈코', '[SSR 마이 페어리테일] 오가타 치에리', '[SSR 게으름뱅이 페어리] 후타바 안즈', '[SSR 섬머타임☆하이] 오오츠키 유이', '[SSR 루쥬 꾸뛰르] 미후네 미유', '[SSR 마음 한 다발] 아이바 유미', '[SSR 스타팅 데이즈] 오토쿠라 유우키', '[SSR 여름빛 남풍] 닛타 미나미', '[SSR 헤롱헤롱 섬머] 모로보시 키라리', '[SSR 메이크★임팩트] 하야사카 미레이', '[SSR 맑게 갠 세계] 카미죠 하루나', '[SSR 컵 오브 러브] 토토키 아이리', '[SSR 인비테이션 다이브] 이치노세 시키', '[SSR 조용한 향연] 사기사와 후미카', '[SSR 청춘 에너지] 호리 유코', '[SSR P.C.S] 코히나타 미호', '[SSR 별에 감싸인 이야기] 아나스타샤', '[SSR 트릿 오어 트릿] 사쿠마 마유', '[SSR 파티★햣하] 호시 쇼코', '[SSR 여닌자의 첫걸음] 하마구치 아야메', '[SSR 단 하나의 그릇] 후지와라 하지메', '[SSR 돌체 클래시카] 미무라 카나코', '[SSR 송 포 라이프] 호죠 카렌', '[SSR 따스한 거처] 타카모리 아이코', '[SSR 디어 마이 레이디] 사쿠라이 모모카', '[SSR 하트 투 하트] 사토 신', '[SSR 숲의 이야기] 모리쿠보 노노', '[SSR 류미엘 에트왈] 미야모토 프레데리카', '[SSR 드레스업 나이트] 카미야 나오', '[SSR 해바라기 서니데이] 류자키 카오루', '[SSR 에어리얼 멜로디어] 미즈모토 유카리', '[SSR 넥스트☆페이지] 아라키 히나', '[SSR 꽃피는 연회] 코바야카와 사에', '[SSR 축복의 기도] 요리타 요시노', '[SSR 메이크 미 키스 유] 아카기 미리아', '[SSR 인사이트 익스텐드] 야가미 마키노', '[SSR 러브!스트레이트] 나카노 유카', '[SSR 팰리스 오브 판타지아] 나노미야 아스카', '[SSR 겹쳐진 꽃잎] 아이바 유미', '[SSR Ring♪Ring♪필링] 시이나 노리코', '[SSR 하이텐션 스매쉬] 키타미 유즈', '[SSR 눈을 뜬 채로 꾸는 꿈] 타다 리이나', '[SSR 드라마틱 나이트] 이가라시 쿄코', '[SSR 마음, 취하게 해] 미후네 미유', '[SSR 섹시 BANG☆BANG] 카타기리 사나에', '[SSR SOUND A ROUND] 마츠나가 료', '[SSR 만나게 된 동경] 세키 히로미', '[SSR 컴 위드 미!] 오토쿠라 유우키', '[SSR 서클☆오브☆프렌즈] 죠가사키 리카', '[SSR 비밀의 소야곡] 사죠 유키미', '[SSR 포지티브 패션] 히노 아카네', '[SSR 러브모리☆파리] 후지모토 리나', '[SSR 요모스가라 파티] 사라사카 코우메', '[SSR 렛츠 고☆퍼레이드] 히메카와 유키', '[SSR 요정의 아이] 유사 코즈에', '[SSR 스텝 투 미라이] 사사키 치에', '[SSR 붉은 주먹] 무라카미 토모에', '[SSR 인열을 밎는 이] 도묘지 카린', '[SSR 이터널 블룸] 시부야 린', '[SSR FELL SO FREE] 키무라 나츠키', '[SSR 주물주물 원더포] 무나카타 아츠미', '[SSR 커맨드 오브 스테이지] 야마토 아키', '[SSR 자칭 파티 피플] 코시미즈 사치코', '[SSR 러브 음메 스위트] 오이카와 시즈쿠', '[SSR 진검일섬] 와키야마 타마미', '[SSR 비비드★에고이스트] 마토바 리사', '[SSR 꺾이지 않는 꽃] 시라기쿠 호타루', '[SSR 태양보다 뜨겁게!] 나카노 유카', '[SSR 블루 호라이즌] 시오미 슈코', '[SSR 오늘의 주역] 남바 에미', '[SSR 앰비벌런트 액트] 카와시마 미즈키', '[SSR 메모리얼 데이즈] 이마이 카나', '[SSR 기프트 포 앤서] 모리쿠보 노노', '[SSR 브릴리언트 하아트] 사토 신', '[SSR 있는 그대로의 거리로] 타카가키 카에데', '[SSR 퓨어 유포리아] 사이온지 코토카', '[SSR 하트비트 삼바!] 나탈리아', '[SSR 스마일 앤드 트릿] 시마무라 우즈키', '[SSR 할로윈 몬스터] 이치하라 니나', '[SSR 아리스의 티 파티] 타치바나 아리스', '[SSR 플레이 더 게임] 미요시 사나', '[SSR 동경하던 공주님] 코가 코하루', '[SSR 미스틱 던] 하야미 카나데', '[SSR 트릭☆조커] 호리 유코', '[SSR 꿈을 좇는 사람의 빛] 쿠도 시노부', '[SSR 롤리팝 허니] 오오츠키 유이', '[SSR 이국에 부는 바람] 라일라', '[SSR 메리 메리 화이트] 오가타 치에리', '[SSR 칼레이도 스노우] 혼다 미오', '[SSR 오더 포 톱] 키류 츠카사', '[SSR 축복의 눈빛] 클라리스', '[SSR 복숭앗빛 분노] 무카이 타쿠미', '[SSR 신춘의 채색] 미무라 카나코', '[SSR 복을 부르는 무희] 타카후지 카코', '[SSR 퀸 오브 퀸] 자이젠 토키코', '[SSR 드리밍☆우사밍] 아베 나나', '[SSR 설레이는 어드벤처] 우지이에 무츠미', '[SSR 비터 스위트 타임] 코히나타 미호', '[SSR 두근콩닥! 유즈 레시피] 키타미 유즈', '[SSR 뉴 웨이브 네이비] 오오이시 이즈미', '[SSR 센터 오브 스트리트] 죠가사키 미카', '[SSR 견실한 소망] 쿠리하라 네네', '[SSR 깜찍한 소악마] 사사키 치에', '[SSR 팝핀 하이☆] 아카기 미리아', '[SSR 뉴 웨이브 피치] 무라마츠 사쿠라', '[SSR 번 앤 던!] 코세키 레이나'];
    let SR = ['[SR]'];
    let RARE = ['[RARE]'];
    let result_SSR = [];
    let result_SSR_tsujyou = [];
    let result_SSR_gentei = [];
    let result_SR = [];
    let result_RARE = [];
    result_SSR[0] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[0] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[1] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[1] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[2] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[2] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[3] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[3] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[4] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[4] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[5] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[5] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[6] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[6] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[7] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[7] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[8] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[8] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR[9] = SSR[Math.floor(Math.random()*SSR.length)];  result_SSR_tsujyou[9] = SSR_tsujyou[Math.floor(Math.random()*SSR_tsujyou.length)];
    result_SSR_gentei[0] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[1] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[2] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[3] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[4] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[5] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[6] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[7] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[8] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SSR_gentei[9] = SSR_gentei[Math.floor(Math.random()*SSR_gentei.length)];
    result_SR[0] = SR[Math.floor(Math.random()*SR.length)];
    result_RARE[0] = RARE[Math.floor(Math.random()*RARE.length)];
    let jsonSSR = data.ssr;
    let result_jsonSSR = [];
    result_jsonSSR[0] = jsonSSR[Math.floor(Math.random()*jsonSSR.length)];

    if (message.content.startsWith(prefix + '도움말')) {
        if (JK == '1') {
            message.channel.send('.추천곡', { code: 'true' });
            message.channel.send('해당 명령어로 후미카씨가 각 계절에 맞는 곡들을 랜덤으로 추천해주는 것 같아 인거예요!');
            message.channel.send('> *__하와와~ 그러나 후미카씨가 25%의 확률로 자신의 곡을 추천!__*');
        } else if (JK == '0') {
            message.channel.send('.추천곡', { code: 'true' });
            message.channel.send('해당 명령어로 후미카씨가 각 계절에 맞는 곡들을 랜덤으로 추천해줍니다!');
            message.channel.send('> *__그러나 후미카씨가 25%의 확률로 자신의 곡을 추천합니다.__*');
        }
    }

    if (message.content.startsWith(prefix + '명령어')) {
        if (JK == '1') {
            message.channel.send('.추천곡' + '\n' + '\n' +
                '.도움말 -> 추천곡 기능의 도움말을 제공하는거예요.' + '\n' + '\n' +
                '.야 -> +할말로 일정 대답을 얻을 수 있는 거예요.' + '\n' + '\n' +
                '.채널아이디 -> 속해있는 채널의 아이디를 제공하는거예요.' + '\n' + '\n' +
                '.아이디 -> 해당 명령어를 사용한 유저의 아이디를 제공하는거예요.' + '\n' + '\n' +
                '.계정정보 -> 해당 명령어를 사용한 유저의 계정정보를 제공하는거예요.' + '\n' + '\n' +
                '.이름 -> 해당 명령어를 사용한 유저의 이름을 제공하는 거예요.' + '\n' + '\n' +
                '.이리와/.들어와 -> 속해있는 음성채널에 참여하는 거예요.' + '\n' + '\n' +
                '.나가/꺼져 -> 속해있던 음성채널에서 내보내는 거예요.' + '\n' + '\n' +
                '.나갔다들어와 -> 속해있던 음성채널에서 내보냈다가 들이는거예요.' + '\n' + '\n' +
                '.시무슈 -> 음성채널에 속해있을 경우 시무슈 거리는 것 같아 인거예요?' + '\n' + '\n' +
                '.원주율 -> 쓸대없이 원주율을 알려주는거예요. 도배 방지로 다시 보기 위해선 재부팅이 필요 한 것 같아 인거예요.' + '\n' + '\n' +
                '.이과 -> *하와와 이과충은 죽는 것 이예요*' + '\n' + '\n' +
                '.성덕 -> *세상말종쓰레기자식 죽는 거예요 하와와*' + '\n' + '\n' +
                '.여고생모드 -> 히와와 일부 대답을 여고생 말투로 하는 후미카씨의 여고생모드를 on하는 거예요. ' + '\n' + '\n' +
                '.해제 -> 하와와 여고생모드를 해제하는거예요.' + '\n' + '\n' +
                '.범죄계수 -> 해당 명령어를 입력한 유저의 범죄계수를 측정하여 알려주는 거예요. (하와와 이건 여고생모드가 적용되지 않는 거예요.)' + '\n' + '\n' +
                '.가챠 -> 게임과 동일한 확률로 10연가샤 시뮬을 지원하는 거예요.' + '\n' + '\n' +
                '.페스 -> 가챠의 출현 테이블에 페스돌을 추가하고 SSR의 확률을 두 배 높이는거예요.' + '\n' + '\n' +
                '.통상 -> 가챠의 출현 테이블에서 한정돌을 전부 제거하고 SSR의 확률을 원래대로 돌리는거예요.' + '\n' + '\n' +
                '.한정 -> 가챠의 출현 테이블에 한정돌을 추가하는거예요.' + '\n' + '\n' +
                '.모드 -> 현재의 여고생모드와 신데페스/한정가샤 모드의 on/off 여부를 알려주는 거예요.' + '\n' + '\n' +
                '.생략 -> 가챠시 SSR 등장 외 카드들은 결과로만 알려주는 것 이예요.' + '\n' + '\n' +
                '.전부 -> 가챠시 SSR 등장 외 카드들도 전부 알려드리는 것 인거예요.'
                , { code: 'true' });
        } else if (JK == '0') {
            message.channel.send('.추천곡' + '\n' + '\n' +
                '.도움말 -> 추천곡 기능의 도움말을 제공합니다.' + '\n' + '\n' +
                '.야 -> +할말로 일정 대답을 얻을 수 있습니다.' + '\n' + '\n' +
                '.채널아이디 -> 속해있는 채널의 아이디를 제공합니다.' + '\n' + '\n' +
                '.아이디 -> 해당 명령어를 사용한 유저의 아이디를 제공합니다.' + '\n' + '\n' +
                '.계정정보 -> 해당 명령어를 사용한 유저의 계정정보를 제공합니다.' + '\n' + '\n' +
                '.이름 -> 해당 명령어를 사용한 유저의 이름을 제공합니다.' + '\n' + '\n' +
                '.이리와/.들어와 -> 속해있는 음성채널에 참여시킵니다.' + '\n' + '\n' +
                '.나가/꺼져 -> 속해있던 음성채널에서 내보냅니다.' + '\n' + '\n' +
                '.나갔다들어와 -> 속해있던 음성채널에서 내보냈다가 들입니다.' + '\n' + '\n' +
                '.시무슈 -> 음성채널에 속해있을 경우 시무슈 거립니다?' + '\n' + '\n' +
                '.원주율 -> 쓸대없이 원주율을 알려줍니다. 도배 방지로 다시 보기 위해선 재부팅이 필요합니다.' + '\n' + '\n' +
                '.이과 -> *이과충 죽어*' + '\n' + '\n' +
                '.성덕 -> *세상말종쓰레기자식*' + '\n' + '\n' +
                '.여고생모드 -> 일부 대답을 여고생 말투로 하는 후미카씨의 여고생모드를 on합니다. ' + '\n' + '\n' +
                '.해제 -> 여고생모드를 해제합니다.' + '\n' + '\n' +
                '.범죄계수 -> 해당 명령어를 입력한 유저의 범죄계수를 측정하여 알려줍니다. (여고생모드가 적용되지 않습니다.)' + '\n' + '\n' +
                '.가챠 -> 게임과 동일한 확률로 10연가샤 시뮬을 지원합니다.' + '\n' + '\n' +
                '.페스 -> 가챠의 출현 테이블에 페스돌을 추가하고 SSR의 확률을 두 배 높게 설정합니다.' + '\n' + '\n' +
                '.통상 -> 가챠의 출현 테이블에서 한정돌을 전부 제거하고 SSR의 확률을 원래대로 복구합니다.' + '\n' + '\n' +
                '.한정 -> 가챠의 출현 테이블에 한정돌을 추가합니다.' + '\n' + '\n' +
                '.모드 -> 현재의 여고생모드와 신데페스 모드의 on/off 여부를 알려줍니다.' + '\n' + '\n' +
                '.생략 -> 가챠시 SSR 등장 외 카드들은 결과로만 알려줍니다.' + '\n' + '\n' +
                '.전부 -> 가챠시 SSR 등장 외 카드들도 전부 알려줍니다.'
                , { code: 'true' });
        }
    }

    if (message.content.startsWith(prefix + '추천곡')) {
        let flag = Math.floor((Math.random() * 4) + 1);
        if (flag == '1') {
            message.channel.send(result1[0]);
        } else if (flag == '2') {
            message.channel.send(result1[0]);
        } else if (flag == '3') {
            //message.channel.send('sagisawa fumika - bright blue old clock remix');
            message.channel.send('*검열스킵 당했습니다*');
        } else if (flag == '4') {
            message.channel.send(result1[0]);
        }
    }

    if (message.content.startsWith(config.prefix + "테스트가챠")) {
        message.channel.send('테스트 가챠입니다. 모든 아이돌이 출현하고 SSR확률이 6%로 고정됩니다.', { code: 'true' });
        SR_RESULT = 0;
        RARE_RESULT = 0;
        SR_COUNT = '0';
        let objectCount = Object.keys(data.ssr).length;
        for (let i = 0; i < 10; i++) {
            let gacha = Math.floor((Math.random() * 100) + 1);
            if (SR_COUNT == '9') {
                SR_RESULT++;
            } else if (gacha <= '6') {
                let gachaResult= data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)]; 
                let genTeiSwitch = gachaResult.gacha_type; 
                let upTitle = gachaResult.title; 
                let upName = gachaResult.name; 
                let sign = gachaResult.sign; 
                let typeColorSwitch = gachaResult.type;
                let typeColor='';
                let gachaType = '';
                if(typeColorSwitch == 'cute'){
                    typeColor = '#FFB2F5';
                } else if(typeColorSwitch == 'cool'){
                    typeColor = '#1266FF';
                } else if(typeColorSwitch == 'passion'){
                    typeColor = '#FFBB00';
                }
                if(genTeiSwitch == 'tsujyou'){
                    gachaType = '통상 아이돌';
                } else if(genTeiSwitch == 'gentei'){
                    gachaType = '한정 아이돌';
                } else if(genTeiSwitch == 'cindeFest'){
                    gachaType = '페스 아이돌';
                }
                const embed = new discord.RichEmbed()
                    .setTitle("SSR획득!")
                    .setAuthor(client.user.username, client.user.avatarURL)
                    .setColor(typeColor)
                    .setDescription(gachaType)
                    .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
                    //.setImage("") //하단 이미지
                    .setThumbnail(sign) //썸네일 이미지
                    .setTimestamp()
                    //.setURL("") //타이틀에 URL
                    .addField(upTitle,
                        upName)
                //.addField("", "", true) //인라인필드
                /*
                 * 빈 칸 만들어주는 필드
                 */
                //.addBlankField(true)
                //.addField("필드3", "필드 25개까지.", true);

                message.channel.send({ embed });
            } else if ('7' <= gacha && gacha <= '16') {
                SR_RESULT++;
            } else if (gacha >= '17') {
                RARE_RESULT++;
                SR_COUNT++;
            }
        }message.channel.send('획득한 RARE : ' + RARE_RESULT);
        message.channel.send('획득한 SR : ' + SR_RESULT);
    }

    if (message.content.startsWith(config.prefix + '데이터')) {
        for (let i = 0; i < 3; i++) {
            let dataGacha = Math.floor((Math.random() * 3) + 1);
            let idol_type = '';
            /* idol_type = data.jsonTest[3 - dataGacha].type;
             if (idol_type == 'cute') {
                message.channel.send(data.jsonTest[3 - dataGacha].title + data.jsonTest[3 - dataGacha].name);
            } else if (idol_type == 'cool') {
                message.channel.send(data.jsonTest[3 - dataGacha].title + data.jsonTest[3 - dataGacha].name);
            } else if (idol_type == 'passion') {
                message.channel.send(data.jsonTest[3 - dataGacha].title + data.jsonTest[3 - dataGacha].name);
            } */

            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: '가챠 결과',
                    description: 'RARE : 999개, SR : 999개'+'테스트용 가챠입니다.',
                    fields: [{
                        name: data.jsonTest[3-dataGacha].title,
                        value: data.jsonTest[3 - dataGacha].name
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '명령어 입력 시간 '
                    }
                }
            });
        }
        //message.channel.send(data.ssr[0].type);
        //message.channel.send(data.jsonTest[0].name);
        //message.channel.send(data.jsonTest[0].type);
    }

    if (message.content.startsWith(prefix + '가챠')) {
        let objectCount = Object.keys(data.ssr).length;
        SR_COUNT = '0';
        let j = 0;
        if (skip == 0) { //비 생략모드
            if (cindeFest == '1') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha <= '6') {
                        let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let genTeiSwitch = gachaResult.gacha_type;
                    let upTitle = gachaResult.title;
                    let upName = gachaResult.name;
                    let sign = gachaResult.sign;
                    let typeColorSwitch = gachaResult.type;
                    let typeColor = '';
                    let gachaType = '';
                    if (typeColorSwitch == 'cute') {
                        typeColor = '#FFB2F5';
                    } else if (typeColorSwitch == 'cool') {
                        typeColor = '#1266FF';
                    } else if (typeColorSwitch == 'passion') {
                        typeColor = '#FFBB00';
                    }
                    if (genTeiSwitch == 'tsujyou') {
                        gachaType = '통상 아이돌';
                    } else if (genTeiSwitch == 'gentei') {
                        gachaType = '한정 아이돌';
                    } else if (genTeiSwitch == 'cindeFest') {
                        gachaType = '페스 아이돌';
                    }
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(typeColor)
                        .setDescription(gachaType)
                        .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
                        //.setImage("") //하단 이미지
                        .setThumbnail(sign) //썸네일 이미지
                        .setTimestamp()
                        //.setURL("") //타이틀에 URL
                        .addField(upTitle,
                            upName)
                    //.addField("", "", true) //인라인필드
                    /*
                     * 빈 칸 만들어주는 필드
                     */
                    //.addBlankField(true)
                    //.addField("필드3", "필드 25개까지.", true);

                    message.channel.send({ embed });
                    } else if ('7' <= gacha && gacha <= '16') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha >= '17') {
                        message.channel.send(result_RARE[0]);
                        SR_COUNT++;
                    }
                }
            } else if (cindeFest == '0') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha <= '3') {
                        let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let genTeiSwitch = gachaResult.gacha_type;
                    let upTitle = gachaResult.title;
                    let upName = gachaResult.name;
                    let sign = gachaResult.sign;
                    let typeColorSwitch = gachaResult.type;
                    let typeColor = '';
                    let gachaType = '';
                    if (typeColorSwitch == 'cute') {
                        typeColor = '#FFB2F5';
                    } else if (typeColorSwitch == 'cool') {
                        typeColor = '#1266FF';
                    } else if (typeColorSwitch == 'passion') {
                        typeColor = '#FFBB00';
                    }
                    if (genTeiSwitch == 'tsujyou') {
                        gachaType = '통상 아이돌';
                    } else if (genTeiSwitch == 'gentei') {
                        gachaType = '한정 아이돌';
                    } else if (genTeiSwitch == 'cindeFest') {
                        gachaType = '페스 아이돌';
                    }
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(typeColor)
                        .setDescription(gachaType)
                        .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
                        //.setImage("") //하단 이미지
                        .setThumbnail(sign) //썸네일 이미지
                        .setTimestamp()
                        //.setURL("") //타이틀에 URL
                        .addField(upTitle,
                            upName)
                    //.addField("", "", true) //인라인필드
                    /*
                     * 빈 칸 만들어주는 필드
                     */
                    //.addBlankField(true)
                    //.addField("필드3", "필드 25개까지.", true);

                    message.channel.send({ embed });
                    } else if ('4' <= gacha && gacha <= '13') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha >= '14') {
                        message.channel.send(result_RARE[0]);
                        SR_COUNT++;
                    }
                }
            } else if (cindeFest == '2') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha <= '3') {
                        let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let genTeiSwitch = gachaResult.gacha_type;
                    let upTitle = gachaResult.title;
                    let upName = gachaResult.name;
                    let sign = gachaResult.sign;
                    let typeColorSwitch = gachaResult.type;
                    let typeColor = '';
                    let gachaType = '';
                    if (typeColorSwitch == 'cute') {
                        typeColor = '#FFB2F5';
                    } else if (typeColorSwitch == 'cool') {
                        typeColor = '#1266FF';
                    } else if (typeColorSwitch == 'passion') {
                        typeColor = '#FFBB00';
                    }
                    if (genTeiSwitch == 'tsujyou') {
                        gachaType = '통상 아이돌';
                    } else if (genTeiSwitch == 'gentei') {
                        gachaType = '한정 아이돌';
                    } else if (genTeiSwitch == 'cindeFest') {
                        gachaType = '페스 아이돌';
                    }
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(typeColor)
                        .setDescription(gachaType)
                        .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
                        //.setImage("") //하단 이미지
                        .setThumbnail(sign) //썸네일 이미지
                        .setTimestamp()
                        //.setURL("") //타이틀에 URL
                        .addField(upTitle,
                            upName)
                    //.addField("", "", true) //인라인필드
                    /*
                     * 빈 칸 만들어주는 필드
                     */
                    //.addBlankField(true)
                    //.addField("필드3", "필드 25개까지.", true);

                    message.channel.send({ embed });
                    } else if ('4' <= gacha && gacha <= '13') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha >= '14') {
                        message.channel.send(result_RARE[0]);
                        SR_COUNT++;
                    }
                }
            }
        } else if (skip == '1') { //생략 모드 실행 시
            SR_RESULT = 0;
            RARE_RESULT = 0;
            if (cindeFest == '1') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        SR_RESULT++;
                    } else if (gacha <= '6') {
                        let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let genTeiSwitch = gachaResult.gacha_type;
                    let upTitle = gachaResult.title;
                    let upName = gachaResult.name;
                    let sign = gachaResult.sign;
                    let typeColorSwitch = gachaResult.type;
                    let typeColor = '';
                    let gachaType = '';
                    if (typeColorSwitch == 'cute') {
                        typeColor = '#FFB2F5';
                    } else if (typeColorSwitch == 'cool') {
                        typeColor = '#1266FF';
                    } else if (typeColorSwitch == 'passion') {
                        typeColor = '#FFBB00';
                    }
                    if (genTeiSwitch == 'tsujyou') {
                        gachaType = '통상 아이돌';
                    } else if (genTeiSwitch == 'gentei') {
                        gachaType = '한정 아이돌';
                    } else if (genTeiSwitch == 'cindeFest') {
                        gachaType = '페스 아이돌';
                    }
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(typeColor)
                        .setDescription(gachaType)
                        .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
                        //.setImage("") //하단 이미지
                        .setThumbnail(sign) //썸네일 이미지
                        .setTimestamp()
                        //.setURL("") //타이틀에 URL
                        .addField(upTitle,
                            upName)
                    //.addField("", "", true) //인라인필드
                    /*
                     * 빈 칸 만들어주는 필드
                     */
                    //.addBlankField(true)
                    //.addField("필드3", "필드 25개까지.", true);

                    message.channel.send({ embed });
                    } else if ('7' <= gacha && gacha <= '16') {
                        SR_RESULT++;
                    } else if (gacha >= '17') {
                        RARE_RESULT++;
                        SR_COUNT++;
                    }
                } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                message.channel.send('획득한 SR : ' + SR_RESULT);
            } else if (cindeFest == '0') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        SR_RESULT++;
                    } else if (gacha <= '3') {
                        let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let genTeiSwitch = gachaResult.gacha_type;
                    let upTitle = gachaResult.title;
                    let upName = gachaResult.name;
                    let sign = gachaResult.sign;
                    let typeColorSwitch = gachaResult.type;
                    let typeColor = '';
                    let gachaType = '';
                    if (typeColorSwitch == 'cute') {
                        typeColor = '#FFB2F5';
                    } else if (typeColorSwitch == 'cool') {
                        typeColor = '#1266FF';
                    } else if (typeColorSwitch == 'passion') {
                        typeColor = '#FFBB00';
                    }
                    if (genTeiSwitch == 'tsujyou') {
                        gachaType = '통상 아이돌';
                    } else if (genTeiSwitch == 'gentei') {
                        gachaType = '한정 아이돌';
                    } else if (genTeiSwitch == 'cindeFest') {
                        gachaType = '페스 아이돌';
                    }
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(typeColor)
                        .setDescription(gachaType)
                        .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
                        //.setImage("") //하단 이미지
                        .setThumbnail(sign) //썸네일 이미지
                        .setTimestamp()
                        //.setURL("") //타이틀에 URL
                        .addField(upTitle,
                            upName)
                    //.addField("", "", true) //인라인필드
                    /*
                     * 빈 칸 만들어주는 필드
                     */
                    //.addBlankField(true)
                    //.addField("필드3", "필드 25개까지.", true);

                    message.channel.send({ embed });
                    } else if ('4' <= gacha && gacha <= '13') {
                        SR_RESULT++;
                    } else if (gacha >= '14') {
                        RARE_RESULT++;
                        SR_COUNT++;
                    }
                } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                message.channel.send('획득한 SR : ' + SR_RESULT);
            } else if (cindeFest == '2') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        SR_RESULT++;
                    } else if (gacha <= '3') {
                        let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let genTeiSwitch = gachaResult.gacha_type;
                    let upTitle = gachaResult.title;
                    let upName = gachaResult.name;
                    let sign = gachaResult.sign;
                    let typeColorSwitch = gachaResult.type;
                    let typeColor = '';
                    let gachaType = '';
                    if (typeColorSwitch == 'cute') {
                        typeColor = '#FFB2F5';
                    } else if (typeColorSwitch == 'cool') {
                        typeColor = '#1266FF';
                    } else if (typeColorSwitch == 'passion') {
                        typeColor = '#FFBB00';
                    }
                    if (genTeiSwitch == 'tsujyou') {
                        gachaType = '통상 아이돌';
                    } else if (genTeiSwitch == 'gentei') {
                        gachaType = '한정 아이돌';
                    } else if (genTeiSwitch == 'cindeFest') {
                        gachaType = '페스 아이돌';
                    }
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(typeColor)
                        .setDescription(gachaType)
                        .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
                        //.setImage("") //하단 이미지
                        .setThumbnail(sign) //썸네일 이미지
                        .setTimestamp()
                        //.setURL("") //타이틀에 URL
                        .addField(upTitle,
                            upName)
                    //.addField("", "", true) //인라인필드
                    /*
                     * 빈 칸 만들어주는 필드
                     */
                    //.addBlankField(true)
                    //.addField("필드3", "필드 25개까지.", true);

                    message.channel.send({ embed });
                    } else if ('4' <= gacha && gacha <= '13') {
                        SR_RESULT++;
                    } else if (gacha >= '14') {
                        RARE_RESULT++;
                        SR_COUNT++;
                    }
                } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                message.channel.send('획득한 SR : ' + SR_RESULT);
            }
        } else if (skip == '2') {
            message.channel.send('테스트 가챠입니다. 모든 아이돌이 출현하고 SSR확률이 6%로 고정됩니다.', { code: 'true' });
            SR_RESULT = 0;
            RARE_RESULT = 0;
            SR_COUNT = '0';
            let objectCount = Object.keys(data.ssr).length;
            for (let i = 0; i < 10; i++) {
                let gacha = Math.floor((Math.random() * 100) + 1);
                if (SR_COUNT == '9') {
                    SR_RESULT++;
                } else if (gacha <= '6') {
                    let gachaResult = data.ssr[objectCount - Math.floor((Math.random() * objectCount) + 1)];
                    let genTeiSwitch = gachaResult.gacha_type;
                    let upTitle = gachaResult.title;
                    let upName = gachaResult.name;
                    let sign = gachaResult.sign;
                    let typeColorSwitch = gachaResult.type;
                    let typeColor = '';
                    let gachaType = '';
                    if (typeColorSwitch == 'cute') {
                        typeColor = '#FFB2F5';
                    } else if (typeColorSwitch == 'cool') {
                        typeColor = '#1266FF';
                    } else if (typeColorSwitch == 'passion') {
                        typeColor = '#FFBB00';
                    }
                    if (genTeiSwitch == 'tsujyou') {
                        gachaType = '통상 아이돌';
                    } else if (genTeiSwitch == 'gentei') {
                        gachaType = '한정 아이돌';
                    } else if (genTeiSwitch == 'cindeFest') {
                        gachaType = '페스 아이돌';
                    }
                    const embed = new discord.RichEmbed()
                        .setTitle("SSR획득!")
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(typeColor)
                        .setDescription(gachaType)
                        .setFooter("명령어 입력 시간", client.user.avatarURL) //하단 아바타 이미지
                        //.setImage("") //하단 이미지
                        .setThumbnail(sign) //썸네일 이미지
                        .setTimestamp()
                        //.setURL("") //타이틀에 URL
                        .addField(upTitle,
                            upName)
                    //.addField("", "", true) //인라인필드
                    /*
                     * 빈 칸 만들어주는 필드
                     */
                    //.addBlankField(true)
                    //.addField("필드3", "필드 25개까지.", true);

                    message.channel.send({ embed });
                } else if ('7' <= gacha && gacha <= '16') {
                    SR_RESULT++;
                } else if (gacha >= '17') {
                    RARE_RESULT++;
                    SR_COUNT++;
                }
            } message.channel.send('획득한 RARE : ' + RARE_RESULT);
            message.channel.send('획득한 SR : ' + SR_RESULT);
        }
    }

    /* if (message.content.startsWith(prefix + '가챠')) {
        SR_COUNT = '0';
        let j = 0;
        if (skip == 0) { //비 생략모드
            if (cindeFest == '1') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha <= '6') {
                        message.channel.send(result_SSR[9 - j]);
                        j++;
                    } else if ('7' <= gacha && gacha <= '16') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha >= '17') {
                        message.channel.send(result_RARE[0]);
                        SR_COUNT++;
                    }
                }
            } else if (cindeFest == '0') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha <= '3') {
                        message.channel.send(result_SSR_tsujyou[9 - j]);
                        j++;
                    } else if ('4' <= gacha && gacha <= '13') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha >= '14') {
                        message.channel.send(result_RARE[0]);
                        SR_COUNT++;
                    }
                }
            } else if (cindeFest == '2') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha <= '3') {
                        message.channel.send(result_SSR_gentei[9 - j]);
                        j++;
                    } else if ('4' <= gacha && gacha <= '13') {
                        message.channel.send(result_SR[0]);
                    } else if (gacha >= '14') {
                        message.channel.send(result_RARE[0]);
                        SR_COUNT++;
                    }
                }
            }
        } else if (skip == '1') { //생략 모드 실행 시
            SR_RESULT = 0;
            RARE_RESULT = 0;
            if (cindeFest == '1') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        SR_RESULT++;
                    } else if (gacha <= '6') {
                        message.channel.send(result_SSR[9 - j]);
                        j++;
                    } else if ('7' <= gacha && gacha <= '16') {
                        SR_RESULT++;
                    } else if (gacha >= '17') {
                        RARE_RESULT++;
                        SR_COUNT++;
                    }
                } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                message.channel.send('획득한 SR : ' + SR_RESULT);
            } else if (cindeFest == '0') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        SR_RESULT++;
                    } else if (gacha <= '3') {
                        message.channel.send(result_SSR_tsujyou[9 - j]);
                        j++;
                    } else if ('4' <= gacha && gacha <= '13') {
                        SR_RESULT++;
                    } else if (gacha >= '14') {
                        RARE_RESULT++;
                        SR_COUNT++;
                    }
                } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                message.channel.send('획득한 SR : ' + SR_RESULT);
            } else if (cindeFest == '2') {
                for (let i = 0; i < 10; i++) {
                    let gacha = Math.floor((Math.random() * 100) + 1);
                    if (SR_COUNT == '9') {
                        SR_RESULT++;
                    } else if (gacha <= '3') {
                        message.channel.send(result_SSR_gentei[9 - j]);
                        j++;
                    } else if ('4' <= gacha && gacha <= '13') {
                        SR_RESULT++;
                    } else if (gacha >= '14') {
                        RARE_RESULT++;
                        SR_COUNT++;
                    }
                } message.channel.send('획득한 RARE : ' + RARE_RESULT);
                message.channel.send('획득한 SR : ' + SR_RESULT);
            }
        }
    } */

    if (message.content.startsWith(prefix + '범죄계수')) {
        let Sibyl_System = Math.floor((Math.random() * 999));
        if (Sibyl_System < '100') {
            message.reply('*범죄계수*' + Sibyl_System + ', *트리거를 락 합니다*');
        } else if (Sibyl_System >= '300') {
            let Sibyl_low = Math.floor((Math.random() * 3) + 1); // 300이상이 나올 확률이 압도적으로 높으므로 줄여주는 코드들.
            if (Sibyl_low == 1) {
                message.reply('*범죄계수*' + Sibyl_System);
                message.reply('*범죄계수 오버 300, 신중하게 조준하여, 대상을 배제하십시오.*');
            } else if (Sibyl_low == 2) {
                let Sibyl_reTry_hight = Math.floor((Math.random() * 300));
                if (Sibyl_reTry_hight < '100') {
                    message.reply('*범죄계수*' + Sibyl_reTry_hight + ', *트리거를 락 합니다*');
                } else if (Sibyl_reTry_hight >= '100') {
                    message.reply('*범죄계수* ' + Sibyl_reTry_hight + ',*신중하게 조준하여 대상을 제압해주십시오.*');
                } else if (Sibyl_reTry_hight == 300) {
                    message.reply('*범죄계수*' + Sibyl_reTry_hight);
                    message.reply('*범죄계수 오버 300, 신중하게 조준하여, 대상을 배제하십시오.*');
                }
            } else if (Sibyl_low == 3) {
                let Sibyl_reTry_low = Math.floor((Math.random() * 100));
                if (Sibyl_reTry_low < '100') {
                    message.reply('*범죄계수*' + Sibyl_reTry_low + ', *트리거를 락 합니다*');
                } else if (Sibyl_reTry_low == '100') {
                    message.reply('*범죄계수* ' + Sibyl_reTry_low + ',*신중하게 조준하여 대상을 제압해주십시오.*');
                }
            }
        } else if (Sibyl_System >= '100') {
            message.reply('*범죄계수* ' + Sibyl_System + ',*신중하게 조준하여 대상을 제압해주십시오.*');
        }
    }
    
    if (message.content.startsWith(prefix + '야'+' ')) {
        if (JK == '1') {
            message.channel.send(result2[0]);
        } else if (JK == '0') {
            message.channel.send(result[0]);
        }
    }

    if (message.content.startsWith(prefix + '범수')) {
        if (JK == '1') {
            message.channel.send('하와와 가수 김범수 너무 멋진거예요');
        } else if (JK == '0') {
            message.channel.send('개수작 부리지 마세요');
        }
    }

    /* if (message.content.startsWith(prefix + '모드')) {
        let cindeFestMod = '';
        let skipMod = '';
        if (cindeFest == '1') {
            cindeFestMod = '신데페스 모드가 적용되어있어요.'
        } else if (cindeFest == '0') {
            cindeFestMod = '통상모드가 적용되어있어요.'
        } else if (cindeFest == '2') {
            cindeFestMod = '한정가챠 모드가 적용되어있어요.'
        }
        if (skip == '1') {
            skipMod = 'SSR을 제외한 카드는 결과로만 알려줘요.'
        } else if (skip == '0') {
            skipMod = '모든 카드들을 읊어드려요.'
        }
        if (JK == '1') {
            message.channel.send('현재 여고생모드는 ' + '> *__On__*' + ' 인거예요');
            message.channel.send('현재 가챠에는 ' + cindeFestMod);
            message.channel.send('현재 가챠 시 ' + skipMod);
        } else if (JK == '0') {
            message.channel.send('현재 여고생모드는 ' + '> *__Off__*' + ' 입니다.');
            message.channel.send('현재 가챠에는 ' + cindeFestMod);
            message.channel.send('현재 가챠 시 ' + skipMod);
        }
    } */

    if (message.content.startsWith(prefix + '모드')) {
        let cindeFestMod = '';
        let skipMod = '';
        let JKMod = '';
        if (cindeFest == '1') {
            cindeFestMod = '신데페스 모드가 적용되어있어요.';
        } else if (cindeFest == '0') {
            cindeFestMod = '통상모드가 적용되어있어요.';
        } else if (cindeFest == '2') {
            cindeFestMod = '한정가챠 모드가 적용되어있어요.';
        }
        if (skip == '1') {
            skipMod = 'SSR을 제외한 카드는 결과로만 알려줘요.';
        } else if (skip == '0') {
            skipMod = '모든 카드들을 읊어드려요.';
        } else if (skip == '2'){
            skipMod = '테스트 가챠 결과를 읊어드려요';
        }
        if (JK == '1') {
            JKMod = '적용되어 있는 거예요';
        } else if (JK == '0') {
            JKMod = '해제되어 있어요.';
        }
        message.channel.send({
            embed: {
                color: 3447003,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                title: '적용 모드',
                description: '현재 적용되어 있는 모드들입니다.',
                fields: [{
                    name: '여고생모드',
                    value: '현재 여고생모드가 ' + JKMod
                },
                {
                    name: '가챠 모드',
                    value: '현재 가챠에는 ' + cindeFestMod
                },
                {
                    name: '생략/비생략',
                    value: '현재 가챠 시 ' + skipMod
                }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: '명령어 입력 시간 '
                }
            }
        });
    }

    if (message.content.startsWith(prefix + '원주율')) {
        if (pie == '3.14') {
            message.channel.send('자, 한 번만 말씀드릴게요.');
            message.channel.send('pi = 3.1415926535 8979323846 2643383279 5028841971 6939937510 5820974944 5923078164 0628620899 8628034825 3421170679 8214808651 3282306647 0938446095 5058223172 5359408128 4811174502 8410270193 8521105559 6446229489 5493038196 4428810975 6659334461 2847564823 3786783165 2712019091 4564856692 3460348610 4543266482 1339360726 0249141273 7245870066 0631558817 4881520920 9628292540 9171536436 7892590360 0113305305 4882046652 1384146951 9415116094 3305727036 5759591953 0921861173 8193261179 3105118548 0744623799 6274956735 1885752724 8912279381 8301194912 9833673362 4406566430 8602139494 6395224737 1907021798 6094370277 0539217176 2931767523 8467481846 7669405132 0005681271 4526356082 7785771342 7577896091 7363717872 1468440901 2249534301 4654958537 1050792279 6892589235 4201995611 2129021960 8640344181 5981362977 4771309960 5187072113 4999999837 2978049951 0597317328 1609631859 5024459455 3469083026 4252230825 3344685035 2619311881 7101000313 7838752886 5875332083 8142061717 7669147303 5982534904 2875546873 1159562863 8823537875 9375195778 1857780532 1712268066 1300192787 6611195909 2164201989 ');
            pie = '6.28';
        } else if (pie == '6.28'); {
            message.channel.send('저는 한 번만 말씀드린다고 했어요.');
            message.channel.send('이제 재부팅 전에는 말씀 안 해드릴거에요.');
        }
    }


    if (message.content.startsWith(prefix + '여고생모드')) {
        if (JK == '0') {
            //message.channel.send('여고생 모드를 켤게요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '여고생 모드를 켤게요.'
            }});
            JK = '1';
        } else if (JK == '1'); {
            //message.channel.send('현재 상태 : 여고생 모드 on 인거예요');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 여고생 모드 on 인거예요.'
            }});
        }
    }
    
    if (message.content.startsWith(config.prefix + '테스트모드')) {
        if (skip == '0' || skip == '1') {
            //message.channel.send('테스트 모드를 켤게요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '테스트 모드를 켤게요.'
            }});
            skip = '2';
        } else if (skip == '2'); {
            //message.channel.send('현재 상태 : 여고생 모드 on 인거예요');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 테스트 모드가 적용되었어요.'
            }});
        }
    }

    if (message.content.startsWith(config.prefix + '테스트해제')) {
        if (skip == '2') {
            //message.channel.send('테스트 모드를 켤게요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '테스트 모드를 해제할게요.'
            }});
            skip = '1';
        } else if (skip == '1'); {
            //message.channel.send('현재 상태 : 여고생 모드 on 인거예요');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 테스트 모드가 해제되었어요.'
            }});
        }
    }

    if (message.content.startsWith(prefix + '페스')) {
        if (cindeFest == '0' || cindeFest == '2') {
            message.channel.send({embed: {
                color: 3447003,
                description: '신데렐라 페스 모드를 적용할게요.'
            }});
            //message.channel.send('신데렐라 페스 모드를 적용할게요.');
            cindeFest = '1';
        } else if (cindeFest == '1'); {
            //message.channel.send('현재 상태 : 신데렐라 페스 확률과 페스돌이 적용되었어요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 신데렐라 페스 확률과 페스돌이 적용되었어요.'
            }});
        }
    }

    if (message.content.startsWith(prefix + '생략')) {
        if (skip == '0') {
            //message.channel.send('가챠시 SSR 외의 카드들은 결과로만 알려드릴게요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '가챠시 SSR 외의 카드들은 결과로만 알려드릴게요.'
            }});
            skip = '1';
        } else if (skip == '1'); {
            // message.channel.send('현재 상태 : 생략 모드가 적용되었어요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 생략 모드가 적용되었어요.'
            }});
        }
    }


    if (message.content.startsWith(prefix + '해제')) {
        if (JK == '1') {
            //message.channel.send('여고생 모드를 해제할게요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '여고생 모드를 해제할게요.'
            }});
            JK = '0';
        } else if (JK == '0'); {
            //message.channel.send('현재 상태 : 여고생 모드 off에요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 여고생 모드 off에요.'
            }});
        }
    }

    if (message.content.startsWith(prefix + '전부')) {
        if (skip == '1') {
            //message.channel.send('가챠시 SSR 외의 카드들도 알려드릴게요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '가챠시 SSR 외의 카드들도 알려드릴게요.'
            }});
            skip = '0';
        } else if (skip == '0'); {
            //message.channel.send('현재 상태 : 생략 모드가 해제되었어요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 생략 모드가 해제되었어요.'
            }});
        }
    }

    if (message.content.startsWith(prefix + '한정')) {
        if (cindeFest == '0' || cindeFest == '1') {
            //message.channel.send('한정가챠 모드를 적용할게요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '한정가챠 모드를 적용할게요.'
            }});
            cindeFest = '2';
        } else if (cindeFest == '2'); {
            //message.channel.send('현재 상태 : 한정가챠 모드가 적용되었어요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 한정가챠 모드가 적용되었어요.'
            }});
        }
    }

    if (message.content.startsWith(prefix + '통상')) {
        if (cindeFest == '1' || cindeFest == '2') {
            //message.channel.send('신데렐라 페스 모드/한정가챠 모드를 해제할게요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '신데렐라 페스 모드/한정가챠 모드를 해제할게요.'
            }});
            cindeFest = '0';
        } else if (cindeFest == '0'); {
            //message.channel.send('현재 상태 : 신데렐라 페스 확률과 페스돌/한정돌이 롤백되어있어요.');
            message.channel.send({embed: {
                color: 3447003,
                description: '현재 상태 : 신데렐라 페스 확률과 페스돌/한정돌이 롤백되어있어요.'
            }});
        }
    }

    if (message.content.startsWith(prefix + '업다운')) {
        let flag = Math.floor((Math.random() * 50) + 1);
        message.channel.send('현재 개발중...');
    }

    if (message.content.startsWith(prefix + '이벤트')) {
        // 디데이 설정
        var d_day = new Date(2018, 3, 23);

        // 오늘날짜 설정
        var t_day = new Date();
        console.log(d_day);
        console.log(t_day);

        message.channel.send('이벤트까지 남은 시간은 ' + d_day - t_day + '입니다.'); //몰라 언젠간 완료하겠지
    }

    if (message.content === '.아바타') {
        message.reply(message.author.avatarURL);
    }
    if (message.content === '나는') {
        message.channel.send('파리의 택시운전사');
    }
    if (message.content === '.채널아이디') {
        if (JK == '1') {
            message.channel.send('현재 속해있는 채널의 아이디는 : ' + message.channel.id + '인거예요.');
        } else if (JK == '0') {
            message.channel.send('현재 속해있는 채널의 아이디는 : ' + message.channel.id + '입니다.');
        }
    }
    if (message.content.startsWith(prefix + '흥흥흥흥~')) {
        message.channel.send('프레데리카~');
    }
    if (message.content === '.아이디') {
        if (JK == '1') {
            message.channel.send('당신의 아이디는 : ' + message.author.id + '인거예요.');
        } else if (JK == '0') {
            message.channel.send('당신의 아이디는 : ' + message.author.id + '입니다.');
        }
    }
    if (message.content === '.이름') {
        if (JK == '0') {
            message.channel.send('당신의 이름은 ' + message.author.username + ' 입니다.');
        } else if (JK == '1') {
            message.channel.send('하와와 당신의 이름은 ' + message.author.username + ' 인거예요.');
        }
    }
    if (message.content === '.계정정보') {
        message.channel.send('계정 생성 시간 : ' + message.author.createdTimestamp + '\n' + '가입시 입력 한 이름 : ' + message.author.username + '\n' + '현재 계정 상태 : ' + message.author.presence.status + '\n' + '계정 tag : ' + message.author.tag, { code: 'true' });
    }

    if (message.content === '.이과') {
        if (JK == '1') {
            message.channel.send('하와와 이과충은 죽는 것 이예요');
        } else if (JK == '0') {
            message.channel.send('이과충 죽어');
        }
    }
    if (message.content === '.성덕') {
        if (JK == '0') {
            message.channel.send('세상말종쓰레기자식 죽어');
        } else if (JK == '1') {
            message.channel.send('세상말종쓰레기자식 죽는 거예요 하와와')
        }
    }
    if (message.content === '.플레이리스트') {
        message.channel.send('.pl https://www.youtube.com/playlist?list=PLj-mFP8wSkPmZwhVRwru2Ej9wlv_30zx2');
    }
    if (message.content === '.니시무라함대' || message.content === '.니시무라 함대' || message.content === '.니시무라') {
        message.channel.send('전함 : 후소, 야마시로' + '\n' + '중순양함 : 모가미' + '\n' + '구축함 : 시구레, 미치시오, 아사구모, 야마구모');
    }
    if (message.content === '.우군함머') {
        message.channel.send('니시무라 함대 : 후소改2, 야마시로改2, 모가미, 야마구모, 아사구모, 미치시오改2, 시구레改2' + '\n' + '\n' +
            '정신함대 : 히에이改2, 키리시마改2, 유우다치改2, 하루사메, 유키카제, 아마츠카제' + '\n' + '\n' +
            '영국함대 : 워스파이트, 아크로열, 적.함.발.견, 저비스' + '\n' + '\n' +
            '제4함대 : 타카오, 아타고, 쵸카이改2, 마야改2' + '\n' + '\n' +
            '제19구축대 : 아야나미改2, 시키나미, 우라나미, 이소나미', { code: 'true' });
    }
    if (message.content === '.우군함대') {
        message.channel.send('니시무라 함대 : 후소改2, 야마시로改2, 모가미, 야마구모, 아사구모, 미치시오改2, 시구레改2' + '\n' + '\n' +
            '정신함대 : 히에이改2, 키리시마改2, 유우다치改2, 하루사메, 유키카제, 아마츠카제' + '\n' + '\n' +
            '영국함대 : 워스파이트, 아크로열, 적.함.발.견, 저비스' + '\n' + '\n' +
            '제4함대 : 타카오, 아타고, 쵸카이改2, 마야改2' + '\n' + '\n' +
            '제19구축대 : 아야나미改2, 시키나미, 우라나미, 이소나미');
    }
    if (!message.guild) return;

    if (message.content === '.이리와' || message.content === '.들어와') {
        if (inChannel == '0') {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join()
                    .then(connection => {
                        message.channel.send('들어왔어요!');
                        //connection.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/c/c4/Mutsuki-Introduction.ogg/revision/latest?cb=20150216193917');
                        connection.playArbitraryInput('https://truecolor.kirara.ca/va2/134f5710462116ab.mp3')
                        message.reply(message.author.tag + ' 님의 명령어로 들어왔어요.');
                        inChannel = '1';
                    })
                    .catch(console.log);
            } else {
                message.channel.send('먼저 들어가시고 말씀하시죠.');
            }
        } else if (inChannel == '1') {
            message.channel.send('이미 들어와있는데요?');
        }
    }
    if (message.content === '.나가') {
        if (message.member.voiceChannel) {
            //message.member.voiceChannel.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/3/37/Shimushu-Minor_Damage_2.ogg/revision/latest?cb=20170502222723');
            message.member.voiceChannel.leave();
            message.channel.send('네 나갈게요...');
            inChannel = '0';
        } else {
            message.channel.send('어디 있지도 않은데 무슨 소리세요');
        }
    }
    if (message.content === '.나갔다들어와') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave();
            message.channel.send('네 나갈게요...');
            inChannel = '0';
            message.member.voiceChannel.join()
                .then(connection => {
                    message.channel.send('들어왔어요!');
                    connection.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/c/c4/Mutsuki-Introduction.ogg/revision/latest?cb=20150216193917');
                    message.reply(message.author.tag + ' 님의 명령어로 들어왔어요.');
                    inChannel = '1';
                })
        }
    }
    if (message.content === '.시무슈') {
        if (message.member.voiceChannel) {
            if (inChannel == '1') {
                message.member.voiceChannel.join()
                    .then(connection => {
                        connection.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/3/37/Shimushu-Minor_Damage_2.ogg/revision/latest?cb=20170502222723');
                    })
            } else if (inChannel == '0') {
                message.channel.send('음성채널 안에 있을 때만 들으실 수 있어요.');
            }
        }
    }

    if (message.content.startsWith(config.prefix + '무츠키')) {
        if (message.member.voiceChannel) {
            if (inChannel == '1') {
                message.member.voiceChannel.join()
                    .then(connection => {
                        connection.playArbitraryInput('https://vignette.wikia.nocookie.net/kancolle/images/c/c4/Mutsuki-Introduction.ogg/revision/latest?cb=20150216193917');
                    })
            } else if (inChannel == '0') {
                message.channel.send('음성채널 안에 있을 때만 들으실 수 있어요.');
            }
        }
    }
    if (message.content === '.꺼져') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave()
            message.channel.send('다른 분들께는 말조심 하시는게 좋을거에요.');
        } else {
            message.channel.send('그건 밖에 있어도 기분나쁘네요.');
        }
    }
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`환영합니다!, ${member}`);
});



/* client.on('MessageEmbedImage',MessageEmbedImage => {
    if (MessageEmbedImage.content === '.이미지') {
        MessageEmbedImage.channel.send(MessageEmbedImage.url='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Korail_logo.svg/425px-Korail_logo.svg.png');
    } 
}); */

//client.uptime()

client.login(config.token);
