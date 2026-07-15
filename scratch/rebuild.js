const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../blog');
const allBlogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

const posts = allBlogFiles.map(filename => {
  const content = fs.readFileSync(path.join(blogDir, filename), 'utf8');
  
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(' | 상우내과의원', '').trim() : '';
  
  const dateMatch = content.match(/2026-\d{2}-\d{2}/);
  const date = dateMatch ? dateMatch[0] : "2026-06-30";
  
  return { filename, title, date, url: `./${filename}` };
});

posts.sort((a, b) => b.date.localeCompare(a.date));

allBlogFiles.forEach(filename => {
  const filePath = path.join(blogDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const otherPosts = posts.filter(p => p.filename !== filename).slice(0, 5);
  
  let sidebarHtml = `          <div class="sidebar-posts-list">\n`;
  otherPosts.forEach(op => {
    sidebarHtml += `            <div class="sidebar-post-item">
              <a href="${op.url}" class="sidebar-post-link">${op.title}</a>
              <span class="sidebar-post-date">${op.date}</span>
            </div>\n`;
  });
  sidebarHtml += `          </div>`;

  const sidebarPattern = /<div class="sidebar-posts-list">[\s\S]*?<\/div>\r?\n\s*<\/div>\r?\n\s*<\/aside>/;
  if (sidebarPattern.test(content)) {
    content = content.replace(sidebarPattern, `${sidebarHtml}\n        </div>\n      </aside>`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated sidebar in ${filename}`);
  } else {
    console.log(`Warning: Could not find sidebar container in ${filename}`);
  }
});
