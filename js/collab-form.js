/* ══════════════════════════════════════════════════════════
   FORMULAIRE COLLABORATEUR — Safe Place Événementiel
   Fichier partagé entre collaborateurs.html et contact.html
   Toute modification ici s'applique automatiquement aux deux pages.
══════════════════════════════════════════════════════════ */
(function () {
  var container = document.querySelector('[data-collab-form]');
  if (!container) return;

  /* ── HTML du formulaire ── */
  container.innerHTML = `
    <form class="collab-shared-form" novalidate>
      <div class="csf-row">
        <div class="csf-group">
          <label for="csf-prenom">Prénom *</label>
          <input type="text" id="csf-prenom" name="prenom" placeholder="Votre prénom" required>
        </div>
        <div class="csf-group">
          <label for="csf-nom">Nom *</label>
          <input type="text" id="csf-nom" name="nom" placeholder="Votre nom" required>
        </div>
      </div>
      <div class="csf-group">
        <label for="csf-entreprise">Entreprise / Nom de votre activité (optionnel)</label>
        <input type="text" id="csf-entreprise" name="entreprise" placeholder="Ex : Studio Lumière, Auto-entreprise…">
      </div>
      <div class="csf-row">
        <div class="csf-group">
          <label for="csf-email">E-mail *</label>
          <input type="email" id="csf-email" name="email" placeholder="votre@email.com" required>
        </div>
        <div class="csf-group">
          <label for="csf-tel">Téléphone (optionnel)</label>
          <input type="tel" id="csf-tel" name="tel" placeholder="06 XX XX XX XX">
        </div>
      </div>
      <div class="csf-row">
        <div class="csf-group">
          <label for="csf-instagram">Instagram (optionnel)</label>
          <input type="text" id="csf-instagram" name="instagram" placeholder="@votre_compte">
        </div>
        <div class="csf-group">
          <label for="csf-domaine">Votre domaine *</label>
          <select id="csf-domaine" name="domaine" required>
            <option value="" disabled selected>Sélectionnez…</option>
            <option value="Bien-être / Méditation">🧘 Bien-être / Méditation</option>
            <option value="Médecine douce / Thérapie">🌿 Médecine douce / Thérapie</option>
            <option value="Sport / Mouvement">🏃 Sport / Mouvement</option>
            <option value="Photographie / Image">📸 Photographie / Image</option>
            <option value="Arts créatifs">🎨 Arts créatifs</option>
            <option value="Musique">🎵 Musique</option>
            <option value="Cuisine / Nutrition">🍽️ Cuisine / Nutrition</option>
            <option value="Développement personnel">💫 Développement personnel</option>
            <option value="Lieu / Hébergement">🏡 Lieu / Hébergement</option>
            <option value="Autre">✨ Autre</option>
          </select>
        </div>
      </div>
      <div class="csf-group">
        <label for="csf-message">Parlez-nous de vous *</label>
        <textarea id="csf-message" name="message" rows="5"
          placeholder="Décrivez votre activité, vos valeurs, ce que vous pourriez apporter à la communauté Safe Place… en quelques lignes ✦"
          required></textarea>
      </div>
      <div class="csf-footer">
        <button type="submit" class="csf-btn">Envoyer ma candidature ✦</button>
        <span class="csf-note">🤍 Angela revient vers vous sous 48h.</span>
      </div>
    </form>
    <div class="csf-success" style="display:none;">
      <div class="csf-success-icon">🌸</div>
      <h4>Candidature envoyée ✦</h4>
      <p>Angela est ravie de vous découvrir ! Elle revient vers vous sous 48h. Un email de confirmation vous a été envoyé.</p>
    </div>
  `;

  /* ── CSS autonome (fonctionne dans les deux contextes) ── */
  var style = document.createElement('style');
  style.textContent = `
    .collab-shared-form { display: flex; flex-direction: column; gap: 16px; }
    .csf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .csf-group { display: flex; flex-direction: column; gap: 6px; }
    .csf-group label { font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--ts, #7a3d1a); }
    .csf-group input, .csf-group select, .csf-group textarea {
      width: 100%; padding: 10px 14px; border: 2px solid rgba(122,61,26,.15);
      border-radius: 10px; font-family: 'Nunito Sans', sans-serif; font-size: 14px;
      color: var(--t, #1a0800); background: var(--bg, #fffaf6);
      outline: none; transition: border-color .2s, box-shadow .2s; box-sizing: border-box;
    }
    .csf-group input:focus, .csf-group select:focus, .csf-group textarea:focus {
      border-color: #fd2c82; box-shadow: 0 0 0 3px rgba(253,44,130,.12);
    }
    .csf-group textarea { resize: vertical; min-height: 110px; }
    .csf-group select { appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a3d1a' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center; padding-right: 38px;
    }
    .csf-footer { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-top: 6px; }
    .csf-btn {
      padding: 13px 32px; background: linear-gradient(135deg, #ff9430, #fd2c82);
      color: white; border: none; border-radius: 30px; font-size: 14px; font-weight: 800;
      letter-spacing: .06em; text-transform: uppercase; cursor: pointer;
      box-shadow: 0 6px 24px rgba(253,44,130,.35); transition: all .25s;
    }
    .csf-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(253,44,130,.45); }
    .csf-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
    .csf-note { font-size: 12px; color: var(--ts, #7a3d1a); opacity: .75; }
    .csf-success { text-align: center; padding: 40px 20px; }
    .csf-success-icon { font-size: 48px; margin-bottom: 16px; }
    .csf-success h4 { font-family: 'Nunito', sans-serif; font-weight: 900; font-style: italic; color: #fd2c82; font-size: 22px; margin: 0 0 12px; }
    .csf-success p { color: #7a3d1a; font-size: 15px; line-height: 1.7; margin: 0; }
    @media (max-width: 600px) { .csf-row { grid-template-columns: 1fr; } }
  `;
  document.head.appendChild(style);

  /* ── Logique de soumission Brevo ── */
  var BREVO_KEY = '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';
  var form = container.querySelector('.collab-shared-form');
  var successEl = container.querySelector('.csf-success');
  var btn = form.querySelector('.csf-btn');

  var ACK_HTML = `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf6;padding:32px 16px;font-family:'Helvetica Neue',Arial,sans-serif;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:24px 24px 0 0;padding:48px 40px 36px;text-align:center;"><div style="font-size:32px;margin-bottom:8px;color:white;">🤝</div><h1 style="margin:0;color:white;font-size:26px;font-weight:900;font-style:italic;line-height:1.2;">Candidature bien reçue !</h1></td></tr><tr><td style="background:white;padding:40px;border-left:1px solid #ffe8d6;border-right:1px solid #ffe8d6;"><p style="margin:0 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">Merci de l'intérêt que vous portez à Safe Place Événementiel ✦</p><div style="background:#fff4ea;border-radius:16px;padding:24px;margin-bottom:20px;"><p style="margin:0 0 12px;color:#ff9430;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">La suite ✦</p><p style="margin:0 0 10px;color:#1a0800;font-size:14px;line-height:1.7;">Angela lit chaque candidature avec soin et vous répond sous <strong>48h</strong>. Si votre profil correspond à nos valeurs et à nos besoins, elle vous proposera un échange pour en apprendre davantage sur votre pratique.</p><p style="margin:0;color:#1a0800;font-size:14px;line-height:1.7;">✦ Safe Place Événementiel est construite sur des collaborations humaines et sincères — hâte de vous découvrir !</p></div><p style="margin:28px 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">À très vite 🧡</p><table cellpadding="0" cellspacing="0"><tr><td style="border-left:3px solid #ff9430;padding-left:14px;"><p style="margin:0;font-size:16px;font-weight:900;font-style:italic;color:#ff9430;">Angela</p><p style="margin:4px 0 0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fd2c82;">Fondatrice · Safe Place Événementiel ✦</p></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr><td align="center"><a href="https://www.safeplaceevenementiel.fr/collaborateurs.html" style="display:inline-block;background:linear-gradient(135deg,#ff9430,#fd2c82);color:white;text-decoration:none;padding:14px 32px;border-radius:30px;font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;">Découvrir l'équipe ✦</a></td></tr></table></td></tr><tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:0 0 24px 24px;padding:28px 40px;text-align:center;"><p style="margin:0 0 6px;color:white;font-size:13px;font-weight:800;font-style:italic;">✦ Un évènement ? Une Safe Place ✦</p><p style="margin:0 0 10px;color:rgba(255,255,255,.85);font-size:12px;">Safe Place Événementiel · Côte d'Opale, Boulogne-sur-Mer (62)</p><p style="margin:0;color:rgba(255,255,255,.65);font-size:11px;">Cet email est un accusé de réception automatique.</p></td></tr></table></td></tr></table>`;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var prenom = form.querySelector('[name=prenom]').value.trim();
    var nom = form.querySelector('[name=nom]').value.trim();
    var email = form.querySelector('[name=email]').value.trim();
    var tel = form.querySelector('[name=tel]').value || 'Non renseigné';
    var entreprise = form.querySelector('[name=entreprise]').value || 'Non renseignée';
    var instagram = form.querySelector('[name=instagram]').value || 'Non renseigné';
    var domaine = form.querySelector('[name=domaine]').value || 'Non renseigné';
    var message = form.querySelector('[name=message]').value;

    if (!prenom || !email || !domaine || !message) {
      form.querySelectorAll('[required]').forEach(function (f) {
        f.style.borderColor = !f.value ? '#fd2c82' : '';
      });
      return;
    }

    btn.textContent = '⏳ Envoi…';
    btn.disabled = true;

    var htmlAngela = '<h2>🤝 Nouvelle candidature collaborateur·rice</h2>' +
      '<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">' +
      '<tr><td style="padding:8px;color:#7a3d1a;font-weight:700">Prénom / Nom</td><td style="padding:8px">' + prenom + ' ' + nom + '</td></tr>' +
      '<tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">E-mail</td><td style="padding:8px"><a href="mailto:' + email + '">' + email + '</a></td></tr>' +
      '<tr><td style="padding:8px;color:#7a3d1a;font-weight:700">Téléphone</td><td style="padding:8px">' + tel + '</td></tr>' +
      '<tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">Entreprise</td><td style="padding:8px">' + entreprise + '</td></tr>' +
      '<tr><td style="padding:8px;color:#7a3d1a;font-weight:700">Domaine</td><td style="padding:8px">' + domaine + '</td></tr>' +
      '<tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">Instagram</td><td style="padding:8px">' + instagram + '</td></tr>' +
      '</table><h3 style="color:#ff9430">Message</h3><p style="font-size:14px;line-height:1.6">' + message.replace(/\n/g, '<br>') + '</p>';

    // Email à Angela + Thiffany
    fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': BREVO_KEY },
      body: JSON.stringify({
        sender: { name: 'Safe Place Événementiel', email: 'projets@safeplaceevenementiel.fr' },
        to: [{ email: 'hello@safeplaceevenementiel.fr', name: 'Angela' }, { email: 'projets@safeplaceevenementiel.fr', name: 'Thiffany' }],
        replyTo: { email: email, name: prenom + ' ' + nom },
        subject: '🤝 Candidature collaborateur — ' + prenom + ' ' + nom,
        htmlContent: htmlAngela
      })
    }).then(function (res) {
      if (!res.ok) throw new Error();

      // Accusé de réception
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': BREVO_KEY },
        body: JSON.stringify({
          sender: { name: 'Angela — Safe Place Événementiel', email: 'projets@safeplaceevenementiel.fr' },
          to: [{ email: email, name: prenom + ' ' + nom }],
          subject: '🤝 Candidature bien reçue — Safe Place Événementiel',
          htmlContent: ACK_HTML
        })
      }).catch(function (e) { console.warn('Ack:', e); });

      // Succès
      form.style.display = 'none';
      successEl.style.display = 'block';

    }).catch(function () {
      btn.textContent = 'Envoyer ma candidature ✦';
      btn.disabled = false;
      alert('Une erreur est survenue. Contactez-nous à hello@safeplaceevenementiel.fr');
    });
  });
})();
