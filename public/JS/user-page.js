document.addEventListener("DOMContentLoaded", async () => {
  const postId = sessionStorage.getItem("postIdClicked");
  if (!postId) return;

  try {
    const response = await fetch(`/api/post/user-page?id=${encodeURIComponent(postId)}`);
    const data = await response.json();
    console.log(data);

    const post = data.post;
    if (!post) return;

    // Update username
    document.querySelectorAll(".username").forEach(el => el.textContent = post.username);

    // Update font
    document.querySelectorAll(".font-type").forEach(el => el.textContent = post.font);
    document.body.style.fontFamily = post.font;

    // Update theme text
    document.querySelectorAll(".theme-type").forEach(el => el.textContent = post.theme);

    // Normalize theme text to class format: lowercase, spaces to dash
    const themeClass = `theme-${post.theme.toLowerCase().replace(/\s+/g, '-')}`;

    // Remove existing theme-* classes from <html>
    const htmlTag = document.documentElement;
    htmlTag.classList.forEach(cls => {
      if (cls.startsWith("theme-")) {
        htmlTag.classList.remove(cls);
      }
    });

    // Add new theme class to <html>
    htmlTag.classList.add(themeClass);

    // Update music (with try-catch for file errors)
    document.querySelectorAll(".audio-type").forEach(el => el.textContent = post.music);
    const audioPlayer = document.querySelector(".audio-player");
    const audioSource = audioPlayer.querySelector("source");
    const musicFileName = post.music.toLowerCase().replace(/\s+/g, '-') + ".mp3";

    try {
      audioSource.src = `sound/${musicFileName}`;
      audioPlayer.load();
      audioPlayer.loop = true;
      audioPlayer.play().catch(err => {
        console.warn("Audio play prevented:", err);
      });
    } catch (err) {
      console.error("Error loading or playing audio:", err);
      // Optionally fallback or hide audio player here
    }

    // Update title
    document.querySelector(".title-type").textContent = post.title;

    // Clear old content blocks
    const container = document.querySelector(".media-type").parentElement.parentElement;
    container.innerHTML = "";

    // Insert messages and media blocks dynamically
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

        const mediaPath = `..${block.media}`;
        const ext = mediaPath.split('.').pop().toLowerCase();

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
          // Image or GIF
          const img = document.createElement("img");
          img.src = mediaPath;
          img.alt = "Scene";
          img.className = "max-w-xs max-h-64 w-auto h-auto object-contain dynamic-media";
          div.appendChild(img);
        } else if (["mp4", "webm", "ogg"].includes(ext)) {
          // Video
          const video = document.createElement("video");
          video.src = mediaPath;
          video.controls = true;
          video.className = "max-w-xs max-h-64 w-auto h-auto dynamic-media";
          video.setAttribute("playsinline", "");
          div.appendChild(video);
        } else {
          // Unknown type fallback (link)
          const link = document.createElement("a");
          link.href = mediaPath;
          link.textContent = "View media";
          link.target = "_blank";
          div.appendChild(link);
        }

        container.appendChild(div);
      }
    });

  } catch (err) {
    console.error("Error fetching or rendering post:", err);
  }
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
