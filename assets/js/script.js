const container = document.querySelector('.card-container');
const cardInner = document.querySelector('.card-inner');
const glare = document.querySelector('.holo-glare');

let isFlipped = false;

const restingTransform = () =>
  `rotateX(0deg) rotateY(${isFlipped ? 180 : 0}deg)`;

container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

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
  }
});

container.addEventListener('mouseleave', () => {
  cardInner.style.transition = 'transform 0.5s ease-out';
  cardInner.style.transform = restingTransform();
  glare.style.transform = 'translate(0px, 0px) translateZ(1px)';
});

container.addEventListener('click', () => {
  isFlipped = !isFlipped;
  cardInner.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)';
  cardInner.style.transform = restingTransform();
});


/* ---------- Défilement doux vers les ancres (#projets…) ---------- */
const SCROLL_DURATION = 1500; // en millisecondes : plus grand = plus lent

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const startY = window.scrollY;
    const endY = target.getBoundingClientRect().top + startY;
    const startTime = performance.now();

    // accélère puis ralentit en douceur
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
      window.scrollTo(0, startY + (endY - startY) * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
});