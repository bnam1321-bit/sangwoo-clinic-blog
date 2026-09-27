const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../blog');
const files = [
  'gyeyang-auto-checkup-1789010863847.html',
  'gyeyang-auto-diabetes-1787620602604.html',
  'gyeyang-auto-hemodialysis-1788235026887.html',
  'gyeyang-auto-kidney-1788837962134.html'
];

const sidebarTemplate = `      <aside class="blog-sidebar">
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
</html>`;

files.forEach(f => {
  const filePath = path.join(blogDir, f);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // If it ends abruptly around <aside class="blog-sidebar">
  if (content.includes('<aside class="blog-sidebar">')) {
    content = content.replace(/<aside class="blog-sidebar">[\s\S]*$/, sidebarTemplate);
  } else {
    content += '\n' + sidebarTemplate;
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed:', f);
});
