const config = require('../../config.json');
const ssrData = require('../../data/ssr_data.json');
const prefix = config.prefix;
let SR_RESULT = 0;
let RARE_RESULT = 0;
let SR_COUNT = '0'; //10연챠시 SR확정 구현을 위한 카운트
let cindeFest = '0'; //페스모드 활성화 스위치
let skip = '0'; //통한의 스킵! 생략 모드의 스위치.

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


module.exports = (client) => {
    client.on('message', message => {
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

        if (message.content.startsWith(prefix + '가챠')) {
            SR_COUNT = '0';
            let j = 0;
            if (skip == 0) { //비 생략모드
                if (cindeFest == '1') {
                    let objectCount = Object.keys(data.ssr_cindeFest).length;
                    for (let i = 0; i < 10; i++) {
                        let gacha = Math.floor((Math.random() * 100) + 1);
                        if (SR_COUNT == '9') {
                            message.channel.send(result_SR[0]);
                        } else if (gacha <= '6') {
                            let gachaResult = data.ssr_cindeFest[objectCount - Math.floor((Math.random() * objectCount) + 1)];
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
                    let objectCount = Object.keys(data.ssr_tsujyou).length;
                    for (let i = 0; i < 10; i++) {
                        let gacha = Math.floor((Math.random() * 100) + 1);
                        if (SR_COUNT == '9') {
                            message.channel.send(result_SR[0]);
                        } else if (gacha <= '3') {
                            let gachaResult = data.ssr_tsujyou[objectCount - Math.floor((Math.random() * objectCount) + 1)];
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
                    let objectCount = Object.keys(data.ssr_gentei).length;
                    for (let i = 0; i < 10; i++) {
                        let gacha = Math.floor((Math.random() * 100) + 1);
                        if (SR_COUNT == '9') {
                            message.channel.send(result_SR[0]);
                        } else if (gacha <= '3') {
                            let gachaResult = data.ssr_gentei[objectCount - Math.floor((Math.random() * objectCount) + 1)];
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
                    let objectCount = Object.keys(data.ssr_cindeFest).length;
                    for (let i = 0; i < 10; i++) {
                        let gacha = Math.floor((Math.random() * 100) + 1);
                        if (SR_COUNT == '9') {
                            SR_RESULT++;
                        } else if (gacha <= '6') {
                            let gachaResult = data.ssr_cindeFest[objectCount - Math.floor((Math.random() * objectCount) + 1)];
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
                    let objectCount = Object.keys(data.ssr_tsujyou).length;
                    for (let i = 0; i < 10; i++) {
                        let gacha = Math.floor((Math.random() * 100) + 1);
                        if (SR_COUNT == '9') {
                            SR_RESULT++;
                        } else if (gacha <= '3') {
                            let gachaResult = data.ssr_tsujyou[objectCount - Math.floor((Math.random() * objectCount) + 1)];
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
                    let objectCount = Object.keys(data.ssr_gentei).length;
                    for (let i = 0; i < 10; i++) {
                        let gacha = Math.floor((Math.random() * 100) + 1);
                        if (SR_COUNT == '9') {
                            SR_RESULT++;
                        } else if (gacha <= '3') {
                            let gachaResult = data.ssr_gentei[objectCount - Math.floor((Math.random() * objectCount) + 1)];
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


    });
};