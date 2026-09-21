/*
 * Generates static landing pages under /areas/:
 *  - 1 hub page listing all 16 regions
 *  - 16 region pages x 12 grades (초1~고3) = 192 region pages
 *  - ~230 district pages x 12 grades = ~2750 district pages
 * Also (re)writes sitemap-areas.xml with every URL from this run.
 * Re-run this script (`node scripts/generate-areas.js`) whenever region/
 * grade copy needs to change - do not hand-edit the generated files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const AREAS_DIR = path.join(ROOT, 'areas');
const SITE = 'https://privatelesson.co.kr';

const REGIONS = [
  { name: '서울특별시', districts: ['종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구'] },
  { name: '부산광역시', districts: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '강서구', '해운대구', '사하구', '금정구', '연제구', '수영구', '사상구', '기장군(기장읍 · 장안읍 · 정관읍 · 일광읍 · 철마면)'] },
  { name: '대구광역시', districts: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군(화원읍 · 논공읍 · 다사읍 · 유가읍 · 옥포읍 · 현풍읍 · 가창면 · 하빈면 · 구지면)', '군위군(군위읍 · 소보면 · 효령면 · 부계면 · 우보면 · 의흥면 · 산성면 · 삼국유사면)'] },
  { name: '인천광역시', districts: ['미추홀구', '연수구', '남동구', '부평구', '계양구', '제물포구', '영종구', '서해구', '검단구', '강화군(강화읍 · 선원면 · 불은면 · 길상면 · 화도면 · 양도면 · 내가면 · 하점면 · 양사면 · 송해면 · 교동면 · 삼산면 · 서도면)', '옹진군(백령면 · 대청면 · 연평면 · 자월면 · 덕적면 · 영흥면 · 북도면)'] },
  { name: '대전광역시', districts: ['동구', '중구', '서구', '유성구', '대덕구'] },
  { name: '울산광역시', districts: ['중구', '남구', '동구', '북구', '울주군(언양읍 · 온산읍 · 온양읍 · 범서읍 · 청량읍 · 삼남읍 · 서생면 · 웅촌면 · 두동면 · 두서면 · 상북면 · 삼동면)'] },
  { name: '세종특별자치시', districts: [] },
  { name: '전남광주통합특별시', districts: ['동구', '서구', '남구', '북구', '광산구', '목포시', '여수시(돌산읍)', '순천시(승주읍)', '나주시(남평읍)', '광양시(광양읍)', '담양군(담양읍 · 봉산면 · 고서면 · 가사문학면 · 창평면 · 대덕면 · 무정면 · 금성면 · 용면 · 월산면 · 수북면 · 대전면)', '곡성군(곡성읍 · 오곡면 · 삼기면 · 석곡면 · 목사동면 · 죽곡면 · 고달면 · 옥과면 · 입면 · 겸면 · 오산면)', '구례군(구례읍 · 문척면 · 간전면 · 토지면 · 마산면 · 광의면 · 용방면 · 산동면)', '고흥군(고흥읍 · 도양읍 · 풍양면 · 도덕면 · 금산면 · 도화면 · 포두면 · 봉래면 · 동일면 · 점암면 · 영남면 · 과역면 · 남양면 · 동강면 · 대서면 · 두원면)', '보성군(보성읍 · 벌교읍 · 노동면 · 미력면 · 겸백면 · 율어면 · 복내면 · 문덕면 · 조성면 · 득량면 · 회천면 · 웅치면)', '화순군(화순읍 · 한천면 · 춘양면 · 청풍면 · 이양면 · 능주면 · 도곡면 · 도암면 · 이서면 · 백아면 · 동복면 · 사평면 · 동면)', '장흥군(장흥읍 · 관산읍 · 대덕읍 · 용산면 · 안양면 · 장동면 · 장평면 · 유치면 · 부산면 · 회진면)', '강진군(강진읍 · 군동면 · 칠량면 · 대구면 · 도암면 · 신전면 · 성전면 · 작천면 · 병영면 · 마량면 · 옴천면)', '해남군(해남읍 · 삼산면 · 화산면 · 현산면 · 송지면 · 북평면 · 북일면 · 옥천면 · 계곡면 · 마산면 · 황산면 · 산이면 · 문내면 · 화원면)', '영암군(영암읍 · 삼호읍 · 덕진면 · 금정면 · 신북면 · 시종면 · 도포면 · 군서면 · 서호면 · 학산면 · 미암면)', '무안군(무안읍 · 일로읍 · 삼향읍 · 망운면 · 몽탄면 · 운남면 · 청계면 · 해제면 · 현경면)', '함평군(함평읍 · 나산면 · 대동면 · 손불면 · 신광면 · 엄다면 · 월야면 · 학교면 · 해보면)', '영광군(영광읍 · 백수읍 · 홍농읍 · 법성면 · 대마면 · 묘량면 · 불갑면 · 군서면 · 군남면 · 염산면 · 낙월면)', '장성군(장성읍 · 진원면 · 남면 · 동화면 · 삼서면 · 삼계면 · 황룡면 · 서삼면 · 북이면 · 북일면 · 북하면)', '완도군(완도읍 · 금일읍 · 노화읍 · 군외면 · 신지면 · 고금면 · 약산면 · 청산면 · 소안면 · 금당면 · 보길면 · 생일면)', '진도군(진도읍 · 고군면 · 군내면 · 의신면 · 임회면 · 지산면 · 조도면)', '신안군(압해읍 · 지도읍 · 증도면 · 임자면 · 자은면 · 비금면 · 도초면 · 흑산면 · 하의면 · 신의면 · 장산면 · 안좌면 · 팔금면 · 암태면)'] },
  { name: '경기도', districts: ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시(팽성읍 · 안중읍 · 포승읍 · 청북읍)', '안산시', '고양시', '구리시', '남양주시(와부읍 · 진접읍 · 화도읍 · 진건읍 · 오남읍 · 퇴계원읍)', '오산시', '시흥시', '군포시', '과천시', '의왕시', '하남시', '용인시(포곡읍 · 모현읍 · 이동읍)', '파주시(문산읍 · 파주읍 · 법원읍 · 조리읍)', '이천시(장호원읍 · 부발읍)', '안성시(공도읍)', '김포시(고촌읍 · 양촌읍 · 통진읍)', '화성시(봉담읍 · 향남읍 · 남양읍 · 우정읍)', '광주시(곤지암읍 · 오포읍)', '동두천시', '양주시(백석읍)', '포천시(소흘읍)', '여주시(가남읍)', '양평군(양평읍 · 강상면 · 강하면 · 양서면 · 옥천면 · 서종면 · 단월면 · 청운면 · 양동면 · 지평면 · 용문면 · 개군면)', '가평군(가평읍 · 설악면 · 청평면 · 상면 · 조종면 · 북면)', '연천군(연천읍 · 전곡읍 · 군남면 · 청산면 · 백학면 · 미산면 · 왕징면 · 신서면 · 중면 · 장남면)'] },
  { name: '강원특별자치도', districts: ['춘천시(신북읍)', '원주시(문막읍)', '강릉시(주문진읍)', '동해시', '태백시', '속초시', '삼척시(도계읍 · 원덕읍)', '홍천군(홍천읍 · 화촌면 · 두촌면 · 내촌면 · 서석면 · 영귀미면 · 남면 · 서면 · 북방면 · 내면)', '횡성군(횡성읍 · 우천면 · 안흥면 · 둔내면 · 갑천면 · 청일면 · 공근면 · 서원면 · 강림면)', '영월군(영월읍 · 상동읍 · 산솔면 · 김삿갓면 · 북면 · 남면 · 한반도면 · 주천면 · 무릉도원면)', '평창군(평창읍 · 미탄면 · 방림면 · 대화면 · 봉평면 · 용평면 · 진부면 · 대관령면)', '정선군(정선읍 · 고한읍 · 사북읍 · 신동읍 · 남면 · 북평면 · 임계면 · 화암면 · 여량면)', '철원군(철원읍 · 김화읍 · 갈말읍 · 동송읍 · 서면 · 근남면 · 근북면 · 근동면 · 원남면 · 원동면 · 임남면)', '화천군(화천읍 · 간동면 · 하남면 · 상서면 · 사내면)', '양구군(양구읍 · 국토정중앙면 · 동면 · 방산면 · 해안면)', '인제군(인제읍 · 남면 · 북면 · 기린면 · 서화면 · 상남면)', '고성군(간성읍 · 거진읍 · 토성면 · 죽왕면 · 수동면 · 현내면)', '양양군(양양읍 · 서면 · 손양면 · 현북면 · 현남면 · 강현면)'] },
  { name: '충청북도', districts: ['청주시(오송읍 · 오창읍 · 내수읍)', '충주시(주덕읍)', '제천시(봉양읍)', '보은군(보은읍 · 속리산면 · 장안면 · 마로면 · 탄부면 · 삼승면 · 수한면 · 회남면 · 회인면 · 내북면 · 산외면)', '옥천군(옥천읍 · 동이면 · 안남면 · 안내면 · 청성면 · 청산면 · 이원면 · 군서면 · 군북면)', '영동군(영동읍 · 용산면 · 황간면 · 추풍령면 · 매곡면 · 상촌면 · 양강면 · 용화면 · 학산면 · 양산면 · 심천면)', '증평군(증평읍 · 도안면)', '진천군(진천읍 · 덕산읍 · 초평면 · 문백면 · 백곡면 · 이월면 · 광혜원면)', '괴산군(괴산읍 · 감물면 · 장연면 · 연풍면 · 칠성면 · 문광면 · 청천면 · 청안면 · 사리면 · 소수면 · 불정면)', '음성군(음성읍 · 금왕읍 · 대소읍 · 소이면 · 원남면 · 맹동면 · 삼성면 · 생극면 · 감곡면)', '단양군(단양읍 · 매포읍 · 단성면 · 대강면 · 가곡면 · 영춘면 · 어상천면 · 적성면)'] },
  { name: '충청남도', districts: ['천안시(목천읍 · 성환읍 · 성거읍 · 직산읍)', '공주시(유구읍)', '보령시(웅천읍)', '아산시(배방읍 · 염치읍)', '서산시(대산읍)', '논산시(강경읍 · 연무읍)', '계룡시', '당진시(합덕읍 · 송악읍)', '금산군(금산읍 · 금성면 · 제원면 · 부리면 · 군북면 · 남일면 · 남이면 · 진산면 · 복수면 · 추부면)', '부여군(부여읍 · 규암면 · 은산면 · 외산면 · 내산면 · 구룡면 · 홍산면 · 옥산면 · 남면 · 충화면 · 양화면 · 임천면 · 장암면 · 세도면 · 석성면 · 초촌면)', '서천군(서천읍 · 장항읍 · 마서면 · 화양면 · 기산면 · 한산면 · 마산면 · 시초면 · 문산면 · 판교면 · 종천면 · 비인면 · 서면)', '청양군(청양읍 · 운곡면 · 대치면 · 정산면 · 목면 · 청남면 · 장평면 · 남양면 · 화성면 · 비봉면)', '홍성군(홍성읍 · 광천읍 · 홍북읍 · 금마면 · 홍동면 · 장곡면 · 은하면 · 결성면 · 서부면 · 갈산면 · 구항면)', '예산군(예산읍 · 삽교읍 · 대술면 · 신양면 · 광시면 · 대흥면 · 응봉면 · 덕산면 · 봉산면 · 고덕면 · 신암면 · 오가면)', '태안군(태안읍 · 안면읍 · 고남면 · 남면 · 근흥면 · 소원면 · 원북면 · 이원면)'] },
  { name: '전북특별자치도', districts: ['전주시', '익산시(함열읍)', '군산시(옥구읍)', '정읍시(신태인읍)', '남원시(운봉읍)', '김제시(만경읍)', '완주군(봉동읍 · 삼례읍 · 용진읍 · 경천면 · 고산면 · 구이면 · 동상면 · 비봉면 · 상관면 · 소양면 · 운주면 · 이서면 · 화산면)', '진안군(진안읍 · 용담면 · 안천면 · 동향면 · 상전면 · 백운면 · 성수면 · 마령면 · 부귀면 · 정천면 · 주천면)', '무주군(무주읍 · 무풍면 · 설천면 · 적상면 · 안성면 · 부남면)', '장수군(장수읍 · 산서면 · 번암면 · 장계면 · 천천면 · 계남면 · 계북면)', '임실군(임실읍 · 청웅면 · 운암면 · 신평면 · 성수면 · 오수면 · 신덕면 · 삼계면 · 관촌면 · 강진면 · 덕치면 · 지사면)', '순창군(순창읍 · 인계면 · 동계면 · 적성면 · 유등면 · 풍산면 · 금과면 · 팔덕면 · 복흥면 · 쌍치면 · 구림면)', '고창군(고창읍 · 고수면 · 아산면 · 무장면 · 공음면 · 상하면 · 해리면 · 성송면 · 대산면 · 심원면 · 흥덕면 · 성내면 · 신림면 · 부안면)', '부안군(부안읍 · 주산면 · 동진면 · 행안면 · 계화면 · 보안면 · 변산면 · 진서면 · 백산면 · 상서면 · 하서면 · 줄포면 · 위도면)'] },
  { name: '경상북도', districts: ['포항시(흥해읍 · 구룡포읍 · 연일읍 · 오천읍)', '경주시(감포읍 · 건천읍 · 안강읍 · 외동읍)', '김천시(아포읍)', '안동시(풍산읍)', '구미시(선산읍 · 고아읍 · 산동읍)', '영주시(풍기읍)', '영천시(금호읍)', '상주시(함창읍)', '문경시(문경읍 · 가은읍)', '경산시(하양읍 · 진량읍 · 압량읍)', '의성군(의성읍 · 단촌면 · 점곡면 · 옥산면 · 사곡면 · 춘산면 · 가음면 · 봉양면 · 비안면 · 구천면 · 단밀면 · 단북면 · 안계면 · 다인면 · 신평면 · 안평면 · 금성면 · 안사면)', '청송군(청송읍 · 부남면 · 주왕산면 · 안덕면 · 진보면 · 파천면 · 현동면 · 현서면)', '영양군(영양읍 · 입암면 · 청기면 · 일월면 · 수비면 · 석보면)', '영덕군(영덕읍 · 창수면 · 병곡면 · 영해면 · 축산면 · 지품면 · 강구면 · 달산면 · 남정면)', '청도군(청도읍 · 화양읍 · 각남면 · 각북면 · 금천면 · 매전면 · 운문면 · 이서면 · 풍각면)', '고령군(대가야읍 · 덕곡면 · 운수면 · 성산면 · 다산면 · 개진면 · 우곡면 · 쌍림면)', '성주군(성주읍 · 가천면 · 금수강산면 · 대가면 · 벽진면 · 선남면 · 수륜면 · 용암면 · 월항면 · 초전면)', '칠곡군(왜관읍 · 북삼읍 · 석적읍 · 지천면 · 동명면 · 가산면 · 약목면 · 기산면)', '예천군(예천읍 · 호명읍 · 용문면 · 효자면 · 은풍면 · 감천면 · 보문면 · 유천면 · 용궁면 · 개포면 · 지보면 · 풍양면)', '봉화군(봉화읍 · 춘양면 · 법전면 · 명호면 · 소천면 · 재산면 · 상운면 · 봉성면 · 물야면 · 내성면)', '울진군(울진읍 · 평해읍 · 북면 · 금강송면 · 근남면 · 매화면 · 기성면 · 온정면 · 죽변면 · 후포면)', '울릉군(울릉읍 · 서면 · 북면)'] },
  { name: '경상남도', districts: ['창원시(동읍 · 내서읍)', '김해시(진영읍)', '양산시(물금읍)', '진주시(문산읍)', '거제시', '통영시(산양읍)', '사천시(사천읍)', '밀양시(삼랑진읍 · 하남읍)', '의령군(의령읍 · 가례면 · 칠곡면 · 대의면 · 화정면 · 용덕면 · 정곡면 · 지정면 · 낙서면 · 부림면 · 봉수면 · 궁류면 · 유곡면)', '함안군(가야읍 · 칠원읍 · 함안면 · 군북면 · 법수면 · 대산면 · 칠서면 · 칠북면 · 산인면 · 여항면)', '창녕군(창녕읍 · 남지읍 · 계성면 · 고암면 · 길곡면 · 대지면 · 대합면 · 도천면 · 부곡면 · 성산면 · 영산면 · 유어면 · 이방면 · 장마면)', '고성군(고성읍 · 삼산면 · 하일면 · 하이면 · 상리면 · 대가면 · 영현면 · 영오면 · 개천면 · 구만면 · 회화면 · 마암면 · 동해면 · 거류면)', '남해군(남해읍 · 이동면 · 상주면 · 삼동면 · 미조면 · 남면 · 서면 · 고현면 · 설천면 · 창선면)', '하동군(하동읍 · 화개면 · 악양면 · 적량면 · 횡천면 · 고전면 · 금남면 · 진교면 · 양보면 · 북천면 · 청암면 · 옥종면 · 금성면)', '산청군(산청읍 · 차황면 · 오부면 · 생초면 · 금서면 · 삼장면 · 시천면 · 단성면 · 신안면 · 생비량면 · 신등면)', '함양군(함양읍 · 마천면 · 휴천면 · 유림면 · 수동면 · 지곡면 · 안의면 · 서하면 · 서상면 · 백전면 · 병곡면)', '거창군(거창읍 · 주상면 · 웅양면 · 고제면 · 북상면 · 위천면 · 마리면 · 남상면 · 남하면 · 신원면 · 가조면 · 가북면)', '합천군(합천읍 · 봉산면 · 묘산면 · 가야면 · 야로면 · 율곡면 · 초계면 · 쌍책면 · 덕곡면 · 청덕면 · 적중면 · 대양면 · 쌍백면 · 삼가면 · 가회면 · 대병면 · 용주면)'] },
  { name: '제주특별자치도', districts: ['제주시(한림읍 · 애월읍 · 조천읍 · 구좌읍)', '서귀포시(대정읍 · 남원읍 · 성산읍)'] },
];

// Real per-grade facts from roadmap.html (same content, kept in sync).
const GRADES = {
  g1: { label: '초1과외', title: '초1 한글 완성 · 기초 연산', tag: '학습 습관 형성기', body: '한글 자모음 완성과 받아쓰기로 읽기·쓰기 기초를 다지고, 10·20 이내 덧셈·뺄셈으로 수 감각을 기릅니다.', subjects: ['한글 완성 · 받아쓰기(국어)', '10·20 이내 연산(수학)', '알파벳 · 기초 파닉스(영어)'] },
  g2: { label: '초2과외', title: '초2 읽기·쓰기 자립', tag: '읽기·쓰기 자립기', body: '혼자 읽고 쓰는 힘을 기르고, 두 자리 수 연산 속도와 정확도를 함께 키우는 시기입니다.', subjects: ['독서 습관 · 문장 쓰기(국어)', '두 자리 연산(수학)', '파닉스 규칙(영어)'] },
  g3: { label: '초3과외', title: '초3 교과 학습의 시작', tag: '교과 학습 시작기', body: '어휘력을 확장하고, 곱셈·나눗셈 개념을 정확히 다지는 시기입니다.', subjects: ['어휘력 확장(국어)', '곱셈 · 나눗셈(수학)', '문장 읽기 독립(영어)'] },
  g4: { label: '초4과외', title: '초4 서술형·분수의 벽', tag: '서술형·분수의 벽', body: '서술형 문제에 적응하고, 분수·소수 등 추상적 개념을 구체물로 이해하는 시기입니다.', subjects: ['서술형 문제 적응(국어)', '분수 · 소수(수학)', '기초 문법 시작(영어)'] },
  g5: { label: '초5과외', title: '초5 도형·비율 심화', tag: '개념 확장기', body: '글의 구조를 파악하는 훈련과, 도형·비와 비율 등 확장된 수학 개념을 다루는 시기입니다.', subjects: ['글의 구조 파악(국어)', '도형 · 비율(수학)', '문법 체계 시작(영어)'] },
  g6: { label: '초6과외', title: '초6 중등 대비 마무리', tag: '중등 대비 마무리', body: '초등 6년을 총정리하며, 결손 없이 중등 학습으로 이어지도록 준비하는 시기입니다.', subjects: ['중등 국어 대비(국어)', '중등 수학 기초체력(수학)', '중등 영어 준비(영어)'] },
  m1: { label: '중1과외', title: '중1 자유학기제 활용, 서술형 대비 기초', tag: '진로 탐색기', body: '자유학기제 활동으로 독서·글쓰기 흥미를 넓히고, 문자와 식 등 흔들리기 쉬운 수학 개념을 확실히 짚는 시기입니다.', subjects: ['자유학기제 활용 독서·글쓰기(국어)', '문자와 식 기초(수학)', '중등 서술형·수행평가 대비(영어)'] },
  m2: { label: '중2과외', title: '중2 정식 내신 시작, 시험 대비 습관', tag: '첫 내신 시작기', body: '본격적인 지필 내신이 시작되며 학습 습관이 굳어지는 시기입니다. 함수 등 새 단원 개념을 놓치지 않도록 진도를 촘촘히 챙깁니다.', subjects: ['문학·비문학 독해 전략(국어)', '함수 단원 개념(수학)', '내신 서술형·어법(영어)'] },
  m3: { label: '중3과외', title: '중3 고교 대비, 진로 탐색', tag: '고교 대비기', body: '진학할 고등학교 유형이 정해지는 시기이자, 고1 공통과목 이후 이어질 학습에 대비하는 시기입니다.', subjects: ['고등 국어 문학·독서 예습(국어)', '이차함수·도형 기초(수학)', '고등 내신형 지문 독해(영어)'] },
  h1: { label: '고1과외', title: '고1 공통과목 이수, 첫 상대평가', tag: '공통과목·첫 내신', body: '전 과목 공통과목을 이수하며 처음으로 상대평가 등급을 경험하는 시기입니다.', subjects: ['공통국어 첫 내신 관리(국어)', '공통수학 결손 보완(수학)', '내신 서술형·수능형 독해(영어)'] },
  h2: { label: '고2과외', title: '고2 진로·융합선택과목 비중 확대', tag: '선택과목 심화기', body: '성취평가제(절대평가)가 적용되는 진로선택·융합선택과목 비중이 커지는 시기입니다.', subjects: ['화법과 언어 등 선택과목(국어)', '미적분·확률과통계 심화(수학)', '성취평가제 과목 학습법(영어)'] },
  h3: { label: '고3과외', title: '고3 등급 마무리, 입시 전략 병행', tag: '학점이수 마무리', body: '남은 학점을 마무리하며 수시·정시 등 대입 전형 전략을 함께 준비하는 시기입니다.', subjects: ['수능 국어 실전 감각(국어)', '취약 단원 집중 보완(수학)', '수능 영어 절대평가 전략(영어)'] },
};
const GRADE_LIST = Object.values(GRADES);

function baseName(d) { return d.replace(/\(.*\)$/, ''); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function topicParticle(name) {
  const code = name.charCodeAt(name.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return '은';
  return code % 28 === 0 ? '는' : '은';
}
function isSecondary(grade) { return grade.label.charAt(0) !== '초'; }
function regionSlug(region, grade) { return `${region.name}-${grade.label}`; }
function districtSlug(region, district, grade) { return `${region.name}-${baseName(district)}-${grade.label}`; }

function head(title, desc, canonical, keywords) {
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#173241">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="keywords" content="${esc(keywords)}">
<link rel="canonical" href="${canonical}">
<link rel="stylesheet" href="/assets/site.css">
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<meta property="og:type" content="website">
<meta property="og:site_name" content="탄탄과외">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta property="og:url" content="${canonical}">`;
}
function header() {
  return `<header>
  <div class="wrap nav">
    <a class="logo" href="/"><span class="logo-mark">탄</span>탄탄과외</a>
    <a class="nav-cta" href="tel:010-3951-0535">무료 진단 신청<span class="nav-cta-num">010-3951-0535</span></a>
  </div>
</header>
<div class="mobile-cta-bar">
  <a class="mobile-cta-call" href="tel:010-3951-0535">☎ 전화</a>
  <a class="mobile-cta-kakao" href="https://open.kakao.com/o/sOXeVnpi" target="_blank" rel="noopener">💬 카톡</a>
  <a class="mobile-cta-apply" href="/#apply">진단 신청</a>
</div>`;
}
function footer() {
  return `<footer>
  <div class="wrap">
    <p>© 2026 탄탄과외. All rights reserved. · <a href="/">홈으로</a></p>
  </div>
</footer>`;
}
function faqMini(place) {
  return `<section class="section-alt">
  <div class="wrap" style="max-width:640px;">
    <div class="section-head"><h2>자주 묻는 질문</h2></div>
    <div class="faq-item open">
      <div class="faq-q">${esc(place)}에서도 방문 수업이 가능한가요?<span class="plus">+</span></div>
      <div class="faq-a"><p>화상 수업이 기본이며, 전국 어디서나 동일하게 진행됩니다. 방문 수업은 지역과 선생님 배정 상황에 따라 상담 후 가능 여부를 안내해드립니다.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">상담이나 학습 진단에 비용이 드나요?<span class="plus">+</span></div>
      <div class="faq-a"><p>아니요, 상담과 학습 진단은 무료이며 등록을 강요하지 않습니다.</p></div>
    </div>
  </div>
</section>`;
}

function regionPageTemplate(region, grade) {
  const secondary = isSecondary(grade);
  const title = `${region.name} ${grade.label} | 탄탄과외`;
  const desc = `${region.name} 지역 ${grade.title} 안내. ${grade.body} 화상 수업이 기본이며, 지역에 따라 방문 수업도 상담 후 진행합니다.`;
  const canonical = `${SITE}/areas/${encodeURIComponent(regionSlug(region, grade))}.html`;
  const keywords = secondary
    ? `${region.name}${grade.label}, ${region.name} ${grade.label}, ${grade.label}, ${region.name} 중고등과외, ${region.name} 내신관리과외`
    : `${region.name}${grade.label}, ${region.name} ${grade.label}, ${grade.label}, ${region.name} 초등과외, ${region.name} 초등 전문과외`;
  const otherGrades = GRADE_LIST.filter(g => g.label !== grade.label)
    .map(g => `<a href="/areas/${encodeURIComponent(regionSlug(region, g))}.html">${g.label}</a>`).join(' · ');
  const districtLinks = region.districts.length
    ? region.districts.map(d => `<a href="/areas/${encodeURIComponent(districtSlug(region, d, grade))}.html">${region.name} ${baseName(d)} ${grade.label}</a>`).join('\n          ')
    : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
${head(title, desc, canonical, keywords)}
</head>
<body>
${header()}
<div class="breadcrumb"><a href="/">홈</a><span class="sep">/</span><a href="/areas/">지역별 과외</a><span class="sep">/</span><span>${esc(region.name)} ${esc(grade.label)}</span></div>
<div class="subpage-hero">
  <div class="wrap">
    <h1>${esc(region.name)} ${esc(grade.label)}</h1>
    <p>탄탄과외가 ${esc(region.name)} 지역 ${esc(grade.title)}를 안내합니다.</p>
  </div>
</div>
<section>
  <div class="wrap">
    <div class="point-grid">
      <div class="point-card"><h3>${esc(grade.title)}</h3><p>${esc(grade.body)}</p></div>
      ${grade.subjects.map(s => `<div class="point-card"><h3>${esc(s)}</h3><p>${esc(region.name)} 지역에서도 동일한 커리큘럼으로 진행합니다.</p></div>`).join('\n      ')}
    </div>
  </div>
</section>
${faqMini(region.name)}
${districtLinks ? `<section>
  <div class="wrap">
    <div class="section-head"><h2>${esc(region.name)} 시/군/구별 ${esc(grade.label)}</h2></div>
    <div class="region-grid" style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
          ${districtLinks}
    </div>
  </div>
</section>` : ''}
<section class="cta-section">
  <div class="wrap" style="max-width:520px;">
    <h2>${esc(region.name)} ${esc(grade.label)}, 무료 진단 받아보세요</h2>
    <p>상담과 학습 진단은 무료이며, 등록을 강요하지 않습니다.</p>
    <div class="hero-actions" style="justify-content:center;">
      <a class="btn-primary" href="/#apply">무료 학습 진단 신청</a>
      <a class="btn-ghost" style="border-color:var(--navy); color:var(--navy);" href="tel:010-3951-0535">☎ 전화 상담</a>
    </div>
    <p style="margin-top:16px; font-size:13px;">${esc(region.name)}의 다른 학년: ${otherGrades}</p>
    <p style="margin-top:8px;"><a href="/areas/" style="color:var(--coral-dark); font-weight:700;">전국 지역별 과외 전체 보기 →</a></p>
  </div>
</section>
${footer()}
<script src="/assets/site.js"></script>
</body>
</html>
`;
}

function districtPageTemplate(region, district, grade) {
  const secondary = isSecondary(grade);
  const district_ = baseName(district);
  const title = `${region.name} ${district_} ${grade.label} | 탄탄과외`;
  const desc = `${region.name} ${district_} 지역 ${grade.title} 안내. ${grade.body} 화상 수업이 기본이며, 지역에 따라 방문 수업도 상담 후 진행합니다.`;
  const canonical = `${SITE}/areas/${encodeURIComponent(districtSlug(region, district, grade))}.html`;
  const parentUrl = `/areas/${encodeURIComponent(regionSlug(region, grade))}.html`;
  const keywords = secondary
    ? `${district_}${grade.label}, ${district_} ${grade.label}, ${region.name}${district_}과외, ${grade.label}, ${district_} 중고등과외`
    : `${district_}${grade.label}, ${district_} ${grade.label}, ${region.name}${district_}과외, ${grade.label}`;
  const hasSub = /\(.*\)$/.test(district);
  const subNote = hasSub ? district.match(/\((.*)\)$/)[1] : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
${head(title, desc, canonical, keywords)}
</head>
<body>
${header()}
<div class="breadcrumb"><a href="/">홈</a><span class="sep">/</span><a href="/areas/">지역별 과외</a><span class="sep">/</span><a href="${parentUrl}">${esc(region.name)} ${esc(grade.label)}</a><span class="sep">/</span><span>${esc(district_)}</span></div>
<div class="subpage-hero">
  <div class="wrap">
    <h1>${esc(district_)} ${esc(grade.label)}</h1>
    <p>탄탄과외가 ${esc(district_)} 지역 ${esc(grade.title)}를 안내합니다.</p>
  </div>
</div>
<section>
  <div class="wrap">
    <div class="point-grid">
      <div class="point-card"><h3>${esc(grade.title)}</h3><p>${esc(grade.body)}</p></div>
      ${grade.subjects.map(s => `<div class="point-card"><h3>${esc(s)}</h3><p>${esc(district_)} 지역에서도 동일한 커리큘럼으로 진행합니다.</p></div>`).join('\n      ')}
    </div>
    <p style="margin-top:16px; font-size:13.5px; color:var(--slate);">${esc(district_)}${topicParticle(district_)} <a href="${parentUrl}">${esc(region.name)}</a> 소속 지역으로, 화상 수업은 전국 어디서나 동일하게 진행됩니다.${hasSub ? ` ${esc(district_)} 관내 ${esc(subNote)} 등 모든 읍·면 지역도 동일하게 상담 가능합니다.` : ''}</p>
  </div>
</section>
${faqMini(district_)}
<section class="cta-section">
  <div class="wrap" style="max-width:520px;">
    <h2>${esc(district_)} ${esc(grade.label)}, 무료 진단 받아보세요</h2>
    <p>상담과 학습 진단은 무료이며, 등록을 강요하지 않습니다.</p>
    <div class="hero-actions" style="justify-content:center;">
      <a class="btn-primary" href="/#apply">무료 학습 진단 신청</a>
      <a class="btn-ghost" style="border-color:var(--navy); color:var(--navy);" href="tel:010-3951-0535">☎ 전화 상담</a>
    </div>
    <p style="margin-top:8px;"><a href="${parentUrl}" style="color:var(--coral-dark); font-weight:700;">${esc(region.name)} 전체 보기 →</a> · <a href="/areas/" style="color:var(--coral-dark); font-weight:700;">전국 지역별 과외 전체 보기 →</a></p>
  </div>
</section>
${footer()}
<script src="/assets/site.js"></script>
</body>
</html>
`;
}

function hubTemplate() {
  const groups = REGIONS.map(region => {
    const links = GRADE_LIST.map(g => `<a href="/areas/${encodeURIComponent(regionSlug(region, g))}.html">${region.name} ${g.label}</a>`).join('\n          ');
    return `      <div id="${esc(region.name)}" style="margin-bottom:28px; scroll-margin-top:90px;">
        <h3 style="margin-bottom:12px;">${esc(region.name)}</h3>
        <div class="region-grid" style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
          ${links}
        </div>
      </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
${head('전국 지역별 초중고 과외 전체 목록 | 탄탄과외', '전국 16개 광역지자체, 시/군/구, 초1~고3 학년별 탄탄과외 안내 페이지 모음입니다.', `${SITE}/areas/`, '전국 초중고 과외, 지역별 초등 전문과외, 지역별 중고등 내신과외, 지방 초중고 과외')}
</head>
<body>
${header()}
<div class="breadcrumb"><a href="/">홈</a><span class="sep">/</span><span>지역별 과외</span></div>
<div class="subpage-hero">
  <div class="wrap">
    <h1>전국 지역별 초중고 과외 전체 목록</h1>
    <p>전국 16개 광역지자체, 시/군/구, 초1~고3 학년별 안내 페이지를 정리했습니다. 학원이 가까이 없는 지방·읍면 지역도 서울과 동일한 커리큘럼으로 화상 수업을 받을 수 있습니다.</p>
  </div>
</div>
<section>
  <div class="wrap">
${groups}
  </div>
</section>
${footer()}
<script src="/assets/site.js"></script>
</body>
</html>
`;
}

fs.mkdirSync(AREAS_DIR, { recursive: true });
let regionCount = 0, districtCount = 0;
const sitemapEntries = [];

for (const region of REGIONS) {
  for (const grade of GRADE_LIST) {
    const filename = `${regionSlug(region, grade)}.html`;
    fs.writeFileSync(path.join(AREAS_DIR, filename), regionPageTemplate(region, grade), 'utf8');
    sitemapEntries.push({ loc: `${SITE}/areas/${encodeURIComponent(filename)}`, priority: '0.6' });
    regionCount++;
    for (const district of region.districts) {
      const dFilename = `${districtSlug(region, district, grade)}.html`;
      fs.writeFileSync(path.join(AREAS_DIR, dFilename), districtPageTemplate(region, district, grade), 'utf8');
      sitemapEntries.push({ loc: `${SITE}/areas/${encodeURIComponent(dFilename)}`, priority: '0.5' });
      districtCount++;
    }
  }
}
fs.writeFileSync(path.join(AREAS_DIR, 'index.html'), hubTemplate(), 'utf8');
sitemapEntries.unshift({ loc: `${SITE}/areas/`, priority: '0.7' });

const today = new Date().toISOString().slice(0, 10);
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap-areas.xml'), sitemapXml, 'utf8');
console.log(`Generated ${regionCount} region pages + ${districtCount} district pages + 1 hub page.`);
console.log(`Wrote sitemap-areas.xml with ${sitemapEntries.length} URLs.`);
