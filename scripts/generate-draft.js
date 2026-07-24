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
// Using gemini-2.5-flash as it is fast and capable
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const categories = [
  { id: 'hemodialysis', name: '인공신장실/혈액투석', badge: '인공신장실', icon: 'fa-solid fa-heart-pulse', gradient: 'card-header-gradient-6' },
  { id: 'endoscopy', name: '위·대장내시경', badge: '위·대장내시경', icon: 'fa-solid fa-stethoscope', gradient: 'card-header-gradient-2' },
  { id: 'checkup', name: '건강검진', badge: '건강검진', icon: 'fa-solid fa-clipboard-user', gradient: 'card-header-gradient-3' },
  { id: 'chronic', name: '만성질환', badge: '만성질환', icon: 'fa-solid fa-capsules', gradient: 'card-header-gradient-4' },
  { id: 'kidney', name: '신장질환/콩팥건강', badge: '신장질환', icon: 'fa-solid fa-vial-circle-check', gradient: 'card-header-gradient-1' },
  { id: 'diabetes', name: '당뇨 클리닉', badge: '당뇨 클리닉', icon: 'fa-solid fa-droplet', gradient: 'card-header-gradient-7' }
];

// Pick a random category
const category = categories[Math.floor(Math.random() * categories.length)];
const todayTimestamp = Date.now();
const filename = `gyeyang-auto-${category.id}-${todayTimestamp}.html`;

const prompt = `
당신은 '상우내과의원'의 수석 마케터이자 전문 의학 복사 라이터입니다.
다음 가이드를 반드시 준수하여 병원 공식 블로그용 최상급 HTML 원고를 하나 작성하세요.

# 주제 카테고리: ${category.name}
(위 카테고리와 관련된 유익하고 전문적인 건강 정보 주제를 하나 선정해서 글을 작성하세요.)

# 필수 준수 규칙 (의료법 및 브랜딩)
1. 타 병원 비교, 최고, 완치 등의 과장 광고 금지 (의료법 56조 1항 준수)
2. '박상우 원장' 실명 언급 금지. 반드시 "상우내과의원에서는..." 또는 "내과 전문의가 상주하여..." 등으로 객관적이고 대표성 있는 화자(Clinic-centric)를 사용할 것.
3. 비뇨기과, 입원 관련 내용 절대 포함 금지 (상우내과의원은 외래 및 인공신장실 전문 내과임).
4. 출력은 오직 순수한 HTML 코드만 제공해야 하며, 마크다운 코드 블록(\`\`\`html 등)은 포함하지 마세요.

# HTML 레이아웃 구조 가이드
반드시 아래의 구조를 그대로 사용하여 작성하세요. (내용만 주제에 맞게 변경)

<!--
METADATA:
title: [여기에 매력적인 포스트 제목 작성]
excerpt: [여기에 2-3문장 요약 작성]
category: ${category.id}
badge: ${category.badge}
icon: ${category.icon}
gradient: ${category.gradient}
filename: ${filename}
-->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[포스트 제목] | 상우내과의원</title>
  <meta name="description" content="[SEO 요약 1문장]">
  <meta name="keywords" content="상우내과의원, 계양구 내과, 계산동 내과, ${category.name}">
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
          <span class="post-category-tag">${category.badge}</span>
          <span class="post-publish-date">작성일: <span id="publish-date">auto</span></span>
        </div>
        
        <h1 class="post-detail-title">[여기에 매력적인 포스트 제목 작성]</h1>
        
        <div class="post-featured-banner ${category.gradient}">
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; flex-direction: column; text-align: center; padding: 20px;">
            <i class="${category.icon}" style="font-size: 4.5rem; margin-bottom: 20px; opacity: 0.9;"></i>
            <span style="font-size: 1.4rem; font-weight: 800; letter-spacing: -0.5px;">[배너 짧은 소제목]</span>
            <p style="font-size: 0.95rem; opacity: 0.8; margin-top: 8px;">계양구 상우내과의원 ${category.badge}</p>
          </div>
        </div>
        
        <div class="post-body">
          <p class="lead">[도입부 문단]</p>
          
          <h2>1. [소주제 1]</h2>
          <p>[본문 내용]</p>
          
          <div class="info-box">
             <ul>
               <li><strong>[포인트 1]:</strong> [설명]</li>
               <li><strong>[포인트 2]:</strong> [설명]</li>
             </ul>
          </div>
          
          <h2>2. [소주제 2]</h2>
          <p>[본문 내용]</p>

          <p>상우내과의원에서는 ... [병원 장점 어필 마무리]</p>
        </div>

        <div class="medical-warning-box mt-5">
          <p>
            <strong>💡 의료법 제56조 1항에 따른 안내</strong><br>
            본 포스팅의 모든 내용은 상우내과의원에서 직접 작성하였습니다. 제공되는 건강 정보는 일반적인 의학적 지식이며 개별 환자의 특성에 따라 차이가 있을 수 있으므로, 정확한 진단과 치료를 위해서는 반드시 내원하여 진료를 받으시길 바랍니다.
          </p>
        </div>
      </article>

      <aside class="blog-sidebar">
        <!-- Sidebar placeholder -->
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

async function run() {
  try {
    console.log(`Generating draft for category: ${category.name}...`);
    const result = await model.generateContent(prompt);
    let html = result.response.text();
    
    // Clean up Markdown formatting if any
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');
    
    const draftsDir = path.join(__dirname, '../drafts');
    if (!fs.existsSync(draftsDir)) {
      fs.mkdirSync(draftsDir, { recursive: true });
    }
    
    const draftPath = path.join(draftsDir, filename);
    fs.writeFileSync(draftPath, html, 'utf8');
    
    console.log(`Successfully generated draft: ${filename}`);
  } catch (error) {
    console.error("Error generating content:", error);
    process.exit(1);
  }
}

run();
