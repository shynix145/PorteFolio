/* ==========================================================
   FOND ÉTOILÉ INTERACTIF
   Des étoiles qui dérivent en fond de page
   (jaunes en mode nuit, pâles et discrètes en mode jour) :
   - deux étoiles proches se relient par un trait,
   - elles sont attirées par la souris / le doigt (et s'y relient),
   - elles s'écartent quand on clique ou tape sur l'écran.
   Réglages ci-dessous.
   ========================================================== */
(() => {
  const SETTINGS = {
    density: 0.00006,      // étoiles par pixel² (plus grand = plus d'étoiles)
    maxStars: 90,
    linkDistance: 150,     // distance max pour relier deux étoiles
    mouseRadius: 190,      // rayon d'influence de la souris
    speed: 0.04,           // vitesse de dérive (plus petit = plus lent)
  };

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let stars = [];

  // Couleur et intensité : lues dans les variables CSS --star et --star-strength
  // (assets/hero.css), une valeur pour le jour et une pour la nuit.
  let starColor = '240,170,0';
  let strength = 1;
  const readTheme = () => {
    const css = getComputedStyle(document.documentElement);
    starColor = css.getPropertyValue('--star').replace(/\s/g, '') || starColor;
    strength = parseFloat(css.getPropertyValue('--star-strength')) || 1;
  };
  const ripples = [];
  const pointer = { x: -9999, y: -9999, active: false };

  const rand = (min, max) => Math.random() * (max - min) + min;

  const makeStar = () => ({
    x: rand(0, width),
    y: rand(0, height),
    vx: rand(-SETTINGS.speed, SETTINGS.speed),
    vy: rand(-SETTINGS.speed, SETTINGS.speed),
    r: rand(4, 9),                 // taille de l'étoile
    rot: rand(0, Math.PI),         // orientation
    phase: rand(0, Math.PI * 2),   // décalage du scintillement
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = Math.min(SETTINGS.maxStars, Math.round(width * height * SETTINGS.density));
    while (stars.length < target) stars.push(makeStar());
    stars.length = target;
  };

  /* Étoile à 4 branches */
  const drawStar = (x, y, r, rot) => {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const radius = i % 2 === 0 ? r : r * 0.36;
      const angle = rot + (i * Math.PI) / 4;
      ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
  };

  /* ---------- Souris / doigt ---------- */
  const setPointer = (x, y) => {
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
  };
  const clearPointer = () => {
    pointer.active = false;
    pointer.x = pointer.y = -9999;
  };

  window.addEventListener('pointermove', (e) => setPointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener('pointerdown', (e) => {
    setPointer(e.clientX, e.clientY);
    ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.35 });
    // les étoiles proches sont repoussées
    stars.forEach((s) => {
      const dx = s.x - e.clientX;
      const dy = s.y - e.clientY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 220) {
        const force = ((220 - dist) / 220) * 1.2;
        s.vx += (dx / dist) * force;
        s.vy += (dy / dist) * force;
      }
    });
  }, { passive: true });
  window.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') clearPointer(); });
  document.addEventListener('pointerleave', clearPointer);
  window.addEventListener('blur', clearPointer);

  /* ---------- Animation ---------- */
  const step = (time = 0) => {
    ctx.clearRect(0, 0, width, height);

    // déplacement
    for (const s of stars) {
      if (pointer.active) {
        const dx = pointer.x - s.x;
        const dy = pointer.y - s.y;
        const dist = Math.hypot(dx, dy);
        if (dist < SETTINGS.mouseRadius && dist > 1) {
          const pull = (1 - dist / SETTINGS.mouseRadius) * 0.004;
          s.vx += (dx / dist) * pull;
          s.vy += (dy / dist) * pull;
        }
      }
      // freinage doux vers la vitesse de croisière
      if (Math.hypot(s.vx, s.vy) > SETTINGS.speed) {
        s.vx *= 0.96;
        s.vy *= 0.96;
      }
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < -20) s.x = width + 20;
      if (s.x > width + 20) s.x = -20;
      if (s.y < -20) s.y = height + 20;
      if (s.y > height + 20) s.y = -20;
    }

    // liens entre étoiles proches
    const maxD = SETTINGS.linkDistance;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < stars.length; i++) {
      const a = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= maxD * maxD) continue;
        const alpha = (1 - Math.sqrt(d2) / maxD) * 0.7 * strength;
        ctx.strokeStyle = `rgba(${starColor},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // liens vers la souris
    if (pointer.active) {
      for (const s of stars) {
        const dist = Math.hypot(s.x - pointer.x, s.y - pointer.y);
        if (dist < SETTINGS.mouseRadius) {
          ctx.strokeStyle = `rgba(${starColor},${(1 - dist / SETTINGS.mouseRadius) * 0.6 * strength})`;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    // étoiles (elles scintillent légèrement)
    for (const s of stars) {
      const near = pointer.active && Math.hypot(s.x - pointer.x, s.y - pointer.y) < SETTINGS.mouseRadius;
      const twinkle = 0.85 + 0.15 * Math.sin(time * 0.0008 + s.phase);
      ctx.fillStyle = `rgba(${starColor},${(near ? 1 : 0.85) * strength})`;
      drawStar(s.x, s.y, (near ? s.r + 1.5 : s.r) * twinkle, s.rot);
    }

    // onde de clic
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r += 6;
      r.alpha *= 0.93;
      ctx.strokeStyle = `rgba(${starColor},${r.alpha * strength})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
      if (r.alpha < 0.02) ripples.splice(i, 1);
    }
  };

  let running = false;
  const loop = (time) => {
    if (!running) return;
    step(time);
    requestAnimationFrame(loop);
  };
  const start = () => { if (!running) { running = true; requestAnimationFrame(loop); } };
  const stop = () => { running = false; };

  // pause quand l'onglet n'est pas visible (économise la batterie)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!reduceMotion) start();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); if (reduceMotion) step(); }, 120);
  });

  // changement de mode jour / nuit (envoyé par assets/js/script.js)
  document.addEventListener('themechange', () => { readTheme(); if (reduceMotion) step(); });

  readTheme();
  resize();
  if (reduceMotion) {
    step(); // image fixe, pas d'animation
  } else {
    start();
  }
})();
