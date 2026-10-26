/* ==========================================================
   Formulaire de contact (service Web3Forms, gratuit)
   1. Va sur https://web3forms.com, saisis ton email, tu reçois une clé par mail.
   2. Colle-la ci-dessous. Cette clé est publique : elle peut rester dans le code.
   ========================================================== */
const WEB3FORMS_KEY = 'COLLE_TA_CLE_ICI';

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = form.querySelector('button[type="submit"]');

const setStatus = (text, type) => {
  statusEl.textContent = text;
  statusEl.className = 'form-status' + (type ? ` is-${type}` : '');
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (WEB3FORMS_KEY === 'COLLE_TA_CLE_ICI') {
    setStatus("Le formulaire n'est pas encore configuré : ajoute ta clé dans assets/contact.js.", 'error');
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  data.access_key = WEB3FORMS_KEY;
  data.subject = `Portfolio : message de ${data.name}`;

  submitBtn.disabled = true;
  setStatus('Envoi en cours…');

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    form.reset();
    setStatus('Message envoyé, merci ! Je te réponds rapidement.', 'ok');
  } catch (err) {
    setStatus("L'envoi a échoué. Réessaie, ou écris-moi directement par email.", 'error');
  } finally {
    submitBtn.disabled = false;
  }
});