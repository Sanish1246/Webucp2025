document.addEventListener("DOMContentLoaded", async () => {
  const postId = sessionStorage.getItem("postIdClicked");
  if (!postId) return;

  try {
    const response = await fetch(`/api/post/user-page?id=${encodeURIComponent(postId)}`);
    const data = await response.json();
    console.log(data);

    const post = data.post;
    if (!post) return;

    // Update font
    document.querySelectorAll(".font-type").forEach(el => el.textContent = post.font);
    document.body.style.fontFamily = post.font;

    // Update theme text in the page
    document.querySelectorAll(".theme-type").forEach(el => el.textContent = post.theme);

    // Normalize theme text to class format: lowercase, spaces replaced by dash
    // Also fix the special case if needed here or assume data is correct
    let themeClass = `theme-${post.theme.toLowerCase().replace(/\s+/g, '-')}`;

    // Remove any existing theme-xxx class from <html>
    const htmlTag = document.documentElement;
    htmlTag.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        htmlTag.classList.remove(cls);
      }
    });

    // Add the new theme class to <html>
    htmlTag.classList.add(themeClass);

    // Update music (commented out as before)
    // document.querySelectorAll(".audio-type").forEach(el => el.textContent = post.music);
    // document.querySelector(".audio-player source").src = `audio/${post.music.toLowerCase().replace(/\s+/g, '-')}.mp3`;
    // document.querySelector(".audio-player").load();

    // Update title
    document.querySelector(".title-type").textContent = post.title;

    // Clear old content blocks
    const container = document.querySelector(".media-type").parentElement.parentElement;
    container.innerHTML = "";

    // Insert message + media blocks
    post.content.forEach(block => {
      if (block.message) {
        const p = document.createElement("p");
        p.className = "text-lg leading-relaxed italic dynamic-font message-type";
        p.textContent = block.message;
        container.appendChild(p);
      }

      if (block.media) {
        const div = document.createElement("div");
        div.className = "rounded-lg overflow-hidden media-type";
        const img = document.createElement("img");
        img.src = `..${block.media}`;
        img.alt = "Scene";
        img.className = "max-w-xs max-h-64 w-auto h-auto object-contain dynamic-media";
        div.appendChild(img);
        container.appendChild(div);
      }
    });

  } catch (err) {
    console.error("Error fetching or rendering post:", err);
  }
});
