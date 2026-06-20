// ============================================================
// A1 — Ambient fluid background (WebGPU / TSL)
// macOS Safari: canvas-2D glow trail (avoids WebGPU Metal quirks)
// Others: WebGPU Navier-Stokes fluid
// Paused when tab hidden / reduced-motion.
// ============================================================
(async function () {
  const cv = document.getElementById('bg-canvas');
  if (!cv) return;

  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;
  const IS_MAC_SAFARI = !IS_TOUCH && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  function markStatic() {
    document.body.classList.add('bg-static');
    cv.style.display = 'none';
  }

  if (PREFERS_REDUCED || !navigator.gpu) { markStatic(); return; }

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, IS_TOUCH ? 1.3 : 1.6);
    cv.width = Math.floor(window.innerWidth * dpr);
    cv.height = Math.floor(window.innerHeight * dpr);
  }
  sizeCanvas();

  // Shared palette
  const PALETTE = [
    [0.13, 0.20, 0.72],
    [0.10, 0.46, 0.88],
    [0.10, 0.64, 0.68],
    [0.30, 0.74, 0.46],
    [0.58, 0.28, 0.82],
    [0.86, 0.26, 0.54],
    [0.96, 0.48, 0.28],
  ];
  function paletteColor(t) {
    const n = PALETTE.length;
    const f = (t % n + n) % n;
    const i = Math.floor(f), j = (i + 1) % n, k = f - i;
    const a = PALETTE[i], b = PALETTE[j];
    return [a[0]+(b[0]-a[0])*k, a[1]+(b[1]-a[1])*k, a[2]+(b[2]-a[2])*k];
  }

  // ── macOS Safari: canvas-2D glow trail ──────────────────────────────────────
  if (IS_MAC_SAFARI) {
    runCanvasTrail();
    return;
  }

  // ── All other browsers: WebGPU fluid ────────────────────────────────────────
  let THREE;
  try {
    THREE = await import('three');
  } catch (e) {
    console.warn('[A1 bg] three.webgpu failed to load, using static background.', e);
    markStatic();
    return;
  }

  try {
    await runBackground(THREE);
  } catch (err) {
    console.warn('[A1 bg] WebGPU init failed, using static background.', err);
    markStatic();
  }

  // ── Canvas 2D glow trail (Safari) ───────────────────────────────────────────
  function runCanvasTrail() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const ctx = cv.getContext('2d');
    document.body.classList.add('bg-live');

    const DURATION = 2.2;   // seconds a trail point lives
    const BLOB_R   = 150;   // CSS-px radius of each glow blob

    const trail = [];
    let colorT = 0;
    let lastMoveT = -1e9;
    let pointerSeen = false;
    let lastX = 0, lastY = 0;

    window.addEventListener('pointermove', (e) => {
      const t = performance.now() / 1000;
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX; lastY = e.clientY;
      lastMoveT = t; pointerSeen = true;
      colorT += 0.05 + speed * 0.002;
      const [r, g, b] = paletteColor(colorT);
      trail.push({ x: e.clientX, y: e.clientY, r, g, b, born: t });
      if (trail.length > 500) trail.shift();
    }, { passive: true });

    window.addEventListener('pointerout', (e) => {
      if (!e.relatedTarget) pointerSeen = false;
    }, { passive: true });

    window.addEventListener('resize', () => { sizeCanvas(); });

    let running = true, rafId = 0;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { running = false; cancelAnimationFrame(rafId); }
      else if (!running) { running = true; rafId = requestAnimationFrame(frame); }
    });

    function frame() {
      if (!running) return;
      const now = performance.now() / 1000;
      const W = cv.width, H = cv.height;

      ctx.clearRect(0, 0, W, H);

      const cutoff = now - DURATION;
      while (trail.length > 0 && trail[0].born < cutoff) trail.shift();

      // 'lighter' = additive blend — colors accumulate like real light/dye
      ctx.globalCompositeOperation = 'lighter';

      for (const p of trail) {
        const age = now - p.born;
        const life = Math.max(0, 1 - age / DURATION);
        const alpha = Math.pow(life, 1.8) * 0.55;
        if (alpha < 0.008) continue;

        const px = p.x * dpr;
        const py = p.y * dpr;
        const rad = BLOB_R * dpr * (0.5 + 0.5 * life);

        const rr = Math.round(p.r * 255);
        const gg = Math.round(p.g * 255);
        const bb = Math.round(p.b * 255);

        const grd = ctx.createRadialGradient(px, py, 0, px, py, rad);
        grd.addColorStop(0,    `rgba(${rr},${gg},${bb},${alpha.toFixed(3)})`);
        grd.addColorStop(0.45, `rgba(${rr},${gg},${bb},${(alpha * 0.18).toFixed(3)})`);
        grd.addColorStop(1,    `rgba(0,0,0,0)`);

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
  }

  // ── WebGPU Navier-Stokes (Chrome / Firefox / iOS Safari) ────────────────────
  async function runBackground(THREE) {
    const {
      Fn, instanceIndex, textureStore, texture, uniform,
      uv, vec2, vec4, ivec2, int, float, min, clamp
    } = THREE;

    const renderer = new THREE.WebGPURenderer({ canvas: cv, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, IS_TOUCH ? 1.3 : 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    await renderer.init();
    document.body.classList.add('bg-live');

    const N = IS_TOUCH ? 110 : 128;
    const PRESSURE_ITERS = 12;
    const TEX = 1.0 / N;

    function mkTex() {
      const t = new THREE.StorageTexture(N, N);
      t.type = THREE.HalfFloatType;
      return t;
    }
    const velA = mkTex(), velB = mkTex();
    const dyeA = mkTex(), dyeB = mkTex();
    const prsA = mkTex(), prsB = mkTex();
    const divT = mkTex();

    const uMouseUV    = uniform(new THREE.Vector2(0.5, 0.5));
    const uMouseVel   = uniform(new THREE.Vector2(0, 0));
    const uMouseDown  = uniform(0.0);
    const uMouseColor = uniform(new THREE.Vector3(1, 1, 1));
    const uDt         = uniform(1 / 60);
    const uAspect     = uniform(new THREE.Vector2(1, 1));
    const uSplatSize  = uniform(0.05);

    const getCoord = () => {
      const ix = instanceIndex.modInt(N);
      const iy = instanceIndex.div(int(N));
      return { ix, iy, coord: ivec2(ix, iy), uvN: vec2(float(ix).add(0.5), float(iy).add(0.5)).div(float(N)) };
    };

    const splatVel = Fn(() => {
      const { coord, uvN } = getCoord();
      const d = uvN.sub(uMouseUV).mul(uAspect);
      const r2 = d.dot(d);
      const invR2 = float(1).div(uSplatSize.mul(uSplatSize));
      const falloff = r2.mul(invR2).negate().exp();
      const v0 = texture(velA, uvN).xy;
      const force = uMouseVel.mul(falloff).mul(uMouseDown).mul(0.95);
      const ex = uvN.x, ey = uvN.y;
      const edge = clamp(min(min(ex, ey), min(float(1).sub(ex), float(1).sub(ey))).mul(8.0), 0, 1);
      const v1 = v0.add(force).mul(edge);
      textureStore(velB, coord, vec4(v1, 0, 1));
    })().compute(N * N);

    const advectVel = Fn(() => {
      const { coord, uvN } = getCoord();
      const v = texture(velB, uvN).xy;
      const back = uvN.sub(v.mul(uDt));
      const sampled = texture(velB, back).xy;
      textureStore(velA, coord, vec4(sampled, 0, 1));
    })().compute(N * N);

    const divergence = Fn(() => {
      const { coord, uvN } = getCoord();
      const ox = vec2(TEX, 0), oy = vec2(0, TEX);
      const vL = texture(velA, uvN.sub(ox)).x;
      const vR = texture(velA, uvN.add(ox)).x;
      const vD = texture(velA, uvN.sub(oy)).y;
      const vU = texture(velA, uvN.add(oy)).y;
      const dv = vR.sub(vL).add(vU.sub(vD)).mul(0.5);
      textureStore(divT, coord, vec4(dv, 0, 0, 1));
    })().compute(N * N);

    const makeJacobi = (src, dst) => Fn(() => {
      const { coord, uvN } = getCoord();
      const ox = vec2(TEX, 0), oy = vec2(0, TEX);
      const pL = texture(src, uvN.sub(ox)).x;
      const pR = texture(src, uvN.add(ox)).x;
      const pD = texture(src, uvN.sub(oy)).x;
      const pU = texture(src, uvN.add(oy)).x;
      const dv = texture(divT, uvN).x;
      const p = pL.add(pR).add(pU).add(pD).sub(dv).mul(0.25);
      textureStore(dst, coord, vec4(p, 0, 0, 1));
    })().compute(N * N);
    const jacobiAB = makeJacobi(prsA, prsB);
    const jacobiBA = makeJacobi(prsB, prsA);

    const subtractGrad = Fn(() => {
      const { coord, uvN } = getCoord();
      const ox = vec2(TEX, 0), oy = vec2(0, TEX);
      const pL = texture(prsA, uvN.sub(ox)).x;
      const pR = texture(prsA, uvN.add(ox)).x;
      const pD = texture(prsA, uvN.sub(oy)).x;
      const pU = texture(prsA, uvN.add(oy)).x;
      const v = texture(velA, uvN).xy;
      const grad = vec2(pR.sub(pL), pU.sub(pD)).mul(0.5);
      const v1 = v.sub(grad).mul(0.994);
      textureStore(velB, coord, vec4(v1, 0, 1));
    })().compute(N * N);

    const copyVelBA = Fn(() => {
      const { coord, uvN } = getCoord();
      const v = texture(velB, uvN);
      textureStore(velA, coord, v);
    })().compute(N * N);

    const splatDye = Fn(() => {
      const { coord, uvN } = getCoord();
      const d = uvN.sub(uMouseUV).mul(uAspect);
      const r2 = d.dot(d);
      const dyeRadius = uSplatSize.mul(0.92);
      const invR2 = float(1).div(dyeRadius.mul(dyeRadius));
      const falloff = r2.mul(invR2).negate().exp();
      const oldC = texture(dyeA, uvN).xyz;
      const factor = falloff.mul(uMouseDown).mul(0.55);
      const newC = oldC.add(uMouseColor.sub(oldC).mul(factor));
      textureStore(dyeB, coord, vec4(newC, 1));
    })().compute(N * N);

    const advectDye = Fn(() => {
      const { coord, uvN } = getCoord();
      const v = texture(velA, uvN).xy;
      const back = uvN.sub(v.mul(uDt));
      const sampled = texture(dyeB, back).xyz;
      textureStore(dyeA, coord, vec4(sampled.mul(0.9925), 1));
    })().compute(N * N);

    const scene = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mat = new THREE.MeshBasicNodeMaterial();
    mat.transparent = true;
    mat.colorNode = texture(dyeA, uv()).xyz.toVec4();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(quad);

    function setAspect() {
      const w = window.innerWidth, h = window.innerHeight;
      if (w > h) uAspect.value.set(1, h / w);
      else uAspect.value.set(w / h, 1);
    }
    setAspect();

    let realUV = [0.5, 0.5];
    let realVel = [0, 0];
    let prevUV = null, prevT = performance.now();
    let lastMoveT = -1e9;
    let pointerSeen = false;

    function onMove(e) {
      const x = e.clientX, y = e.clientY;
      const u = x / window.innerWidth;
      const v = 1 - y / window.innerHeight;
      const t = performance.now();
      if (prevUV) {
        const dt = Math.max(0.008, (t - prevT) / 1000);
        realVel[0] = (u - prevUV[0]) / dt;
        realVel[1] = (v - prevUV[1]) / dt;
      }
      realUV = [u, v];
      prevUV = [u, v];
      prevT = t;
      lastMoveT = t;
      pointerSeen = true;
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerout', (e) => { if (!e.relatedTarget) pointerSeen = false; }, { passive: true });

    window.addEventListener('resize', () => {
      sizeCanvas();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      setAspect();
    });

    let colorT = 0;
    let running = true;
    let rafId = 0;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { running = false; cancelAnimationFrame(rafId); }
      else if (!running) { running = true; lastFrame = performance.now(); rafId = requestAnimationFrame(frame); }
    });

    let lastFrame = performance.now();
    function frame() {
      if (!running) return;
      const now = performance.now();
      const dt = Math.min(0.04, (now - lastFrame) / 1000);
      lastFrame = now;
      uDt.value = dt;

      const sinceMove = (now - lastMoveT) / 1000;
      const moveBoost = Math.max(0, 1 - sinceMove / 0.18);
      const intensity = pointerSeen ? 0.55 * moveBoost : 0;

      let vx = realVel[0], vy = realVel[1];
      const mag = Math.hypot(vx, vy), maxMag = 1.4;
      if (mag > maxMag) { vx = vx / mag * maxMag; vy = vy / mag * maxMag; }

      uMouseUV.value.set(realUV[0], realUV[1]);
      uMouseVel.value.set(vx, vy);
      uMouseDown.value = intensity;

      colorT += dt * 0.10 + mag * dt * 0.85;
      const c = paletteColor(colorT);
      uMouseColor.value.set(c[0], c[1], c[2]);

      const ops = [splatVel, advectVel, divergence];
      for (let i = 0; i < PRESSURE_ITERS / 2; i++) ops.push(jacobiAB, jacobiBA);
      ops.push(subtractGrad, copyVelBA, splatDye, advectDye);
      renderer.compute(ops);
      renderer.render(scene, cam);

      realVel[0] *= 0.84;
      realVel[1] *= 0.84;

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);
  }
})();
