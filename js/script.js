document.addEventListener('DOMContentLoaded', () => {
  // --- Scrolled Header Effect ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
    });
  }

  // --- Automated Publishing Scheduling (Tuesday/Thursday) ---
  const urlParams = new URLSearchParams(window.location.search);
  const isPreview = urlParams.has('preview');

  // Helper to get current local date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  // Helper to generate future Tuesday/Thursday dates starting from a specific date
  const getUpcomingTueThuDates = (startDate, count) => {
    const dates = [];
    let current = new Date(startDate);
    
    // Move to tomorrow to start scheduling from the future
    current.setDate(current.getDate() + 1);

    while (dates.length < count) {
      const day = current.getDay(); // 0 = Sun, 2 = Tue, 4 = Thu
      if (day === 2 || day === 4) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const dateVal = String(current.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${dateVal}`);
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const searchInput = document.querySelector('.search-input');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const postCards = Array.from(document.querySelectorAll('.post-card-item'));

  // Separate hardcoded dates and auto-scheduled dates
  const autoCards = postCards.filter(card => card.getAttribute('data-publish-date') === 'auto');
  
  if (autoCards.length > 0) {
    // 1. Shuffle the auto-scheduled cards to randomize categories order
    for (let i = autoCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = autoCards[i];
      autoCards[i] = autoCards[j];
      autoCards[j] = temp;
    }

    // 2. Generate future Tuesday/Thursday slots starting from today
    const slots = getUpcomingTueThuDates(new Date(), autoCards.length);

    // 3. Assign randomized dates to the auto cards
    autoCards.forEach((card, index) => {
      const assignedDate = slots[index];
      card.setAttribute('data-publish-date', assignedDate);
      
      // Update the visible date indicator text on the card to show when it will appear/appeared
      const dateSpan = card.querySelector('.card-date');
      if (dateSpan) {
        dateSpan.textContent = assignedDate;
      }
    });
  }

  // First Pass: Apply Scheduling visibility filter
  postCards.forEach(card => {
    const publishDate = card.getAttribute('data-publish-date');
    if (publishDate && publishDate !== 'auto' && !isPreview) {
      if (publishDate > todayStr) {
        card.classList.add('unpublished-post');
      }
    }
  });

  let currentCategory = 'all';
  let searchQuery = '';

  function filterPosts() {
    let visibleCount = 0;
    
    postCards.forEach(card => {
      if (card.classList.contains('unpublished-post')) {
        card.style.display = 'none';
        card.style.opacity = '0';
        return;
      }

      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.querySelector('.card-title-link h2').textContent.toLowerCase();
      const cardExcerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
      
      const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
      const matchesSearch = cardTitle.includes(searchQuery) || cardExcerpt.includes(searchQuery);
      
      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    // Handle "No results" state
    const noResults = document.getElementById('no-results-msg');
    if (noResults) {
      if (visibleCount === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    }
  }

  // Category filter click event
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      filterPosts();
    });
  });

  // Search input typing event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterPosts();
    });
  }

  // Run initial filter to apply scheduling
  filterPosts();
});
