document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("card-container");

  try {
    const response = await fetch("/api/post");
    const data = await response.json();

    console.log("Fetched data:", data);

    // Ensure we are working with the posts array
    const posts = data.posts;

    if (!Array.isArray(posts)) {
      throw new Error("Invalid response format: 'posts' is not an array.");
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
    console.error("Failed to load cards:", error);
    container.innerHTML =
      "<p class='text-center text-lg text-red-500'>Failed to load posts.</p>";
  }
});