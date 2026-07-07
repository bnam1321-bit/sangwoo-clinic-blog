const fs = require('fs');
const path = require('path');

// Helper to get KST date string (YYYY-MM-DD)
const getTodayKST = () => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (3600000 * 9));
  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, '0');
  const day = String(kst.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const draftsDir = path.join(__dirname, '../drafts');
const blogDir = path.join(__dirname, '../blog');
const indexFile = path.join(__dirname, '../index.html');

// 1. Read all draft files
if (!fs.existsSync(draftsDir)) {
  console.log("No drafts directory found.");
  process.exit(0);
}

const drafts = fs.readdirSync(draftsDir).filter(file => file.endsWith('.html'));

if (drafts.length === 0) {
  console.log("No drafts remaining to publish.");
  process.exit(0);
}

// 2. Pick the first draft
const targetDraftName = drafts[0];
const draftPath = path.join(draftsDir, targetDraftName);
let draftContent = fs.readFileSync(draftPath, 'utf8');

const todayStr = getTodayKST();

// 3. Parse Metadata
const metadata = {};
const metadataMatch = draftContent.match(/<!--\r?\nMETADATA:\r?\ntitle:\s*(.*?)\r?\nexcerpt:\s*(.*?)\r?\ncategory:\s*(.*?)\r?\nbadge:\s*(.*?)\r?\nicon:\s*(.*?)\r?\ngradient:\s*(.*?)\r?\nfilename:\s*(.*?)\r?\n-->/s);

if (!metadataMatch) {
  console.log("Could not parse metadata from draft:", targetDraftName);
  process.exit(1);
}

metadata.title = metadataMatch[1].trim();
metadata.excerpt = metadataMatch[2].trim();
metadata.category = metadataMatch[3].trim();
metadata.badge = metadataMatch[4].trim();
metadata.icon = metadataMatch[5].trim();
metadata.gradient = metadataMatch[6].trim();
metadata.filename = metadataMatch[7].trim();

console.log("Target Draft Metadata:", metadata);

// 4. Update the draft file content (replace PUBLISH_DATE placeholder)
draftContent = draftContent.replace('PUBLISH_DATE', todayStr);

// Move file to blog/ directory
const publishedPath = path.join(blogDir, metadata.filename);
fs.writeFileSync(publishedPath, draftContent, 'utf8');
fs.unlinkSync(draftPath);

console.log(`Moved ${targetDraftName} to blog/${metadata.filename} and set publish date to ${todayStr}`);

// 5. Update index.html to insert the new card
let indexContent = fs.readFileSync(indexFile, 'utf8');

const newCardHtml = `        <!-- Post (${metadata.title}) - Published -->
        <article class="post-card post-card-item" data-category="${metadata.category}" data-publish-date="${todayStr}">
          <div class="card-header ${metadata.gradient}">
            <div class="card-header-content">
              <div class="card-meta-top">
                <span class="card-badge">${metadata.badge}</span>
                <span class="card-icon"><i class="${metadata.icon}"></i></span>
              </div>
              <a href="./blog/${metadata.filename}" class="card-title-link">
                <h2>${metadata.title}</h2>
              </a>
            </div>
          </div>
          <div class="card-body">
            <p class="card-excerpt">
              ${metadata.excerpt}
            </p>
            <div class="card-footer">
              <span class="card-date">${todayStr}</span>
              <a href="./blog/${metadata.filename}" class="card-readmore">자세히 보기 <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </article>

`;

const blogGridPattern = /<div class="blog-grid">\r?\n/;
if (!blogGridPattern.test(indexContent)) {
  console.log("Error: Could not find <div class=\"blog-grid\"> in index.html");
  process.exit(1);
}

indexContent = indexContent.replace(blogGridPattern, `<div class="blog-grid">\n${newCardHtml}`);
fs.writeFileSync(indexFile, indexContent, 'utf8');
console.log("Updated index.html with the new post card.");

// 6. Rebuild sidebar recommended links in all blog posts
const rebuildSidebars = () => {
  const allBlogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));
  
  // Read and parse all post details (title, date, url)
  const posts = allBlogFiles.map(filename => {
    const filePath = path.join(blogDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Get title
    const titleMatch = content.match(/<h1 class="post-detail-title">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : "건강 정보";
    
    // Get date
    const dateMatch = content.match(/<span class="post-publish-date">작성일:\s*(.*?)<\/span>/);
    const date = dateMatch ? dateMatch[1].trim() : "2026-06-30";
    
    return {
      filename,
      title,
      date,
      url: `./${filename}`
    };
  });

  // Sort posts by date descending
  posts.sort((a, b) => b.date.localeCompare(a.date));

  // Update sidebar in each blog post file
  allBlogFiles.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Filter out current post from sidebar recommended list (keep max 5 recommendations)
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
    } else {
      console.log(`Warning: Could not find sidebar recommended posts container in ${filename}`);
    }
  });

  console.log("Successfully rebuilt recommended health posts sidebars in all blog files.");
};

rebuildSidebars();
