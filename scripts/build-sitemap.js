// Generates sitemap.xml and robots.txt for https://www.sanguim.co.kr
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

function buildSitemap() {
  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

  const posts = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.html'))
    .map(f => {
      const html = fs.readFileSync(path.join(blogDir, f), 'utf8');
      // Skip pages explicitly marked noindex
      if (/<meta name="robots" content="[^"]*noindex/i.test(html)) return null;
      return { loc: `${SITE}/blog/${encodeURI(f)}`, lastmod: getDate(html, today) };
    })
    .filter(Boolean)
    .sort((a, b) => b.lastmod.localeCompare(a.lastmod));

  const homeLastmod = posts.length ? posts[0].lastmod : today;

  const urls = [
    { loc: `${SITE}/`, lastmod: homeLastmod, changefreq: 'weekly', priority: '1.0' },
    ...posts.map(p => ({ ...p, changefreq: 'monthly', priority: '0.8' }))
  ];

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')
    + '\n</urlset>\n';

  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');

  const robots = 'User-agent: *\nAllow: /\nDisallow: /drafts/\nDisallow: /scripts/\n\n'
    + `Sitemap: ${SITE}/sitemap.xml\n`;
  fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');

  console.log(`[Sitemap] Wrote ${urls.length} URLs to sitemap.xml (+ robots.txt)`);
}

module.exports = buildSitemap;
if (require.main === module) buildSitemap();
