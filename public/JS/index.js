      // Modal Handling
      const openBtn = document.getElementById("openSearchModal");
      const closeBtn = document.getElementById("closeSearchModal");
      const modal = document.getElementById("searchModal");
      const form = document.getElementById("searchForm");

      openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
      closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const category = form.category.value;
        window.location.href = `/search.html?category=${encodeURIComponent(
          category
        )}`;
      });

      async function openLogin(event){
          event.preventDefault();
            try {
        const response = await fetch('/login');
        const data = await response.json();
        if (data.email) {
          window.location.href = '/user-page.html';
        } else {
          window.location.href = '/account.html';
        }
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function openCreate(event){
          event.preventDefault();
            try {
        const response = await fetch('/login');
        const data = await response.json();
        if (data.email) {
          window.location.href = '/create.html';
        } else {
          window.location.href = '/account.html';
        }
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }