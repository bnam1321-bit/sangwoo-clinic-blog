const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

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
    maxOutputTokens: 8192
  }
});

// Comprehensive curated topic pool
const topicPool = [
  // 1. Hemodialysis (인공신장실/혈액투석)
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '혈액투석 환자의 건조체중(Dry Weight) 설정과 투석간 체중 증가 관리',
    keyPoints: '건조체중의 정의, 체중 증가 3~5% 제한 기준, 과다 수분 축적 시 폐부종 및 심부전 위험, 수분 섭취 억제 실천 팁, 상우내과 인공신장실 고유량 투석'
  },
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '혈액투석 중 발생하는 저혈압 및 근육 경련의 원인과 예방 대처법',
    keyPoints: '투석 중 급격한 한외여과로 인한 유효 혈류량 감소, 삼투압 불균형, 혈압 강하 시 대처 요령, 전해질 조절과 근육 경련 완화, 투석 전 혈압약 복용 타이밍 조절'
  },
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '혈액투석 환자의 고칼륨혈증 위험성과 안전한 칼륨 조절 식사 가이드',
    keyPoints: '혈중 칼륨 5.5mEq/L 초과 시 부정맥 및 심정지 위험, 채소 데쳐먹기 조리법, 칼륨 함량 높은 과일/채소 대체표, 인 바인더 및 칼륨 흡착제 올바른 복용'
  },
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '고효율 온라인 혈액투석여과(Online HDF)의 원리와 장기 생존율 향상 효과',
    keyPoints: '기존 확산 방식과 대류 기전 결합, 중분자 요독물질(베타2-미크로그로불린) 제거율, 투석 아밀로이드증 예방, 심혈관 합병증 감소, 상우내과의원 최신 투석 시스템'
  },
  {
    category: 'hemodialysis',
    name: '인공신장실/혈액투석',
    badge: '인공신장실',
    icon: 'fa-solid fa-heart-pulse',
    gradient: 'card-header-gradient-6',
    topic: '혈액투석 혈관 동정맥루(AVF) 협착 예방과 혈류 모니터링 자가 관리법',
    keyPoints: '동정맥루 혈류 잡음(Thrill & Bruit) 매일 청진 및 촉진, 혈관 압박 금지 수칙, 투석 바늘 천자 부위 지혈 및 감염 예방, 혈관 협착 조기 발견 시 혈관중재술 연계'
  },

  // 2. Endoscopy (위·대장내시경)
  {
    category: 'endoscopy',
    name: '위·대장내시경',
    badge: '위·대장내시경',
    icon: 'fa-solid fa-stethoscope',
    gradient: 'card-header-gradient-2',
    topic: '수면 위·대장내시경 검사 전 준비와 올림푸스 CV-190 당일 용종 절제술(EMR)',
    keyPoints: '안전한 진정제 투여 및 실시간 활력징후 모니터링, 올림푸스 EVIS EXERA III CV-190 NBI 고화질 관찰, 선종성 용종 발견 즉시 당일 EMR 점막절제술, 검사 후 식사 및 출혈 예방 수칙'
  },
  {
    category: 'endoscopy',
    name: '위·대장내시경',
    badge: '위·대장내시경',
    icon: 'fa-solid fa-stethoscope',
    gradient: 'card-header-gradient-2',
    topic: '대장 용종의 종류(선종성 vs 과형성)와 대장암 예방을 위한 정기 추적 주기',
    keyPoints: '선종-암 연속체(Adenoma-Carcinoma Sequence), 크기 1cm 이상 및 융모형 선종의 암 위험도, 용종 제거 후 1년/3년/5년 추적 검진 가이드라인, 장정결도와 검사 정확도'
  },
  {
    category: 'endoscopy',
    name: '위·대장내시경',
    badge: '위·대장내시경',
    icon: 'fa-solid fa-stethoscope',
    gradient: 'card-header-gradient-2',
    topic: '위내시경으로 감별하는 만성 위염, 장상피화생, 그리고 위암 조기 스크리닝',
    keyPoints: '표재성·미란성·위축성 위염과 장상피화생의 병리적 변화, 위암 가족력과 1~2년 주기 검진 필요성, 헬리코박터균 감염 여부 신속요소분해효소검사(CLO test)'
  },
  {
    category: 'endoscopy',
    name: '위·대장내시경',
    badge: '위·대장내시경',
    icon: 'fa-solid fa-stethoscope',
    gradient: 'card-header-gradient-2',
    topic: '헬리코박터 파일로리균의 위험성과 1차·2차 제균 치료 완치 가이드',
    keyPoints: 'WHO 1급 발암물질 지정, 위궤양·십이지장궤양 및 위선종 절제 후 제균 적응증, 3제 요법 14일 복용 및 복약 순응도, 요소호기검사(UBT)를 통한 제균 성공 판정'
  },

  // 3. Health Checkup (건강검진)
  {
    category: 'checkup',
    name: '건강검진',
    badge: '건강검진',
    icon: 'fa-solid fa-clipboard-user',
    gradient: 'card-header-gradient-3',
    topic: '국가 5대 암검진 주기와 연령별 필수 추가 정밀 검진 항목 가이드',
    keyPoints: '위암(40세이상 2년), 대장암(50세이상 1년 분변잠혈 및 내시경 권고), 간암 고위험군 초음파+AFP 6개월, 유방암/자궁경부암, 4050 세대 심뇌혈관 정밀 초음파'
  },
  {
    category: 'checkup',
    name: '건강검진',
    badge: '건강검진',
    icon: 'fa-solid fa-clipboard-user',
    gradient: 'card-header-gradient-3',
    topic: '건강검진 결과표 완벽 해설: 간기능 수치(AST, ALT, r-GTP) 상승의 의미와 대처법',
    keyPoints: '간효소 수치 정상 범위와 상승 원인(비알코올성 지방간, 약제성 간손상, 알코올), 복부 초음파를 통한 간 실질 감별, 간수치 정상화를 위한 식단 및 체중 감량'
  },
  {
    category: 'checkup',
    name: '건강검진',
    badge: '건강검진',
    icon: 'fa-solid fa-clipboard-user',
    gradient: 'card-header-gradient-3',
    topic: '이상지질혈증(고지혈증) 검사 결과 해석: LDL 콜레스테롤과 중성지방 목표 수치',
    keyPoints: '총콜레스테롤, HDL(좋은 콜레스테롤), LDL(나쁜 콜레스테롤), 중성지방(TG) 기준치, 당뇨·심혈관 고위험군의 LDL 70mg/dL 이하 조절 목표, 스타틴 복용과 심근경색 예방'
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
    topic: '대사증후군 5대 진단 기준과 심뇌혈관 질환 예방을 위한 생활습관 교정',
    keyPoints: '복부비만(허리둘레), 중성지방 150이상, HDL 저하, 혈압 130/85이상, 공복혈당 100이상 중 3개 이상 해당 시 진단, 인슐린 저항성 개선과 유산소 운동 플랜'
  },
  {
    category: 'chronic',
    name: '만성질환',
    badge: '만성질환',
    icon: 'fa-solid fa-capsules',
    gradient: 'card-header-gradient-4',
    topic: '고지혈증 치료제(스타틴) 복용 시 흔한 오해와 근육통 등 부작용 대처법',
    keyPoints: '스타틴의 동맥경화반 안정화 기전, 평생 먹어야 하는 약인가에 대한 의학적 설명, 근육통·간수치 미세 상승 시 용량 조절 및 에제티미브 병용, 정기 혈액검사의 중요성'
  },

  // 5. Kidney Disease (신장질환/콩팥건강)
  {
    category: 'kidney',
    name: '신장질환/콩팥건강',
    badge: '신장질환',
    icon: 'fa-solid fa-vial-circle-check',
    gradient: 'card-header-gradient-1',
    topic: '사구체여과율(eGFR) 수치로 알아보는 만성 콩팥병 1~5단계 진행 억제 전략',
    keyPoints: '혈청 크레아티닌 기반 eGFR 계산, 1~2기 조기 관리(단백뇨 억제), 3기 합병증(빈혈·골대사 이상) 예방, 4~5기 투석 준비, 혈압 130/80 이하 조절과 저염식'
  },
  {
    category: 'kidney',
    name: '신장질환/콩팥건강',
    badge: '신장질환',
    icon: 'fa-solid fa-vial-circle-check',
    gradient: 'card-header-gradient-1',
    topic: '소변 검사에서 단백뇨와 혈뇨가 검출되었을 때 의심할 수 있는 신장 질환',
    keyPoints: '일시적 단백뇨 vs 지속적 단백뇨, 미세알부민뇨(30~300mg/g)의 임상적 의미, IgA 신증 및 사구체신염 감별, 신장내과 분과 정밀 소변 및 혈액 검사'
  },
  {
    category: 'kidney',
    name: '신장질환/콩팥건강',
    badge: '신장질환',
    icon: 'fa-solid fa-vial-circle-check',
    gradient: 'card-header-gradient-1',
    topic: '만성 콩팥병 환자의 3대 필수 식이요법: 저염, 저단백, 칼륨·인 조절 원칙',
    keyPoints: '나트륨 1일 2,000mg 이하 제한, 과도한 단백질 섭취가 사구체 내압을 높이는 기전, 칼륨 배출 저하 시 부정맥 예방, 가공식품 무기인 섭취 차단 요령'
  },
  {
    category: 'kidney',
    name: '신장질환/콩팥건강',
    badge: '신장질환',
    icon: 'fa-solid fa-vial-circle-check',
    gradient: 'card-header-gradient-1',
    topic: '신장 결석(요로결석)의 형성 기전과 재발 방지를 위한 학회 권장 식이 수칙',
    keyPoints: '수산화칼슘 결석 형성 원인, 하루 2.5L 생수 섭취로 소변 희석, 옥살산(시금치, 견과류) 과다 섭취 제한, 구연산(레몬) 섭취와 결석 용해 효과, 칼슘 제한 금지 원칙'
  },

  // 6. Diabetes Clinic (당뇨 클리닉)
  {
    category: 'diabetes',
    name: '당뇨 클리닉',
    badge: '당뇨 클리닉',
    icon: 'fa-solid fa-droplet',
    gradient: 'card-header-gradient-7',
    topic: '일차의료 만성질환관리 시범사업: 당뇨 전담 코디네이터와 함께하는 1:1 맞춤 케어',
    keyPoints: '국민건강보험공단 주관 만관사업 혜택, 연간 케어플랜 수립 및 본인부담금 감면, 당뇨 전담 코디네이터 상주로 1:1 식단·운동·자가혈당 밀착 교육, 합병증 조기 선별'
  },
  {
    category: 'diabetes',
    name: '당뇨 클리닉',
    badge: '당뇨 클리닉',
    icon: 'fa-solid fa-droplet',
    gradient: 'card-header-gradient-7',
    topic: '당뇨병 초기 3대 증상(다음·다뇨·다식)과 당화혈색소(HbA1c) 조절 목표',
    keyPoints: '인슐린 분비/작용 저하로 혈액 속 포도당이 소변 배출되며 삼투압 증가, 당화혈색소 6.5% 진단 기준 및 6.5% 이하 조절 목표, 공복혈당과 식후 2시간 혈당 정상치'
  },
  {
    category: 'diabetes',
    name: '당뇨 클리닉',
    badge: '당뇨 클리닉',
    icon: 'fa-solid fa-droplet',
    gradient: 'card-header-gradient-7',
    topic: '당뇨병성 신증(신장 합병증) 조기 스크리닝: 소변 미세알부민뇨 검사의 중요성',
    keyPoints: '당뇨 환자의 30~40%가 신장 합병증 경험, 초기 무증상 단계를 잡는 미세알부민뇨/크레아티닌 비율(ACR) 검사, SGLT-2 억제제 및 ARB 계열 약제의 신장 보호 효과'
  },
  {
    category: 'diabetes',
    name: '당뇨 클리닉',
    badge: '당뇨 클리닉',
    icon: 'fa-solid fa-droplet',
    gradient: 'card-header-gradient-7',
    topic: '식후 혈당 스파이크를 잡는 식사 순서(채소-단백질-탄수화물)와 자가혈당 관리법',
    keyPoints: '급격한 혈당 상승이 혈관 내피세포 손상 유발, 식이섬유 선섭취를 통한 포도당 흡수 지연, 식후 30분 가벼운 걷기 운동의 인슐린 감수성 개선 효과, 정기 혈당 기록'
  }
];

// Pick a random topic from the curated pool
const selected = topicPool[Math.floor(Math.random() * topicPool.length)];
const todayTimestamp = Date.now();
const filename = `gyeyang-auto-${selected.category}-${todayTimestamp}.html`;

const prompt = `
당신은 인천 계양구 계산동에 위치한 '상우내과의원'의 수석 의학 콘텐츠 전문의이자 수석 카피라이터입니다.
환자들에게 전문적이면서도 깊이 있고 신뢰할 수 있는 최상급 의학 칼럼 HTML 원고를 작성해야 합니다.

# 선정된 주제
- 카테고리: ${selected.name}
- 주제: ${selected.topic}
- 핵심 의학 키워드 및 포함할 내용: ${selected.keyPoints}

# 필수 작성 가이드라인 (매우 중요 - 품질 및 분량 보장)
1. **풍부한 분량과 깊이 있는 전문성**:
   - 총 한글 글자수 **2,000자 ~ 3,000자 내외**의 매우 충실하고 상세한 의학 원고여야 합니다.
   - 피상적인 한두 문장 요약은 절대 금지하며, 각 단락마다 **병태생리 기전(왜 이런 현상이 일어나는지), 구체적 수치 기준(검사 수치, 목표치), 실생활 적용 수칙**을 명확하고 깊이 있게 서술하세요.
2. **구조화된 5개 이상의 대주제 (\`<h2>\`) 및 소주제 (\`<h3>\`)**:
   - 1. 질환/상태의 정의 및 병태생리적 발생 기전
   - 2. 주요 증상 및 놓치기 쉬운 조기 위험 신호
   - 3. 정확한 감별을 위한 의학적 검사 및 진단 기준 (수치 포함)
   - 4. 단계별 치료 전략 및 일상 속 핵심 관리 수칙
   - 5. 상우내과의원의 특화된 임상 역량 및 정기 관리의 중요성
3. **필수 시각화 및 정보 요소 포함 (HTML 태그 필수 사용)**:
   - **비교 분석 표 (\`<table class="post-table">\`)**: 최소 3~5행 이상의 표로 증상 비교, 검사 수치 기준, 단계별 차이, 또는 식이요법 권장/제한 식품표를 반드시 구성할 것 (\`<thead>\`, \`<tbody>\` 구조 준수).
   - **전문 학회 가이드라인 콜아웃 (\`<div class="post-callout">\`)**: 대한신장학회(KSN), 대한소화기내시경학회, 대한당뇨병학회 등의 최신 임상 지침이나 통계 수치를 강조 박스로 삽입할 것.
   - **실천 수칙 정보 박스 (\`<div class="info-box">\`)**: 환자가 일상에서 실천할 구체적인 행동 요령이나 주의사항을 불릿 포인트(\`<ul>\`, \`<li>\`)로 정리할 것.
4. **상우내과의원의 실질적 강점 자연스러운 융합**:
   - 신장내과 분과 전문의 상주 & 고효율 혈액투석 인공신장실 운영
   - 올림푸스 최상위 고해상도 내시경(OLYMPUS EVIS EXERA III CV-190) 및 당일 용종절제술(EMR)
   - 일차의료 만성질환관리 시범사업 참여 기관 & 당뇨 전담 코디네이터 상주 1:1 밀착 케어
   - 인천 계양구 계산역 4번 출구 앞 계산메디칼센타 2층 위치
5. **의료법 제56조 1항 철저 준수 (위반 시 법적 책임)**:
   - "최고", "완치", "1등", "대학병원급" 등 비교/과장/배타적 표현 절대 금지.
   - '박상우 원장' 등 특정 의사의 개인 실명 언급 금지. 반드시 "상우내과의원", "신장내과 전문의가 상주하여" 등 기관 및 전문의 자격 중심의 대표 화자(Clinic-centric)를 사용할 것.
   - 비뇨기과, 입원실/입원치료 관련 언급 절대 금지 (외래 및 인공신장실 통원 진료 중심).
6. **출력 형식**:
   - 오직 순수한 HTML 코드만 출력하세요. 마크다운 코드 블록(\`\`\`html 등)이나 불필요한 설명은 일절 포함하지 마세요.
   - METADATA의 title에는 ' | 상우내과의원'을 붙이지 마세요. 순수 포스트 제목만 적으세요.

# HTML 출력 템플릿:
<!--
METADATA:
title: [매력적이고 신뢰도 높은 제목 (병원명 제외)]
excerpt: [포스트 핵심을 담은 2-3문장의 완성도 높은 요약]
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
  <title>[포스트 제목] | 상우내과의원</title>
  <meta name="description" content="[SEO 최적화 1~2문장 요약]">
  <meta name="keywords" content="상우내과의원, 계양구 내과, 계산동 내과, 계산역 내과, ${selected.name}, [관련키워드1], [관련키워드2]">
  <meta name="author" content="상우내과의원">
  <link rel="stylesheet" href="../css/style.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Navigation -->
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
        <div class="post-meta">
          <span class="post-category-tag">${selected.badge}</span>
          <span class="post-publish-date">작성일: <span id="publish-date">PUBLISH_DATE</span></span>
        </div>
        
        <h1 class="post-detail-title">[포스트 제목]</h1>
        
        <div class="post-featured-banner ${selected.gradient}">
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; flex-direction: column; text-align: center; padding: 20px;">
            <i class="${selected.icon}" style="font-size: 4.5rem; margin-bottom: 20px; opacity: 0.9;"></i>
            <span style="font-size: 1.4rem; font-weight: 800; letter-spacing: -0.5px;">[전문적이고 세련된 배너 슬로건]</span>
            <p style="font-size: 0.95rem; opacity: 0.8; margin-top: 8px;">계양구 계산동 상우내과의원 ${selected.badge}</p>
          </div>
        </div>
        
        <div class="post-body">
          <p class="lead">[환자의 공감을 이끌어내고 질환의 중요성을 환기하는 전문적인 리드 문단 2~3문장]</p>

          <h2>1. [질환의 정의 및 발생 기전]</h2>
          <p>[상세한 의학적 설명 1]</p>
          <p>[상세한 의학적 설명 2]</p>

          <div class="post-callout">
            <p>
              <strong>💡 공신력 있는 의학 통계 및 임상 기준:</strong><br>
              [학회 가이드라인 및 주요 임상 수치 기준 상세 인용]
            </p>
          </div>

          <h2>2. [주요 증상 및 자가 진단 포인트]</h2>
          <p>[상세 증상 및 초기 vs 진행기 차이점 서술]</p>
          
          <table class="post-table">
            <thead>
              <tr>
                <th>구분 항목</th>
                <th>주요 특징 및 검사 수치</th>
                <th>임상적 의미 및 권장 조치</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>[항목 1]</strong></td>
                <td>[수치 및 특징 1]</td>
                <td>[조치 요령 1]</td>
              </tr>
              <tr>
                <td><strong>[항목 2]</strong></td>
                <td>[수치 및 특징 2]</td>
                <td>[조치 요령 2]</td>
              </tr>
              <tr>
                <td><strong>[항목 3]</strong></td>
                <td>[수치 및 특징 3]</td>
                <td>[조치 요령 3]</td>
              </tr>
            </tbody>
          </table>

          <h2>3. [정밀 진단 방법과 검사의 중요성]</h2>
          <p>[혈액검사, 소변검사, 내시경, 초음파 등 상우내과의원의 정밀 진단 과정 서술]</p>

          <div class="info-box">
            <h3><i class="fa-solid fa-notes-medical" style="color:var(--color-primary);"></i> [핵심 실천 및 주의 가이드]</h3>
            <ul>
              <li><strong>[핵심 수칙 1]:</strong> [상세 설명]</li>
              <li><strong>[핵심 수칙 2]:</strong> [상세 설명]</li>
              <li><strong>[핵심 수칙 3]:</strong> [상세 설명]</li>
            </ul>
          </div>

          <h2>4. [치료 전략 및 일상 속 관리 원칙]</h2>
          <p>[약물 치료, 식이요법, 생활습관 교정에 대한 체계적인 가이드라인 서술]</p>

          <h2>5. 상우내과의원의 전문 진료 시스템</h2>
          <p>[상우내과의원의 전문의 진료 환경 및 환자 맞춤 케어 시스템 소개와 따뜻한 당부의 말]</p>
        </div>

        <div class="medical-warning-box mt-5">
          <p>
            <strong>💡 의료법 제56조 1항에 따른 안내</strong><br>
            본 포스팅의 모든 내용은 상우내과의원에서 직접 작성하였습니다. 제공되는 건강 정보는 일반적인 의학적 지식이며 개별 환자의 특성에 따라 차이가 있을 수 있으므로, 정확한 진단과 치료를 위해서는 반드시 내원하여 진료를 받으시길 바랍니다.
          </p>
        </div>
      </article>

      <aside class="blog-sidebar">
        <!-- Clinic Info Card -->
        <div class="sidebar-card">
          <h4 class="sidebar-title">상우내과의원 안내</h4>
          <ul class="sidebar-info-list">
            <li><i class="fa-solid fa-clock"></i><div><strong>평일</strong> 09:00 - 18:00</div></li>
            <li><i class="fa-regular fa-calendar-check"></i><div><strong>토요일</strong> 09:00 - 13:00</div></li>
            <li><i class="fa-solid fa-phone-volume"></i><div><strong>예약 및 문의</strong><br>032-551-0860</div></li>
          </ul>
        </div>
        <!-- Other Blog Posts Card -->
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

async function run() {
  try {
    console.log(`[AI Generator] Selecting topic: "${selected.topic}" (${selected.name})...`);
    const result = await model.generateContent(prompt);
    let html = result.response.text();
    
    // Clean up Markdown code blocks if any
    html = html.replace(/^```html\s*/i, '').replace(/\s*```$/i, '').trim();
    
    const draftsDir = path.join(__dirname, '../drafts');
    if (!fs.existsSync(draftsDir)) {
      fs.mkdirSync(draftsDir, { recursive: true });
    }
    
    const draftPath = path.join(draftsDir, filename);
    fs.writeFileSync(draftPath, html, 'utf8');
    
    console.log(`[AI Generator] Successfully generated high-quality draft: ${filename}`);
  } catch (error) {
    console.error("[AI Generator] Error generating content:", error);
    process.exit(1);
  }
}

run();
