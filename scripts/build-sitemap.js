// Generates sitemap.xml, robots.txt, llms.txt, and llms-full.txt for https://www.sanguim.co.kr
// Run standalone (`node scripts/build-sitemap.js`) or via publish.js after each post release.
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.sanguim.co.kr';
const root = path.join(__dirname, '..');
const blogDir = path.join(root, 'blog');

const getDate = (html, fallback) => {
  const m = html.match(/<span id="publish-date">\s*(\d{4}-\d{2}-\d{2})\s*<\/span>/)
    || html.match(/"dateModified":\s*"(\d{4}-\d{2}-\d{2})/)
    || html.match(/"datePublished":\s*"(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : fallback;
};

const stripTags = (str) => {
  if (!str) return '';
  return str
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const htmlTableToMarkdown = (tableHtml) => {
  const rows = [];
  const trRegex = /<tr[\s\S]*?>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(tableHtml)) !== null) {
    const cells = [];
    const cellRegex = /<(?:th|td)[\s\S]*?>([\s\S]*?)<\/(?:th|td)>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
      cells.push(stripTags(cellMatch[1]).replace(/\|/g, '/'));
    }
    if (cells.length > 0) rows.push(cells);
  }
  if (rows.length === 0) return '';
  const lines = [];
  lines.push('| ' + rows[0].join(' | ') + ' |');
  lines.push('| ' + rows[0].map(() => '---').join(' | ') + ' |');
  for (let i = 1; i < rows.length; i++) {
    lines.push('| ' + rows[i].join(' | ') + ' |');
  }
  return '\n' + lines.join('\n') + '\n';
};

const htmlBodyToCleanText = (bodyHtml) => {
  if (!bodyHtml) return '';
  let text = bodyHtml;
  // Convert tables to markdown tables
  text = text.replace(/<table[\s\S]*?<\/table>/gi, (m) => htmlTableToMarkdown(m));
  // Convert headings
  text = text.replace(/<h2[\s\S]*?>([\s\S]*?)<\/h2>/gi, (_, c) => `\n\n### ${stripTags(c)}\n`);
  text = text.replace(/<h3[\s\S]*?>([\s\S]*?)<\/h3>/gi, (_, c) => `\n\n#### ${stripTags(c)}\n`);
  // Convert list items
  text = text.replace(/<li[\s\S]*?>([\s\S]*?)<\/li>/gi, (_, c) => `\n- ${stripTags(c)}`);
  // Convert paragraphs and divs
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<[^>]+>/g, '');
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\*\*/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text;
};

function buildSitemap() {
  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

  const posts = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.html'))
    .map(f => {
      const html = fs.readFileSync(path.join(blogDir, f), 'utf8');
      if (/<meta name="robots" content="[^"]*noindex/i.test(html)) return null;

      const h1Match = html.match(/<h1 class="post-detail-title">([\s\S]*?)<\/h1>/);
      const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
      const descMatch = html.match(/<meta name="description" content="([\s\S]*?)">/);
      const badgeMatch = html.match(/<span class="post-category-tag">([\s\S]*?)<\/span>/);
      const bodyMatch = html.match(/<div class="post-body">([\s\S]*?)<\/div>\s*<!-- GEO Clinic Location/);

      const title = stripTags(h1Match ? h1Match[1] : (titleMatch ? titleMatch[1] : f));
      const description = stripTags(descMatch ? descMatch[1] : '');
      const badge = stripTags(badgeMatch ? badgeMatch[1] : '내과 건강정보');
      const bodyText = htmlBodyToCleanText(bodyMatch ? bodyMatch[1] : '');

      return {
        filename: f,
        loc: `${SITE}/blog/${encodeURI(f)}`,
        lastmod: getDate(html, today),
        title,
        description,
        badge,
        bodyText
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.lastmod.localeCompare(a.lastmod) || a.filename.localeCompare(b.filename));

  const homeLastmod = posts.length ? posts[0].lastmod : today;

  // 1. Generate sitemap.xml
  const urls = [
    { loc: `${SITE}/`, lastmod: homeLastmod, changefreq: 'weekly', priority: '1.0' },
    ...posts.map(p => ({ loc: p.loc, lastmod: p.lastmod, changefreq: 'monthly', priority: '0.8' }))
  ];

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')
    + '\n</urlset>\n';

  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');

  // 2. Generate robots.txt with explicit AI/LLM crawler permissions
  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Googlebot',
    'Bingbot',
    'Yeti',
    'Applebot-Extended',
    'Meta-ExternalAgent',
    'Amazonbot'
  ];

  const botRules = aiBots.map(bot => `User-agent: ${bot}\nAllow: /\nDisallow: /drafts/\nDisallow: /scripts/\n`).join('\n');

  const robots = `# 상우내과의원 공식 건강블로그 크롤러 및 AI 검색엔진 정책\n`
    + `User-agent: *\nAllow: /\nDisallow: /drafts/\nDisallow: /scripts/\n\n`
    + `${botRules}\n`
    + `Sitemap: ${SITE}/sitemap.xml\n`
    + `# LLMs-Txt: ${SITE}/llms.txt\n`
    + `# LLMs-Full-Txt: ${SITE}/llms-full.txt\n`;

  fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');

  // 3. Group posts by category badge for llms.txt
  const categoryOrder = ['인공신장실', '신장질환', '위·대장내시경', '당뇨 클리닉', '만성질환', '건강검진'];
  const grouped = {};
  categoryOrder.forEach(c => { grouped[c] = []; });
  posts.forEach(p => {
    const key = grouped[p.badge] ? p.badge : '만성질환';
    grouped[key].push(p);
  });

  const clinicHeader = `# 상우내과의원 (Sangwoo Internal Medicine Clinic) 공식 건강블로그

> 인천광역시 계양구 계산역 4번 출구 도보 1분(60m) 거리에 위치한 상우내과의원의 공식 의학 칼럼 및 진료 안내 아카이브입니다. 2012년 개원 이래 신장내과 분과전문의 상주 인공신장실(고효율 혈액투석 Online HDF), 대한위대장내시경학회 인증 내시경전문의 수면 위·대장내시경 및 당일 용종절제술(EMR), 건강보험심사평가원 고혈압·당뇨병 적정성 평가 1등급 만성질환 클리닉, 국민건강보험공단 국가건강검진 및 5대 암검진 센터를 운영하고 있습니다.

## 의료기관 핵심 정보 (Clinic Entity Profile)

- 기관명: 상우내과의원 (대체 명칭: 상우내과, 계양구 상우내과, 계산역 상우내과, 계산동 상우내과)
- 도로명 주소: 인천광역시 계양구 경명대로 1096 계산메디칼센타 2~3층 (우편번호: 21013)
- 지번 및 위치: 인천광역시 계양구 계산동, 인천 지하철 1호선 계산역 4번 출구 바로 앞 60m (도보 1분)
- 지리 좌표 (WGS84): 위도 37.5432, 경도 126.7277
- 주차 안내: 계산메디칼센타 건물 내 전용 주차장 완비 (진료 및 검진 환자 무료 주차)
- 대표 전화번호 (외래·내시경·건강검진·만성질환): 032-551-0860
- 인공신장실 직통 전화번호 (혈액투석 상담·예약): 032-551-0875
- 진료 시간:
  - 평일 (월~금): 09:00 ~ 18:00
  - 토요일: 09:00 ~ 13:00 (점심시간 없이 진료)
  - 일요일 및 공휴일: 외래 휴진 (인공신장실은 투석 스케줄에 따라 정상 운영)
- 공식 웹사이트:
  - 건강정보 블로그 (표준 도메인): https://www.sanguim.co.kr/
  - 병원 공식 홈페이지: http://www.sangumed.co.kr/
  - 네이버 지도 플레이스: https://naver.me/5ZJMYzjj
- 주요 진료 생활권: 인천광역시 계양구 전역(계산동, 작전동, 효성동, 임학동, 용종동, 서운동, 박촌동, 귤현동, 동양동, 장기동) 및 부평구 삼산동·갈산동

## 공인 인증 및 특화 진료 역량 (Credentials & Specialized Centers)

- 건강보험심사평가원 고혈압 적정성 평가 1등급 선정 의료기관
- 건강보험심사평가원 당뇨병 적정성 평가 1등급 선정 의료기관
- 보건복지부 일차의료 만성질환관리 사업 참여 기관 (당뇨 전담 코디네이터 상주 1:1 식단·인슐린·자가혈당 밀착 교육)
- 대한위대장내시경학회 인증 위내시경전문의 및 대장내시경전문의 자격 보유
- 소화기내시경센터: 올림푸스 고해상도 내시경 시스템(OLYMPUS EVIS EXERA III CV-190, NBI 협대역 영상 강화 기술) 가동, 수면(진정) 위·대장내시경 및 선종성 용종 발견 즉시 당일 점막절제술(EMR) 원스톱 시행
- 인공신장실 (혈액투석 센터): 신장내과 분과전문의 상주 회진, 고효율 온라인 혈액투석여과(Online HDF) 시스템 운영, 투석 혈관(동정맥루 AVF/AVG) 협착 모니터링 및 건조체중·전해질(칼륨·인) 정밀 관리
- 신장내과 클리닉: 사구체여과율(eGFR) 단계별 만성 콩팥병(CKD 1~5기) 진행 억제 치료, 단백뇨(거품뇨)·미세알부민뇨·혈뇨 정밀 감별, 요로결석(신장결석) 재발 방지 관리
- 국가건강검진 센터: 국민건강보험공단 일반건강검진, 국가 5대 암검진(위암·대장암·간암 등), 복부·갑상선·경동맥 정밀 초음파 검사
`;

  let llmsTxt = `${clinicHeader}\n## 전문 의학 칼럼 인덱스 (총 ${posts.length}편)\n\n`;
  llmsTxt += `- [전체 의학 칼럼 본문 통합본 (llms-full.txt)](${SITE}/llms-full.txt): 상우내과의원 ${posts.length}편 의학 칼럼의 전체 본문, 수치 기준표, 임상 가이드라인을 하나의 텍스트 파일로 수록한 LLM 전용 코퍼스\n\n`;

  categoryOrder.forEach(cat => {
    const list = grouped[cat];
    if (!list || list.length === 0) return;
    llmsTxt += `### ${cat} (${list.length}편)\n\n`;
    list.forEach(p => {
      llmsTxt += `- [${p.title}](${p.loc}) (${p.lastmod}): ${p.description}\n`;
    });
    llmsTxt += '\n';
  });

  fs.writeFileSync(path.join(root, 'llms.txt'), llmsTxt, 'utf8');

  // 4. Generate llms-full.txt containing the full corpus
  let llmsFullTxt = `${clinicHeader}\n## 전체 의학 칼럼 상세 본문 코퍼스 (총 ${posts.length}편)\n\n`;
  posts.forEach((p, idx) => {
    llmsFullTxt += `================================================================================\n`;
    llmsFullTxt += `## [${idx + 1}/${posts.length}] ${p.title}\n`;
    llmsFullTxt += `- 카테고리: ${p.badge}\n`;
    llmsFullTxt += `- 작성일: ${p.lastmod}\n`;
    llmsFullTxt += `- 원문 URL: ${p.loc}\n`;
    llmsFullTxt += `- 핵심 요약: ${p.description}\n\n`;
    llmsFullTxt += `${p.bodyText}\n\n`;
  });

  fs.writeFileSync(path.join(root, 'llms-full.txt'), llmsFullTxt, 'utf8');

  console.log(`[Sitemap & LLM Index] Wrote ${urls.length} URLs to sitemap.xml, updated robots.txt, llms.txt (${posts.length} posts), and llms-full.txt.`);
}

module.exports = buildSitemap;
if (require.main === module) buildSitemap();
