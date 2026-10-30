const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.sanguim.co.kr';

// Configure Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is missing.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 16384
  }
});

// Comprehensive curated topic pool (compliant with Medical Service Act Art. 56)
const topicPool = [
  // 1. Hemodialysis (인공신장실/혈액투석)
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '혈액투석 환자의 고칼륨혈증 위험성과 안전한 칼륨 조절 식사 가이드',
    keyPoints: '혈중 칼륨 5.5mEq/L 초과 시 부정맥 및 심정지 위험, 채소 데쳐먹기 조리법, 칼륨 함량 높은 과일/채소 대체표, 인 결합제 및 칼륨 흡착제 올바른 복용'
  },
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '혈액투석 환자의 고인산혈증과 신성 골이영양증 예방: 인 결합제 복용과 식이 관리',
    keyPoints: '투석 환자의 혈중 인(P) 목표치(3.5~5.5mg/dL), 부갑상선호르몬(PTH) 상승과 혈관 석회화 기전, 가공식품 무기인 차단, 식사와 함께 복용하는 인 결합제 수칙'
  },
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '고효율 온라인 혈액투석여과(Online HDF)의 원리와 중분자 요독물질 제거 효과',
    keyPoints: '확산 방식과 대류 기전 결합, 중분자 요독물질(베타2-미크로그로불린) 제거율, 투석 아밀로이드증 및 소양증 예방, 심혈관 합병증 감소, 상우내과의원 인공신장실 시스템'
  },
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '혈액투석 환자의 신성 빈혈 원인과 조혈호르몬(EPO)·철분제 맞춤 치료',
    keyPoints: '신장 에리스로포이에틴 생성 저하 기전, 목표 헤모글로빈(10~11.5g/dL) 유지 기준, 혈청 페리틴 및 철포화도 모니터링, 피로감·심비대 예방'
  },
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '혈액투석 혈관 동정맥루(AVF) 협착 예방과 혈류 모니터링 자가 관리법',
    keyPoints: '동정맥루 혈류 잡음(Thrill & Bruit) 매일 청진 및 촉진, 혈관 압박 금지 수칙, 투석 바늘 천자 부위 지혈 및 감염 예방, 혈관 협착 조기 발견'
  },

  // 2. Endoscopy (위·대장내시경)
  {
    category: 'endoscopy',
    name: '위·대장내시경',
    badge: '위·대장내시경',
    icon: 'fa-solid fa-stethoscope',
    gradient: 'card-header-gradient-2',
    topic: '역류성 식도염(GERD)의 재발 원인과 위내시경 식도 점막 정밀 진단 및 생활수칙',
    keyPoints: '하부식도괄약근 압력 저하 기전, 가슴 쓰림·목 이물감·만성 기침 증상 감별, LA 분류에 따른 내시경 식도염 등급, 양성자펌프억제제(PPI) 복용과 식후 3시간 취침 금지'
  },
  {
    category: 'endoscopy',
    name: '위·대장내시경',
    badge: '위·대장내시경',
    icon: 'fa-solid fa-stethoscope',
    gradient: 'card-header-gradient-2',
    topic: '위궤양과 십이지장궤양의 통증 차이점 및 위내시경 조직검사와 헬리코박터 제균 치료',
    keyPoints: '식후 통증(위궤양) vs 공복·야간 통증(십이지장궤양) 비교, 비스테로이드성 소염진통제(NSAIDs)와 헬리코박터균 원인, 악성 궤양 감별을 위한 조직검사 및 추적 내시경'
  },
  {
    category: 'endoscopy',
    name: '위·대장내시경',
    badge: '위·대장내시경',
    icon: 'fa-solid fa-stethoscope',
    gradient: 'card-header-gradient-2',
    topic: '대장내시경 당일 용종절제술(EMR) 후 식사 주의사항과 지연성 출혈 예방 수칙',
    keyPoints: '선종성 용종 제거 후 점막 치유 과정, 시술 당일 미음·흰죽 단계별 식이 진행, 1~2주간 금주·사우나·격렬한 운동·자극적 음식 제한, 혈변·복통 시 내원 기준'
  },
  {
    category: 'endoscopy',
    name: '위·대장내시경',
    badge: '위·대장내시경',
    icon: 'fa-solid fa-stethoscope',
    gradient: 'card-header-gradient-2',
    topic: '과민성 대장증후군(IBS)과 염증성 장질환 감별을 위한 대장내시경 검사의 중요성',
    keyPoints: '반복되는 설사·변비·복부 팽만감의 원인, 기질적 질환(대장암, 궤양성 대장염, 크론병) 배제를 위한 대장내시경 적응증, 저포드맵(Low-FODMAP) 식단 관리'
  },

  // 3. Health Checkup (건강검진)
  {
    category: 'checkup',
    name: '건강검진',
    badge: '건강검진',
    icon: 'fa-solid fa-clipboard-user',
    gradient: 'card-header-gradient-3',
    topic: '경동맥 초음파 검사로 확인하는 혈관 내막두께(IMT)와 뇌졸중·심혈관 질환 조기 예방',
    keyPoints: '경동맥 내중막 두께(IMT 1.0mm 이상)와 동맥경화반(Plaque)의 의미, 고혈압·당뇨·고지혈증 환자의 뇌경색 위험도 예측, 스타틴 약물 치료 및 정기 추적 주기'
  },
  {
    category: 'checkup',
    name: '건강검진',
    badge: '건강검진',
    icon: 'fa-solid fa-clipboard-user',
    gradient: 'card-header-gradient-3',
    topic: '갑상선 초음파와 혈액검사(TSH·Free T4)로 감별하는 갑상선 결절 및 기능 이상',
    keyPoints: '갑상선 기능항진증 vs 기능저하증 증상과 호르몬 수치 해석, 갑상선 결절의 초음파 K-TIRADS 분류, 세침흡인세포검사 적응증과 정기 추적 관찰'
  },
  {
    category: 'checkup',
    name: '건강검진',
    badge: '건강검진',
    icon: 'fa-solid fa-clipboard-user',
    gradient: 'card-header-gradient-3',
    topic: '건강검진 빈혈 수치(헤모글로빈·페리틴) 저하의 원인과 소화기 잠혈 정밀 감별',
    keyPoints: '성인 남성(13g/dL 미만)·여성(12g/dL 미만) 빈혈 진단 기준, 철결핍성 빈혈과 위·대장 만성 출혈(위궤양, 대장암)의 연관성, 내시경 검사와 철분제 복용 원칙'
  },

  // 4. Chronic Disease (만성질환)
  {
    category: 'chronic',
    name: '만성질환',
    badge: '만성질환',
    icon: 'fa-solid fa-capsules',
    gradient: 'card-header-gradient-4',
    topic: '고혈압 단계별 진단 기준과 올바른 가정 혈압 측정법 및 약물 복용 수칙',
    keyPoints: '수축기 140mmHg / 이완기 90mmHg 진단 기준, 백의고혈압 vs 가면고혈압 감별, 올바른 혈압계 착용 및 아침/저녁 측정법, 임의 투약 중단 시 반동성 고혈압 위험'
  },
  {
    category: 'chronic',
    name: '만성질환',
    badge: '만성질환',
    icon: 'fa-solid fa-capsules',
    gradient: 'card-header-gradient-4',
    topic: '고지혈증 치료제(스타틴) 복용 시 흔한 오해와 근육통 등 부작용 대처법',
    keyPoints: '스타틴의 동맥경화반 안정화 기전, 꾸준한 복용이 필요한 의학적 이유, 근육통·간수치 미세 상승 시 용량 조절 및 에제티미브 병용, 정기 혈액검사의 중요성'
  },
  {
    category: 'chronic',
    name: '만성질환',
    badge: '만성질환',
    icon: 'fa-solid fa-capsules',
    gradient: 'card-header-gradient-4',
    topic: '고요산혈증과 통풍 발작 예방: 혈중 요산 수치(7.0mg/dL) 관리와 퓨린 제한 식이요법',
    keyPoints: '요산 결정 침착으로 인한 급성 통풍성 관절염과 통풍성 신증 위험, 요산 강하제(알로푸리놀·페북소스타트) 장기 복용 원칙, 맥주·내장류·과당 제한과 수분 섭취'
  },

  // 5. Kidney Disease (신장질환/콩팥건강)
  {
    category: 'kidney',
    name: '신장질환/콩팥건강',
    badge: '신장질환',
    icon: 'fa-solid fa-vial-circle-check',
    gradient: 'card-header-gradient-1',
    topic: '만성 콩팥병 환자가 주의해야 할 약물: 비스테로이드성 소염진통제(NSAIDs)와 조영제 신독성 예방',
    keyPoints: '소염진통제가 신장 수입세동맥을 수축시켜 급성 신손상을 유발하는 기전, CT 조영제 검사 전후 수액 처치, 건강기능식품·달인 물 무분별한 섭취 금물'
  },
  {
    category: 'kidney',
    name: '신장질환/콩팥건강',
    badge: '신장질환',
    icon: 'fa-solid fa-vial-circle-check',
    gradient: 'card-header-gradient-1',
    topic: '고혈압성 신증(고혈압에 의한 콩팥 손상)의 기전과 신장 기능 보호를 위한 목표 혈압',
    keyPoints: '지속적인 고혈압이 사구체 모세혈관 경화증을 일으키는 과정, 단백뇨 동반 만성 콩팥병 환자의 목표 혈압(130/80mmHg 미만), RAS 차단제(ARB/ACEi) 치료'
  },

  // 6. Diabetes Clinic (당뇨 클리닉)
  {
    category: 'diabetes',
    name: '당뇨 클리닉',
    badge: '당뇨 클리닉',
    icon: 'fa-solid fa-droplet',
    gradient: 'card-header-gradient-7',
    topic: '식후 혈당 스파이크를 잡는 식사 순서(채소-단백질-탄수화물)와 자가혈당 관리법',
    keyPoints: '급격한 혈당 상승이 혈관 내피세포 손상을 유발하는 기전, 식이섬유 선섭취를 통한 포도당 흡수 지연, 식후 30분 걷기 운동의 인슐린 감수성 개선 효과'
  },
  {
    category: 'diabetes',
    name: '당뇨 클리닉',
    badge: '당뇨 클리닉',
    icon: 'fa-solid fa-droplet',
    gradient: 'card-header-gradient-7',
    topic: '공복혈당장애와 내당능장애(당뇨 전단계) 진단 기준 및 제2형 당뇨병 진행 예방 전략',
    keyPoints: '공복혈당 100~125mg/dL, 당화혈색소 5.7~6.4%의 임상적 의미, 체중 5~7% 감량과 유산소·근력 복합 운동을 통한 인슐린 저항성 개선, 정기 혈액검사 주기'
  }
];

function stripTags(str) {
  return (str || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Pick a topic not yet heavily duplicated in blog/ or drafts/
function selectTopic() {
  const blogDir = path.join(__dirname, '../blog');
  const draftsDir = path.join(__dirname, '../drafts');
  const existingTitles = [];

  [blogDir, draftsDir].forEach(dir => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      const m = content.match(/<h1 class="post-detail-title">([\s\S]*?)<\/h1>/);
      if (m) existingTitles.push(stripTags(m[1]));
    });
  });

  const unused = topicPool.filter(t => {
    const coreWords = t.topic.split(/[\s,:()·]+/).filter(w => w.length >= 3).slice(0, 3);
    return !existingTitles.some(et => coreWords.every(cw => et.includes(cw)));
  });

  const pool = unused.length > 0 ? unused : topicPool;
  return pool[Math.floor(Math.random() * pool.length)];
}

const selected = selectTopic();
const todayTimestamp = Date.now();
const filename = `gyeyang-auto-${selected.category}-${todayTimestamp}.html`;

// Ask Gemini ONLY for the structured JSON payload of the article content so output tokens are never wasted on static HTML boilerplate
const prompt = `
당신은 인천 계양구 계산동에 위치한 '상우내과의원'의 수석 의학 콘텐츠 전문의입니다.
아래 주제에 대해 깊이 있고 신뢰할 수 있는 의학 칼럼 데이터를 순수 JSON 형식으로 작성하세요.

# 선정된 주제
- 카테고리: ${selected.name} (${selected.badge})
- 주제: ${selected.topic}
- 핵심 의학 키워드: ${selected.keyPoints}

# 작성 지침
1. GEO 로컬 최적화:
   - title은 반드시 "계양구 계산동" 또는 "계산역" 지역명을 첫머리에 포함하세요 (예: "계양구 계산동 ${selected.badge}: ${selected.topic}"). 끝에 '| 상우내과의원'은 붙이지 마세요.
   - excerpt는 인천 계양구 계산역 4번 출구 상우내과의원 중심의 2문장 요약문으로 작성하세요.
   - quickSummary는 AI 검색엔진과 환자가 10초 만에 핵심 의학 결론과 수치 기준을 파악할 수 있는 3~4문장 핵심 의학 요약입니다.
2. 본문(bodyHtml) 구성:
   - 총 한글 글자수 2,200자 ~ 2,800자 분량의 상세하고 전문적인 HTML 조각(<p class="lead">부터 <h2>5. ...</h2> 단락까지)으로 작성하세요.
   - 5개의 대주제(<h2>1. ...</h2> ~ <h2>5. ...</h2>)와 소주제(<h3>), 비교 분석 표(<table class="post-table"><thead>...</thead><tbody>...</tbody></table>), 학회 가이드라인 콜아웃(<div class="post-callout"><p><strong>💡 ...</strong><br>...</p></div>), 실천 수칙 박스(<div class="info-box"><h3>...</h3><ul><li>...</li></ul></div>)를 반드시 포함하세요.
   - 5번 대주제에서는 상우내과의원의 전문 진료 역량과 위치(인천 1호선 계산역 4번 출구 앞 60m 계산메디칼센타 2~3층, 전용 주차장, 외래 032-551-0860, 인공신장실 032-551-0875)를 자연스럽게 안내하세요.
3. 의료법 제56조 1항 및 스타일 준수:
   - "최고", "완치", "1등", "대학병원급" 등 과장/배타적 표현 절대 금지.
   - 특정 의사 개인 실명 언급 금지 ("상우내과의원", "신장내과 전문의", "내시경전문의" 등 사용).
   - 비뇨기과, 입원실 언급 금지.
   - 마크다운 별표(**, *) 사용 절대 금지. 강조는 오직 <strong> 태그만 사용하세요.
4. faqs 배열:
   - 본문 핵심 내용과 직결되는 질문(q)과 명확한 의학적 답변(a) 3쌍을 작성하세요.

# 출력 JSON 스키마 (반드시 유효한 JSON 객체만 출력하고 코드블록 바깥 텍스트 금지):
{
  "title": "...",
  "excerpt": "...",
  "keywords": "상우내과의원, 계양구 내과, 계산동 내과, 계산역 내과, ...",
  "bannerSlogan": "...",
  "quickSummary": "...",
  "bodyHtml": "<p class=\\"lead\\">...</p><h2>1. ...</h2>...",
  "faqs": [
    { "q": "...", "a": "..." },
    { "q": "...", "a": "..." },
    { "q": "...", "a": "..." }
  ]
}
`;

function assembleFullHtml(data) {
  const cleanTitle = data.title.replace(/\*\*/g, '').replace(/\s*\|\s*상우내과의원.*$/, '').trim();
  const cleanExcerpt = data.excerpt.replace(/\*\*/g, '').trim();
  const cleanQuickSummary = data.quickSummary.replace(/\*\*/g, '').trim();
  const cleanBannerSlogan = (data.bannerSlogan || selected.topic).replace(/\*\*/g, '').trim();
  const cleanBody = data.bodyHtml
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/대학병원급/g, '고해상도 정밀')
    .replace(/완치/g, '근본적인 호전 및 관리');

  const faqEntities = (data.faqs || []).map(item => ({
    "@type": "Question",
    "name": (item.q || '').replace(/\*\*/g, '').trim(),
    "acceptedAnswer": {
      "@type": "Answer",
      "text": (item.a || '').replace(/\*\*/g, '').trim()
    }
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        "@id": `${SITE}/#clinic`,
        "name": "상우내과의원",
        "alternateName": ["상우내과", "계양구 상우내과", "계산역 상우내과", "계산동 상우내과", "인천 상우내과의원"],
        "description": "인천광역시 계양구 계산역 4번 출구 도보 1분 거리에 위치한 내과·신장내과 의료기관. 신장내과 분과전문의 상주 고효율 혈액투석(Online HDF) 인공신장실, 대한위대장내시경학회 인증 위·대장내시경 전문의 당일 용종절제술(EMR), 건강보험심사평가원 고혈압·당뇨병 적정성 평가 1등급 만성질환 클리닉, 국민건강보험공단 국가건강검진 및 5대 암검진 센터 운영.",
        "url": `${SITE}/`,
        "sameAs": [
          "http://www.sangumed.co.kr/",
          "https://naver.me/5ZJMYzjj"
        ],
        "logo": "https://cdn.imweb.me/upload/S202109145c6d02f1eb8c7/cc8033301742e.png",
        "image": "https://cdn.imweb.me/upload/S202109145c6d02f1eb8c7/cc8033301742e.png",
        "telephone": "032-551-0860",
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+82-32-551-0860",
            "contactType": "customer service",
            "areaServed": "KR",
            "availableLanguage": "Korean",
            "description": "외래 진료, 국가건강검진, 위·대장내시경, 고혈압·당뇨 클리닉 예약 및 문의"
          },
          {
            "@type": "ContactPoint",
            "telephone": "+82-32-551-0875",
            "contactType": "customer service",
            "areaServed": "KR",
            "availableLanguage": "Korean",
            "description": "인공신장실(혈액투석) 직통 상담 및 투석 예약"
          }
        ],
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "경명대로 1096 계산메디칼센타 2~3층",
          "addressLocality": "계양구 계산동",
          "addressRegion": "인천광역시",
          "postalCode": "21013",
          "addressCountry": "KR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 37.5432,
          "longitude": 126.7277
        },
        "hasMap": "https://naver.me/5ZJMYzjj",
        "award": [
          "건강보험심사평가원 고혈압 적정성 평가 1등급 선정",
          "건강보험심사평가원 당뇨병 적정성 평가 1등급 선정",
          "대한위대장내시경학회 위내시경전문의 자격 인증",
          "대한위대장내시경학회 대장내시경전문의 자격 인증",
          "보건복지부 일차의료 만성질환관리 사업 참여 의료기관"
        ],
        "areaServed": [
          {"@type": "AdministrativeArea", "name": "인천광역시 계양구"},
          {"@type": "AdministrativeArea", "name": "계산동"},
          {"@type": "AdministrativeArea", "name": "작전동"},
          {"@type": "AdministrativeArea", "name": "효성동"},
          {"@type": "AdministrativeArea", "name": "임학동"},
          {"@type": "AdministrativeArea", "name": "용종동"},
          {"@type": "AdministrativeArea", "name": "서운동"},
          {"@type": "AdministrativeArea", "name": "박촌동"},
          {"@type": "AdministrativeArea", "name": "귤현동"},
          {"@type": "AdministrativeArea", "name": "동양동"},
          {"@type": "AdministrativeArea", "name": "장기동"},
          {"@type": "AdministrativeArea", "name": "부평구 삼산동"},
          {"@type": "AdministrativeArea", "name": "부평구 갈산동"}
        ],
        "medicalSpecialty": [
          "InternalMedicine",
          "Nephrology",
          "Gastroenterology",
          "Endocrine"
        ],
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "09:00",
            "closes": "13:00"
          }
        ]
      },
      {
        "@type": "MedicalWebPage",
        "@id": `${SITE}/blog/${filename}#webpage`,
        "url": `${SITE}/blog/${filename}`,
        "name": `${cleanTitle} | 상우내과의원 계산역 4번 출구`,
        "headline": cleanTitle,
        "description": cleanExcerpt,
        "inLanguage": "ko-KR",
        "datePublished": "PUBLISH_DATE",
        "dateModified": "PUBLISH_DATE",
        "lastReviewed": "PUBLISH_DATE",
        "mainEntityOfPage": `${SITE}/blog/${filename}`,
        "publisher": { "@id": `${SITE}/#clinic` },
        "author": { "@id": `${SITE}/#clinic` },
        "reviewedBy": { "@id": `${SITE}/#clinic` },
        "about": [
          {"@type": "MedicalCondition", "name": selected.badge},
          {"@type": "AdministrativeArea", "name": "인천광역시 계양구 계산동"}
        ],
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".post-detail-title", ".post-quick-summary", ".lead"]
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/blog/${filename}#faq`,
        "mainEntity": faqEntities
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}/blog/${filename}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "홈",
            "item": `${SITE}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "계양구 내과 건강정보",
            "item": `${SITE}/#blog-section`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": selected.badge,
            "item": `${SITE}/`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": cleanTitle,
            "item": `${SITE}/blog/${filename}`
          }
        ]
      }
    ]
  };

  return `<!--
METADATA:
title: ${cleanTitle}
excerpt: ${cleanExcerpt}
category: ${selected.category}
badge: ${selected.badge}
icon: ${selected.icon}
gradient: ${selected.gradient}
filename: ${filename}
-->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanTitle} | 상우내과의원 계산역 4번 출구</title>
  <meta name="description" content="${cleanExcerpt}">
  <meta name="keywords" content="${(data.keywords || `상우내과의원, 계양구 내과, 계산동 내과, 계산역 내과, ${selected.name}`).replace(/\*\*/g, '')}">
  <meta name="author" content="상우내과의원">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <!-- GEO Location Meta Tags -->
  <meta name="geo.region" content="KR-28">
  <meta name="geo.placename" content="인천광역시 계양구 계산동 (계산역 4번 출구)">
  <meta name="geo.position" content="37.5432;126.7277">
  <meta name="ICBM" content="37.5432, 126.7277">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${cleanTitle} | 상우내과의원">
  <meta property="og:description" content="${cleanExcerpt}">
  <meta property="og:url" content="${SITE}/blog/${filename}">
  <link rel="canonical" href="${SITE}/blog/${filename}">

  <!-- LLM & AI Search Discovery Links -->
  <link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="상우내과의원 LLM 요약 인덱스">
  <link rel="alternate" type="text/plain" href="${SITE}/llms-full.txt" title="상우내과의원 전체 의학 칼럼 코퍼스">

  <link rel="stylesheet" href="../css/style.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Structured Data (JSON-LD) for GEO, AI Search & LLM Citation -->
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body>
  <nav class="site-nav">
    <div class="container nav-container">
      <a href="../index.html" class="nav-logo">
        <i class="fa-solid fa-stethoscope"></i> 상우내과의원 <span>건강정보</span>
      </a>
      <a href="../index.html" class="nav-back-btn">
        <i class="fa-solid fa-arrow-left"></i> 목록으로
      </a>
    </div>
  </nav>

  <main class="blog-detail-page">
    <div class="container blog-detail-container">
      <article class="blog-post-content">
        <!-- Visual Breadcrumb Navigation -->
        <nav class="post-breadcrumb" aria-label="breadcrumb">
          <ol>
            <li><a href="../index.html"><i class="fa-solid fa-house"></i> 홈</a></li>
            <li><i class="fa-solid fa-chevron-right"></i> <a href="../index.html#blog-section">계양구 내과 칼럼</a></li>
            <li><i class="fa-solid fa-chevron-right"></i> <span class="current-crumb">${selected.badge}</span></li>
          </ol>
        </nav>

        <div class="post-meta">
          <span class="post-category-tag">${selected.badge}</span>
          <span class="post-publish-date">작성일: <span id="publish-date">PUBLISH_DATE</span></span>
        </div>
        
        <h1 class="post-detail-title">${cleanTitle}</h1>
        
        <div class="post-featured-banner ${selected.gradient}">
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; flex-direction: column; text-align: center; padding: 20px;">
            <i class="${selected.icon}" style="font-size: 4.5rem; margin-bottom: 20px; opacity: 0.9;"></i>
            <span style="font-size: 1.4rem; font-weight: 800; letter-spacing: -0.5px;">${cleanBannerSlogan}</span>
            <p style="font-size: 0.95rem; opacity: 0.8; margin-top: 8px;">인천 계양구 계산역 4번 출구 상우내과의원 ${selected.badge}</p>
          </div>
        </div>
        
        <div class="post-body">
          <div class="post-quick-summary">
            <div class="post-quick-summary-title">
              <i class="fa-solid fa-wand-magic-sparkles"></i> 핵심 의학 요약 (${selected.badge})
            </div>
            <p>${cleanQuickSummary}</p>
          </div>

          ${cleanBody}
        </div>

        <!-- GEO Clinic Location & Local Care Card -->
        <div class="post-geo-box">
          <div class="post-geo-header">
            <h4 class="post-geo-title">
              <i class="fa-solid fa-location-dot"></i> 상우내과의원 오시는 길 및 진료 안내
            </h4>
            <span class="post-geo-badge">계산역 4번 출구 도보 1분</span>
          </div>
          <div class="post-geo-body">
            <div class="post-geo-grid">
              <div class="post-geo-item">
                <div class="post-geo-icon"><i class="fa-solid fa-hospital"></i></div>
                <div class="post-geo-info">
                  <h5>도로명 주소</h5>
                  <p>인천 계양구 경명대로 1096 계산메디칼센타 2~3층</p>
                </div>
              </div>
              <div class="post-geo-item">
                <div class="post-geo-icon"><i class="fa-solid fa-train-subway"></i></div>
                <div class="post-geo-info">
                  <h5>지하철 이용</h5>
                  <p>인천 1호선 계산역 4번 출구 바로 앞 60m</p>
                </div>
              </div>
              <div class="post-geo-item">
                <div class="post-geo-icon"><i class="fa-solid fa-square-parking"></i></div>
                <div class="post-geo-info">
                  <h5>주차 안내</h5>
                  <p>계산메디칼센타 건물 내 전용 주차장 (진료 무료)</p>
                </div>
              </div>
              <div class="post-geo-item">
                <div class="post-geo-icon"><i class="fa-solid fa-phone-volume"></i></div>
                <div class="post-geo-info">
                  <h5>진료 문의전화</h5>
                  <p>외래: 032-551-0860 · 인공신장실: 032-551-0875</p>
                </div>
              </div>
            </div>
            <div class="post-geo-areas">
              <strong><i class="fa-solid fa-map-marked-alt"></i> 주요 진료 생활권:</strong> 인천 계양구 전역(계산동, 작전동, 효성동, 임학동, 용종동, 서운동, 박촌동, 귤현동) 및 부평구 삼산동·갈산동
            </div>
            <div class="post-geo-actions">
              <a href="https://naver.me/5ZJMYzjj" target="_blank" rel="noopener noreferrer" class="post-geo-btn post-geo-btn-naver">
                <i class="fa-solid fa-map-location-dot"></i> 네이버 지도로 길찾기
              </a>
              <a href="tel:032-551-0860" class="post-geo-btn post-geo-btn-call">
                <i class="fa-solid fa-phone"></i> 외래 진료 상담
              </a>
              <a href="tel:032-551-0875" class="post-geo-btn post-geo-btn-sub">
                <i class="fa-solid fa-heart-pulse"></i> 인공신장실 직통
              </a>
            </div>
          </div>
        </div>

        <div class="medical-warning-box mt-5">
          <p>
            <strong>💡 의료법 제56조 1항에 따른 안내</strong><br>
            본 포스팅의 모든 내용은 상우내과의원에서 직접 작성하였습니다. 제공되는 건강 정보는 일반적인 의학적 지식이며 개별 환자의 특성에 따라 차이가 있을 수 있으므로, 정확한 진단과 치료를 위해서는 반드시 내원하여 진료를 받으시길 바랍니다.
          </p>
        </div>
      </article>

      <aside class="blog-sidebar">
        <div class="sidebar-card">
          <h4 class="sidebar-title">상우내과의원 안내</h4>
          <ul class="sidebar-info-list">
            <li><i class="fa-solid fa-clock"></i><div><strong>평일</strong> 09:00 - 18:00</div></li>
            <li><i class="fa-regular fa-calendar-check"></i><div><strong>토요일</strong> 09:00 - 13:00</div></li>
            <li><i class="fa-solid fa-phone-volume"></i><div><strong>예약 및 문의</strong><br>032-551-0860</div></li>
          </ul>
        </div>
        <div class="sidebar-card">
          <h4 class="sidebar-title">추천 건강 정보</h4>
          <div class="sidebar-posts-list"></div>
        </div>
      </aside>
    </div>
  </main>
</body>
</html>
`;
}

async function run() {
  try {
    console.log(`[AI Generator] Selecting topic: "${selected.topic}" (${selected.name})...`);
    const result = await model.generateContent(prompt);
    let raw = result.response.text().trim();
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    const data = JSON.parse(raw);
    if (!data.title || !data.bodyHtml || data.bodyHtml.length < 800) {
      throw new Error("Generated article JSON is incomplete or too short.");
    }

    const html = assembleFullHtml(data);

    const draftsDir = path.join(__dirname, '../drafts');
    if (!fs.existsSync(draftsDir)) {
      fs.mkdirSync(draftsDir, { recursive: true });
    }

    const draftPath = path.join(draftsDir, filename);
    fs.writeFileSync(draftPath, html, 'utf8');

    console.log(`[AI Generator] Successfully generated validated draft: ${filename}`);
  } catch (error) {
    console.error("[AI Generator] Error generating content:", error);
    process.exit(1);
  }
}

run();
