document.addEventListener("DOMContentLoaded", async () => {
  const postId = sessionStorage.getItem("postIdClicked");
  if (!postId) return;

  const themeColors = {
    "dramatic": { background: "#ECE2D0", border: "#B29B7B" },
    "classy": { background: "#A7D3F4", border: "#4B9CD3" },
    "passive aggressive": { background: "#1C1C1E", border: "#555" },
    "honest": { background: "#A9C9A4", border: "#6A9B70" },
    "super cringe": { background: "#FFB087", border: "#D16C4B" },
    "ironic": { background: "#F87171", border: "#C53030" }
  };

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

    // Apply background and border color to .color-type elements
    const normalizedTheme = post.theme.toLowerCase();
    const themeColor = themeColors[normalizedTheme];
    if (themeColor) {
      document.querySelectorAll(".color-type").forEach(el => {
        el.style.backgroundColor = themeColor.background;
        el.style.borderColor = themeColor.border;
      });
    }

    // Update music
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
    }

    // Update title
    document.querySelector(".title-type").textContent = post.title;

    // Find the goodbye-card section and set data-postID
    const goodbyeCard = document.querySelector(".goodbye-card");
    if (goodbyeCard) {
      goodbyeCard.setAttribute("data-postID", post._id);
    }

    // Clear old content blocks inside the container (.media-type parent’s parent)
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
          const img = document.createElement("img");
          img.src = mediaPath;
          img.alt = "Scene";
          img.className = "max-w-xs max-h-64 w-auto h-auto object-contain dynamic-media";
          div.appendChild(img);
        } else if (["mp4", "webm", "ogg"].includes(ext)) {
          const video = document.createElement("video");
          video.src = mediaPath;
          video.controls = true;
          video.className = "max-w-xs max-h-64 w-auto h-auto dynamic-media";
          video.setAttribute("playsinline", "");
          div.appendChild(video);
        } else {
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

async function openLogin(event) {
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

const likeButton = document.getElementById("likeButton");
const heartIcon = document.getElementById("heartIcon");

likeButton.addEventListener("click", async () => {
  const isLiked = likeButton.getAttribute("data-liked") === "true";
  const newLikedState = !isLiked;

  likeButton.setAttribute("data-liked", newLikedState);
  heartIcon.setAttribute(
    "stroke",
    newLikedState ? "#DC2626" : "currentColor"
  );
  heartIcon.setAttribute("fill", newLikedState ? "#DC2626" : "none");
  likeButton.setAttribute(
    "title",
    newLikedState ? "Dislike this page" : "Like this page"
  );

  // Send PUT request to increment likes only if liking (not unliking)
  if (newLikedState) {
    const postId = sessionStorage.getItem("postIdClicked");
    if (!postId) return;

    try {
      const response = await fetch(`/api/post/likes/user-page?id=${encodeURIComponent(postId)}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        console.error("Failed to like post");
      } else {
        const result = await response.json();
        console.log("Post liked:", result);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }
});