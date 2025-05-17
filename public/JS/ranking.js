/* ─── TROPHY on the right canvas ────────────────────────────── */
(function() {
  const canvas = document.getElementById('trophyCanvas');
  const eng    = new BABYLON.Engine(canvas, true);
  const scene  = new BABYLON.Scene(eng);
  scene.clearColor = BABYLON.Color4(0,0,0,0);

  /* camera */
  const cam = new BABYLON.ArcRotateCamera(
      "cam", -Math.PI / 2, 1.2, 8,
      BABYLON.Vector3.Zero(), scene);
  cam.attachControl(canvas, true);

  /* head-mounted fill light so the trophy is always lit */
  const fill = new BABYLON.PointLight("fill", cam.position, scene);
  fill.parent    = cam;
  fill.intensity = 600;

  /* gold PBR material */
  const gold = new BABYLON.PBRMetallicRoughnessMaterial("gold", scene);
  gold.baseColor = new BABYLON.Color3(1.0, 0.78, 0.18);
  gold.metallic  = 1.0;
  gold.roughness = 0.18;

  /* ── build trophy ── */
  const b1 = BABYLON.MeshBuilder.CreateCylinder("b1",
             { diameter: 3.2, height: 0.3 }, scene);
  const b2 = BABYLON.MeshBuilder.CreateCylinder("b2",
             { diameter: 2.4, height: 0.25 }, scene);
  b2.position.y = 0.275;
  const base = BABYLON.Mesh.MergeMeshes([b1, b2], true, false, undefined, false, true);
  base.material = gold;

  const stem = BABYLON.MeshBuilder.CreateCylinder("stem",
               { diameterTop: 0.6, diameterBottom: 1, height: 1.6, tessellation: 32 }, scene);
  stem.position.y = 1.4;
  stem.material = gold;

  const profile = [
    new BABYLON.Vector3(0, 0), new BABYLON.Vector3(0.1, 0),
    new BABYLON.Vector3(0.15, 0.05), new BABYLON.Vector3(0.45, 0.5),
    new BABYLON.Vector3(0.6, 1.4), new BABYLON.Vector3(0.55, 1.6),
    new BABYLON.Vector3(0.4, 1.75), new BABYLON.Vector3(0, 1.8)
  ];
  const cup = BABYLON.MeshBuilder.CreateLathe("cup",
             { shape: profile, radius: 1.8, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
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
  const hR = BABYLON.MeshBuilder.CreateTube("hR", { path: handlePath(1),  radius: 0.12 }, scene);
  hL.material = hR.material = gold;

  /* parent & spin */
  const trophy = new BABYLON.TransformNode("pivot", scene);
  [base, stem, cup, hL, hR].forEach(m => m.parent = trophy);
  trophy.position.y = -2.0;
  trophy.scaling.scaleInPlace(0.8);
  scene.registerBeforeRender(() => {
    trophy.rotation.y += eng.getDeltaTime() * 0.0005;
  });

  /* internal warm glow */
  const trophyLight = new BABYLON.PointLight("trophyLight",
      new BABYLON.Vector3(0, 2.4, 0), scene);
  trophyLight.parent    = trophy;
  trophyLight.intensity = 1000;
  trophyLight.diffuse   = new BABYLON.Color3(1, 0.85, 0.3);

  // ─── 1) add an environment for beautiful metal reflections ───
const envHelper = scene.createDefaultEnvironment({
  createSkybox: false,    // we don't need a visible skybox
  createGround:  false    // no ground plane
});
// the helper automatically sets scene.environmentTexture
scene.environmentIntensity = 1.2;  // tweak between 0.5–2.0

// ─── 2) strengthen your fill light ───
fill.intensity = 1.8;  // from 0.6 → 1.8 (PBR wants real-world values)

// ─── 3) add a ring of warm directional accents ───
const accentDirs = [
  new BABYLON.Vector3( 1, -1,  0),
  new BABYLON.Vector3(-1, -1,  0),
  new BABYLON.Vector3( 0, -1,  1),
  new BABYLON.Vector3( 0, -1, -1)
];
accentDirs.forEach((dir, i) => {
  const a = new BABYLON.DirectionalLight(`accent${i}`, dir, scene);
  a.intensity       = 0.8;                   // strength
  a.diffuse         = new BABYLON.Color3(1, 0.95, 0.8);  // soft warm tint
  a.position        = dir.scale(-10);        // place it opposite the dir
  a.shadowEnabled   = false;                 // no shadows
});

  eng.runRenderLoop(() => scene.render());
  addEventListener('resize', () => eng.resize());

})();