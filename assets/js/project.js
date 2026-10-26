/* ==========================================================
   PROJETS : pour en ajouter un, copie un objet dans la liste.
   ========================================================== */
const projects = [
  {
    title: 'Projet 1',
    type: 'Site web',
    year: 2026,
    image: 'assets/img/codeur.jpeg',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://example.com/projet-1',
  },
  {
    title: 'Projet 2',
    type: 'Application PHP',
    year: 2026,
    image: 'assets/img/codeur.jpeg',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['PHP', 'MySQL', 'CSS'],
    url: 'https://example.com/projet-2',
theme: {
  solid: '#0000FF',   // fond intérieur uni
  border: '#99a7b4ff',  // bordure
  accent: '#1e3a8a',
  accentLight: '#3b82f6',
}
  },
  {
    title: 'Projet 3',
    type: 'Portfolio',
    year: 2026,
    image: 'assets/img/codeur.jpeg',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://example.com/projet-3',
  },
    {
    title: 'Projet 3',
    type: 'Portfolio',
    year: 2026,
    image: 'assets/img/codeur.jpeg',
    description: 'Courte description du projet : son but, ce que tu as réalisé et ce que tu as appris.',
    techs: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://example.com/projet-3',
  },
];

/* ---------- Génération des cartes ---------- */
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

/* Thème par carte : clés possibles dans `theme` → variables CSS */
const THEME_VARS = {
  border:      '--card-border',        // bordure (jaune par défaut)
  bgLight:     '--card-bg-light',      // gris clair de l'intérieur
  bgDark:      '--card-bg-dark',       // gris foncé de l'intérieur
  accent:      '--card-accent',        // rouge foncé (titre, bouton)
  accentLight: '--card-accent-light',  // rouge clair (dégradé)
};

const themeStyle = (theme = {}) =>
  Object.entries(theme)
    .filter(([key]) => THEME_VARS[key])
    .map(([key, value]) => `${THEME_VARS[key]}: ${escapeHtml(value)}`)
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
  <a class="project" style="${themeStyle(p.theme)}" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer"
     aria-label="Ouvrir le projet ${escapeHtml(p.title)}">
    <div class="project-inner">

      <!-- RECTO : toutes les infos -->
      <div class="card-face card-front">
        <div class="card-frame">
          ${renderHeader(p)}
          <div class="card-art">
            <img class="card-art-img" src="${escapeHtml(p.image)}" alt="Aperçu du projet ${escapeHtml(p.title)}" draggable="false">
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

          <div class="project-cta">Voir le projet →</div>
          ${renderFooter(index, total)}
        </div>
      </div>

      <!-- VERSO : dos de carte Pokémon -->
      <div class="card-face card-back">
        <img class="card-back-img" src="${BACK_IMAGE}" alt="Dos de carte Pokémon" draggable="false">
      </div>

    </div>
  </a>`;

const grid = document.getElementById('projects-grid');
grid.innerHTML = projects.map((p, i) => renderProject(p, i, projects.length)).join('');

//Écrans tactiles : 1er tap = retourner, 2e tap = ouvrir

if (window.matchMedia('(hover: none)').matches) {
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.project');
    if (!card) return;
    if (!card.classList.contains('is-flipped')) {
      e.preventDefault();
      grid.querySelectorAll('.project.is-flipped').forEach((c) => c.classList.remove('is-flipped'));
      card.classList.add('is-flipped');
    }
  });
}