  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("card-container");

    // Get the "category" query param from the current URL
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    if (!category) {
      container.innerHTML = "<p class='text-center text-lg text-red-500'>No category selected.</p>";
      return;
    }

    const theme = category.toLowerCase();
    const apiUrl = `http://localhost:8000/api/post/theme/user-page?theme=${encodeURIComponent(theme)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const posts = data.posts;

      console.log("Fetched theme posts:", posts);

      if (!Array.isArray(posts) || posts.length === 0) {
        container.innerHTML = "<p class='text-center text-lg text-gray-500'>No posts found for this theme.</p>";
        return;
      }

      posts.forEach(post => {
        const card = document.createElement("a");
        card.href = "user-page.html";
        card.setAttribute("data-postid", post._id);
        card.className = "transform transition duration-300 hover:scale-105";

        // Save postId into sessionStorage on click
        card.addEventListener("click", () => {
          sessionStorage.setItem("postIdClicked", post._id);
        });

        const cardInner = document.createElement("div");
        cardInner.className = "glass p-6 rounded-xl shadow-xl space-y-4 cursor-pointer";

        const title = document.createElement("h2");
        title.className = "text-2xl font-bold";
        title.textContent = post.title || "Untitled Goodbye";

        const tone = document.createElement("p");
        tone.innerHTML = `<span class="font-semibold">Tone:</span> ${post.theme || "N/A"}`;

        const font = document.createElement("p");
        font.innerHTML = `<span class="font-semibold">Font:</span> ${post.font || "N/A"}`;

        const music = document.createElement("p");
        music.innerHTML = `<span class="font-semibold">Audio:</span> ${post.music || "N/A"}`;

        cardInner.append(title, tone, font, music);
        card.appendChild(cardInner);
        container.appendChild(card);
      });
    } catch (error) {
      console.error("Failed to load themed posts:", error);
      container.innerHTML =
        "<p class='text-center text-lg text-red-500'>Failed to load posts.</p>";
    }
  });