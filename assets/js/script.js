/* ==========================================================
   CARTE 3D DE L'ACCUEIL
   Inclinaison à la souris ET au doigt, clic / Entrée pour retourner.
   ========================================================== */
const container = document.querySelector('.card-container');
const cardInner = document.querySelector('.card-inner');
const glare = document.querySelector('.holo-glare');

let isFlipped = false;
let pointerDownAt = null;

const restingTransform = () => `rotateX(0deg) rotateY(${isFlipped ? 180 : 0}deg)`;

const tilt = (clientX, clientY) => {
  const rect = container.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  let rotateX = ((y - centerY) / centerY) * -20;
  let rotateY = ((x - centerX) / centerX) * 20;

  if (isFlipped) {
    rotateY += 180;
    rotateX = -rotateX;
  }

  cardInner.style.transition = 'transform 0.1s ease-out';
  cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  if (!isFlipped) {
    glare.style.transform = `translate(${x * -0.5}px, ${y * -0.5}px) translateZ(1px)`;
    glare.style.opacity = '1';
  }
};

const resetTilt = () => {
  cardInner.style.transition = 'transform 0.5s ease-out';
  cardInner.style.transform = restingTransform();
  glare.style.transform = 'translate(0px, 0px) translateZ(1px)';
  glare.style.opacity = '';
};

const flip = () => {
  isFlipped = !isFlipped;
  cardInner.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)';
  cardInner.style.transform = restingTransform();
};

if (container) {
  container.addEventListener('pointermove', (e) => tilt(e.clientX, e.clientY));
  container.addEventListener('pointerleave', resetTilt);
  container.addEventListener('pointercancel', resetTilt);

  // Un "vrai" clic/tap retourne la carte, un glissé du doigt ne fait que l'incliner
  container.addEventListener('pointerdown', (e) => { pointerDownAt = { x: e.clientX, y: e.clientY }; });
  container.addEventListener('pointerup', (e) => {
    if (!pointerDownAt) return;
    const moved = Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y);
    pointerDownAt = null;
    if (moved < 10) flip();
    if (e.pointerType !== 'mouse') setTimeout(resetTilt, 250);
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flip();
    }
  });
}

/* ==========================================================
   DÉFILEMENT DOUX VERS LES ANCRES (#projets…)
   ========================================================== */
const SCROLL_DURATION = 1200; // en millisecondes : plus grand = plus lent
const NAV_OFFSET = 70;        // hauteur de la barre de navigation

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const startY = window.scrollY;
    const endY = Math.max(0, target.getBoundingClientRect().top + startY - (target.id === 'accueil' ? 0 : NAV_OFFSET));
    const startTime = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
      window.scrollTo(0, startY + (endY - startY) * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
});

/* ==========================================================
   APPARITION DES SECTIONS AU DÉFILEMENT
   ========================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ==========================================================
   NAVIGATION : fond quand on défile + lien actif
   ========================================================== */
const nav = document.querySelector('.site-nav');
const onScroll = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach((s) => sectionObserver.observe(s));

/* ==========================================================
   MODE JOUR / NUIT
   Le thème de départ est posé dans index.html (petit script du <head>).
   Ici : le bouton du menu, et la mémorisation du choix.
   ========================================================== */
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', theme === 'night' ? 'Passer en mode jour' : 'Passer en mode nuit');
  }
  // prévient le fond étoilé (assets/js/background.js) pour qu'il change de couleur
  document.dispatchEvent(new CustomEvent('themechange'));
};

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'night' ? 'day' : 'night';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* stockage indisponible : tant pis */ }
  });
}
applyTheme(root.dataset.theme === 'night' ? 'night' : 'day');

/* Année du pied de page */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
