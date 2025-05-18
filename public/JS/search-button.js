// search-button.js

document.addEventListener('DOMContentLoaded', () => {
  // Modal Handling
  const openBtn = document.getElementById('openSearchModal');
  const closeBtn = document.getElementById('closeSearchModal');
  const modal = document.getElementById('searchModal');
  const form = document.getElementById('searchForm');

  if (openBtn && closeBtn && modal && form) {
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const category = form.category.value;
      window.location.href = `/search.html?category=${encodeURIComponent(category)}`;
    });
  }
});
