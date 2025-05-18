(function() {
  // Trophy Canvas Setup
  const canvas = document.getElementById('trophyCanvas');
  const eng = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(eng);
  scene.clearColor = BABYLON.Color4(0,0,0,0);

  const cam = new BABYLON.ArcRotateCamera("cam", -Math.PI / 2, 1.2, 8, BABYLON.Vector3.Zero(), scene);
  cam.attachControl(canvas, true);

  const fill = new BABYLON.PointLight("fill", cam.position, scene);
  fill.parent = cam;
  fill.intensity = 600;

  const gold = new BABYLON.PBRMetallicRoughnessMaterial("gold", scene);
  gold.baseColor = new BABYLON.Color3(1.0, 0.78, 0.18);
  gold.metallic = 1.0;
  gold.roughness = 0.18;

  const b1 = BABYLON.MeshBuilder.CreateCylinder("b1", { diameter: 3.2, height: 0.3 }, scene);
  const b2 = BABYLON.MeshBuilder.CreateCylinder("b2", { diameter: 2.4, height: 0.25 }, scene);
  b2.position.y = 0.275;
  const base = BABYLON.Mesh.MergeMeshes([b1, b2], true, false, undefined, false, true);
  base.material = gold;

  const stem = BABYLON.MeshBuilder.CreateCylinder("stem", { diameterTop: 0.6, diameterBottom: 1, height: 1.6, tessellation: 32 }, scene);
  stem.position.y = 1.4;
  stem.material = gold;

  const profile = [
    new BABYLON.Vector3(0, 0), new BABYLON.Vector3(0.1, 0),
    new BABYLON.Vector3(0.15, 0.05), new BABYLON.Vector3(0.45, 0.5),
    new BABYLON.Vector3(0.6, 1.4), new BABYLON.Vector3(0.55, 1.6),
    new BABYLON.Vector3(0.4, 1.75), new BABYLON.Vector3(0, 1.8)
  ];
  const cup = BABYLON.MeshBuilder.CreateLathe("cup", { shape: profile, radius: 1.8, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
  cup.scaling.x = cup.scaling.z = 1.5;
  cup.position.y = 2.4;
  cup.material = gold;

  const handlePath = sign => {
    const p0 = new BABYLON.Vector3(sign * 0.3, 2.0, 0);
    const p1 = new BABYLON.Vector3(sign * 2.0, 2.6, 0);
    const p2 = new BABYLON.Vector3(sign * 0.45, 3.1, 0);
    return BABYLON.Curve3.CreateQuadraticBezier(p0, p1, p2, 20).getPoints();
  };
  const hL = BABYLON.MeshBuilder.CreateTube("hL", { path: handlePath(-1), radius: 0.12 }, scene);
  const hR = BABYLON.MeshBuilder.CreateTube("hR", { path: handlePath(1), radius: 0.12 }, scene);
  hL.material = hR.material = gold;

  const trophy = new BABYLON.TransformNode("pivot", scene);
  [base, stem, cup, hL, hR].forEach(m => m.parent = trophy);
  trophy.position.y = -2.0;
  trophy.scaling.scaleInPlace(0.8);

  scene.registerBeforeRender(() => {
    trophy.rotation.y += eng.getDeltaTime() * 0.0005;
  });

  const trophyLight = new BABYLON.PointLight("trophyLight", new BABYLON.Vector3(0, 2.4, 0), scene);
  trophyLight.parent = trophy;
  trophyLight.intensity = 1000;
  trophyLight.diffuse = new BABYLON.Color3(1, 0.85, 0.3);

  const envHelper = scene.createDefaultEnvironment({
    createSkybox: false,
    createGround: false
  });
  scene.environmentIntensity = 1.2;

  fill.intensity = 1.8;

  const accentDirs = [
    new BABYLON.Vector3( 1, -1,  0),
    new BABYLON.Vector3(-1, -1,  0),
    new BABYLON.Vector3( 0, -1,  1),
    new BABYLON.Vector3( 0, -1, -1)
  ];
  accentDirs.forEach((dir, i) => {
    const a = new BABYLON.DirectionalLight(`accent${i}`, dir, scene);
    a.intensity = 0.8;
    a.diffuse = new BABYLON.Color3(1, 0.95, 0.8);
    a.position = dir.scale(-10);
    a.shadowEnabled = false;
  });

  eng.runRenderLoop(() => scene.render());
  addEventListener('resize', () => eng.resize());

  // --- Posts Fetch and Display ---
  document.addEventListener("DOMContentLoaded", async () => {
    const rankingList = document.getElementById("rankingList");
    rankingList.innerHTML = ""; // clear old content

    try {
      const response = await fetch("http://localhost:8000/api/post/likes/user-page");
      const data = await response.json();

      const posts = data.posts;
      if (!Array.isArray(posts)) throw new Error("Invalid posts format");

      posts.forEach(post => {
        // Container consistent with category.js style
        const card = document.createElement("div");
        card.className = "category-card"; // use your existing category.js style class
        card.style.cursor = "pointer";
        card.style.marginBottom = "1.5rem";

        // clickable anchor wrapping the card
        const anchor = document.createElement("a");
        anchor.href = "user-page.html";
        anchor.setAttribute("data-postid", post._id);
        anchor.style.textDecoration = "none";
        anchor.style.color = "inherit"; // so text inherits color, not default link color

        anchor.addEventListener("click", () => {
          sessionStorage.setItem("postIdClicked", post._id);
        });

        // Title
        const title = document.createElement("h3");
        title.textContent = post.title || "Untitled Post";
        title.className = "category-card-title"; // if you have a title class

        // Info block
        const infoBlock = document.createElement("div");
        infoBlock.className = "category-card-info"; // adapt or remove, based on your styles

        infoBlock.innerHTML = `
          <p><strong>By:</strong> ${post.username}</p>
          <p><strong>❤️ Likes:</strong> ${post.likes}</p>
          <p><strong>Tone:</strong> ${post.theme}</p>
          <p><strong>Font:</strong> ${post.font}</p>
          <p><strong>Music:</strong> ${post.music}</p>
        `;

        card.appendChild(title);
        card.appendChild(infoBlock);

        // Preview message and media if any
        const preview = post.content?.[0];
        if (preview) {
          const previewMessage = document.createElement("p");
          previewMessage.innerHTML = `<strong>Preview:</strong> ${preview.message || "No message"}`;
          card.appendChild(previewMessage);

          if (preview.media) {
            const img = document.createElement("img");
            img.src = preview.media;
            img.alt = "Media preview";
            img.className = "category-card-media"; // style accordingly
            img.style.maxWidth = "100%";
            img.style.borderRadius = "8px";
            img.style.marginTop = "0.5rem";
            card.appendChild(img);
          }
        }

        anchor.appendChild(card);
        rankingList.appendChild(anchor);
      });
    } catch (error) {
      console.error("Failed to fetch or display top posts:", error);
      rankingList.innerHTML =
        "<p style='color: red; text-align: center;'>Failed to load top posts.</p>";
    }
  });

})();
