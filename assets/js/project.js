/* ==========================================================
   PROJETS : pour en ajouter un, copie un objet dans la liste.
   `theme` donne la couleur de la carte (le bord reste gris) :
     solid       = couleur de l'intérieur
     accent      = couleur foncée (titre "Technologies" + bouton)
     accentLight = haut du dégradé du bouton
   ========================================================== */
const COLORS = {
  rouge:  { solid: '#e9573f', accent: '#6e120c', accentLight: '#a8261c' },
  bleu:   { solid: '#5fb0e8', accent: '#0f3a7a', accentLight: '#2563c9' },
  jaune:  { solid: '#f6cf3a', accent: '#6b4300', accentLight: '#a66c00' },
  gris:   { solid: '#c9c9c9', accent: '#333333', accentLight: '#6b6b6b' },
  vert:   { solid: '#86cc5f', accent: '#1d5418', accentLight: '#2f8a3a' },
  violet: { solid: '#b891d9', accent: '#48206b', accentLight: '#7a3fa6' },
};

const projects = [
  {
    title: 'Projet 1',
    type: 'Site web',
    year: 2026,
    image: 'assets/img/codeur.webp',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://example.com/projet-1',
    theme: COLORS.rouge,
  },
  {
    title: 'Projet 2',
    type: 'Application PHP',
    year: 2026,
    image: 'assets/img/codeur.webp',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['PHP', 'MySQL', 'CSS'],
    url: 'https://example.com/projet-2',
    theme: COLORS.bleu,
  },
  {
    title: 'Projet 3',
    type: 'Portfolio',
    year: 2026,
    image: 'assets/img/codeur.webp',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://example.com/projet-3',
    theme: COLORS.jaune,
  },
  {
    title: 'Projet 4',
    type: 'Site web',
    year: 2026,
    image: 'assets/img/codeur.webp',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://example.com/projet-4',
    theme: COLORS.gris,
  },
  {
    title: 'Projet 5',
    type: 'Application PHP',
    year: 2026,
    image: 'assets/img/codeur.webp',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['PHP', 'MySQL'],
    url: 'https://example.com/projet-5',
    theme: COLORS.vert,
  },
  {
    title: 'Projet 6',
    type: 'Site web',
    year: 2026,
    image: 'assets/img/codeur.webp',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://example.com/projet-6',
    theme: COLORS.violet,
  },
];

/* ---------- Génération des cartes ---------- */
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

/* Thème par carte : clés possibles dans `theme` → variables CSS */
const THEME_VARS = {
  border:      ['--card-border'],                    // bordure
  bgLight:     ['--card-bg-light'],                  // couleur claire de l'intérieur
  bgDark:      ['--card-bg-dark'],                   // couleur foncée de l'intérieur
  solid:       ['--card-bg-light', '--card-bg-dark'],// intérieur uni (raccourci)
  accent:      ['--card-accent'],                    // titre + bouton
  accentLight: ['--card-accent-light'],              // dégradé du bouton
};

const themeStyle = (theme = {}) =>
  Object.entries(theme)
    .filter(([key]) => THEME_VARS[key])
    .flatMap(([key, value]) => THEME_VARS[key].map((v) => `${v}: ${escapeHtml(value)}`))
    .join('; ');

const renderHeader = (p) => `
  <div class="card-header">
    <span class="card-stage">PROJET</span>
    <h3 class="card-name">${escapeHtml(p.title)}</h3>
    <span class="card-hp"><small>An</small>${escapeHtml(p.year)}</span>
  </div>`;

const renderFooter = (index, total) => `
  <footer class="card-footer">
    <span class="card-illus">Illus. Léonin</span>
    <span class="card-number"><b class="card-reg">D</b>${index + 1}/${total}</span>
  </footer>`;

const BACK_IMAGE = 'assets/img/back-cartes-internationales.webp';

const renderProject = (p, index, total) => `
  <a class="project" style="${themeStyle(p.theme)}; --deal-delay: ${index * 120}ms"
     href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer"
     aria-label="Carte face cachée : ${escapeHtml(p.title)}. Appuyez pour la retourner.">
    <div class="project-inner">

      <!-- RECTO : toutes les infos (visible une fois la carte retournée) -->
      <div class="card-face card-front">
        <div class="card-frame">
          <div class="card-shine"><div class="holo-glare"></div></div>
          ${renderHeader(p)}
          <div class="card-art">
            <img class="card-art-img" src="${escapeHtml(p.image)}" alt="Aperçu du projet ${escapeHtml(p.title)}" draggable="false" loading="lazy">
          </div>
          <div class="card-info">${escapeHtml(p.type)}</div>

          <section class="move">
            <div class="move-head"><h4 class="move-name">Description</h4></div>
            <p class="move-text">${escapeHtml(p.description)}</p>
          </section>

          <section class="move">
            <div class="move-head">
              <span class="move-tag move-tag-ability">Stack</span>
              <h4 class="move-name move-name-ability">Technologies</h4>
            </div>
            <ul class="project-tags">
              ${p.techs.map((t) => `<li class="project-tag">${escapeHtml(t)}</li>`).join('')}
            </ul>
          </section>

          <div class="project-cta">Voir le projet</div>
          ${renderFooter(index, total)}
        </div>
      </div>

      <!-- VERSO : dos de carte (visible au départ) -->
      <div class="card-face card-back">
        <img class="card-back-img" src="${BACK_IMAGE}" alt="" draggable="false">
        <span class="card-back-hint">Touchez-moi</span>
      </div>

    </div>
  </a>`;

const grid = document.getElementById('projects-grid');
const counter = document.getElementById('projects-counter');
const revealAllBtn = document.getElementById('reveal-all');

grid.innerHTML = projects.map((p, i) => renderProject(p, i, projects.length)).join('');
const cards = [...grid.querySelectorAll('.project')];

/* ---------- Retournement : face cachée → face visible, et ça reste ---------- */
const updateCounter = () => {
  const revealed = cards.filter((c) => c.classList.contains('is-revealed')).length;
  counter.textContent = revealed === cards.length
    ? `Toutes les cartes sont découvertes (${revealed}/${cards.length})`
    : `${revealed}/${cards.length} cartes découvertes`;
  revealAllBtn.hidden = revealed === cards.length;
};

const reveal = (card) => {
  if (card.classList.contains('is-revealed')) return;
  card.classList.add('is-revealed');
  card.setAttribute('aria-label', `Ouvrir le projet ${card.querySelector('.card-name').textContent}`);
  updateCounter();
};

cards.forEach((card) => {
  // Souris : la carte se retourne dès qu'on la survole
  card.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') reveal(card);
  });

  // Doigt / clavier / clic : 1er appui = retourner, 2e appui = ouvrir le projet
  card.addEventListener('click', (e) => {
    if (!card.classList.contains('is-revealed')) {
      e.preventDefault();
      reveal(card);
    }
  });

  // Petit effet holo qui suit la souris une fois retournée
  const glare = card.querySelector('.holo-glare');
  card.addEventListener('pointermove', (e) => {
    if (!card.classList.contains('is-revealed')) return;
    const rect = card.getBoundingClientRect();
    glare.style.transform = `translate(${(e.clientX - rect.left) * -0.5}px, ${(e.clientY - rect.top) * -0.5}px)`;
  });
});

revealAllBtn.addEventListener('click', () => {
  cards.forEach((card, i) => setTimeout(() => reveal(card), i * 150));
});

/* Les cartes sont "distribuées" quand la grille arrive à l'écran */
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) {
    grid.classList.add('is-dealt');
    obs.disconnect();
  }
}, { threshold: 0.15 }).observe(grid);

updateCounter();
