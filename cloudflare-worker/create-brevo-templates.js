/**
 * Safe Place Événementiel — Création des templates Brevo
 * Crée les 8 templates email dans Brevo via le Cloudflare Worker proxy.
 *
 * Usage : node cloudflare-worker/create-brevo-templates.js
 * Node 18+ requis (fetch natif).
 *
 * Les IDs retournés sont à coller dans js/brevo-templates.js
 */

const WORKER = 'https://safe-place-evenementiel.projets-b86.workers.dev';

async function createTemplate(name, subject, htmlContent) {
  const res = await fetch(WORKER + '/template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      subject,
      htmlContent,
      sender: { name: 'Angela — Safe Place Événementiel', email: 'projets@safeplaceevenementiel.fr' },
      isActive: true,
    }),
  });
  const data = await res.json();
  if (data.id) {
    console.log(`✅  ${name}\n    → templateId: ${data.id}\n`);
    return data.id;
  } else {
    console.error(`❌  ${name}\n    → Erreur: ${JSON.stringify(data)}\n`);
    return null;
  }
}

/* ══════════════════════════════════════════════════════
   TEMPLATE 1 — Confirmation inscription Lumière Intérieure
   Destinataire : participant·e
   Variables : PRENOM, NB_PARTS, DRAPS, PAIEMENT, IMG_DROIT, TOTAL, ECHEANCIER_HTML
══════════════════════════════════════════════════════ */
const tpl1 = `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf6;padding:32px 16px;font-family:'Helvetica Neue',Arial,sans-serif;">
<tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:24px 24px 0 0;padding:48px 40px 36px;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">✨</div>
      <h1 style="margin:0 0 8px;color:white;font-size:26px;font-weight:900;font-style:italic;line-height:1.2;">Ton inscription est confirmée !</h1>
      <p style="margin:0;color:rgba(255,255,255,.85);font-size:14px;font-weight:600;">Week-end Lumière Intérieure · 1–3 mai 2026</p>
    </td></tr>
    <tr><td style="background:white;padding:40px;border-left:1px solid #ffe8d6;border-right:1px solid #ffe8d6;">
      <p style="margin:0 0 24px;color:#1a0800;font-size:16px;line-height:1.7;">Bonjour <strong>{{ params.PRENOM }}</strong> 🧡</p>
      <p style="margin:0 0 24px;color:#1a0800;font-size:15px;line-height:1.7;">Ton inscription au week-end <strong>Lumière Intérieure</strong> est bien enregistrée. On a tellement hâte de t'accueillir dans cette bulle de bien-être ✦</p>

      <div style="background:#fff4ea;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 14px;color:#ff9430;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">Récapitulatif de ta réservation</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#7a3d1a;font-weight:700;width:50%">📅 Dates</td><td style="padding:6px 0;color:#1a0800">1er au 3 mai 2026</td></tr>
          <tr><td style="padding:6px 0;color:#7a3d1a;font-weight:700">📍 Lieu</td><td style="padding:6px 0;color:#1a0800">Gîte de la Sapinière, Bezinghem (62)</td></tr>
          <tr><td style="padding:6px 0;color:#7a3d1a;font-weight:700">👥 Participants</td><td style="padding:6px 0;color:#1a0800">{{ params.NB_PARTS }} personne(s)</td></tr>
          <tr><td style="padding:6px 0;color:#7a3d1a;font-weight:700">🛏️ Option draps</td><td style="padding:6px 0;color:#1a0800">{{ params.DRAPS }}</td></tr>
          <tr><td style="padding:6px 0;color:#7a3d1a;font-weight:700">💳 Paiement</td><td style="padding:6px 0;color:#1a0800">{{ params.PAIEMENT }}</td></tr>
          <tr><td style="padding:6px 0;color:#7a3d1a;font-weight:700">📸 Droit à l'image</td><td style="padding:6px 0;color:#1a0800">{{ params.IMG_DROIT }}</td></tr>
          <tr style="border-top:2px solid #ffe8d6;"><td style="padding:10px 0 6px;color:#fd2c82;font-weight:900;font-size:16px">Total</td><td style="padding:10px 0 6px;color:#fd2c82;font-weight:900;font-size:16px">{{ params.TOTAL }}€</td></tr>
        </table>
      </div>

      {{ params.ECHEANCIER_HTML | safe }}

      <div style="background:#fff4ea;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 12px;color:#ff9430;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">La suite ✦</p>
        <p style="margin:0 0 10px;color:#1a0800;font-size:14px;line-height:1.7;">📞 Angela te contactera prochainement pour ton <strong>entretien téléphonique préalable</strong>.</p>
        <p style="margin:0 0 10px;color:#1a0800;font-size:14px;line-height:1.7;">📍 <strong>Lieu :</strong> Gîte de la Sapinière — Bezinghem, 62650. Accueil prévu le <strong>1er mai à partir de 14h</strong>.</p>
        <p style="margin:0;color:#1a0800;font-size:14px;line-height:1.7;">💌 Pour toute question, réponds directement à cet email ou écris-nous sur Instagram <strong>@safeplaceevenementiel</strong>.</p>
      </div>

      <p style="margin:0 0 28px;color:#1a0800;font-size:15px;line-height:1.7;">À très vite dans cette belle aventure 🧡<br>On a hâte de partager ce week-end avec toi ✦</p>
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="border-left:3px solid #ff9430;padding-left:14px;">
          <p style="margin:0;font-size:16px;font-weight:900;font-style:italic;color:#ff9430;">Angela</p>
          <p style="margin:4px 0 0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fd2c82;">Fondatrice · Safe Place Événementiel ✦</p>
        </td>
      </tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr><td align="center">
        <a href="https://www.safeplaceevenementiel.fr" style="display:inline-block;background:linear-gradient(135deg,#ff9430,#fd2c82);color:white;text-decoration:none;padding:14px 32px;border-radius:30px;font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;">Voir nos événements ✦</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:0 0 24px 24px;padding:28px 40px;text-align:center;">
      <p style="margin:0 0 6px;color:white;font-size:13px;font-weight:800;font-style:italic;">✦ Un évènement ? Une Safe Place ✦</p>
      <p style="margin:0 0 10px;color:rgba(255,255,255,.85);font-size:12px;">Safe Place Événementiel · Côte d'Opale, Boulogne-sur-Mer (62)</p>
      <p style="margin:0;color:rgba(255,255,255,.65);font-size:11px;">Cet email est une confirmation automatique de ton inscription.</p>
    </td></tr>
  </table>
</td></tr>
</table>`;

/* ══════════════════════════════════════════════════════
   TEMPLATE 2 — Notification interne Lumière Intérieure
   Destinataire : Angela + Thiffany
   Variables : PRENOM, NOM, EMAIL, TEL, VILLE, NB_PARTS, DRAPS, PAIEMENT, IMG_DROIT, TOTAL, URG_NOM, URG_TEL, BESOINS
══════════════════════════════════════════════════════ */
const tpl2 = `<h2 style="color:#ff9430;font-family:sans-serif">🎉 Nouvelle inscription — Lumière Intérieure</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="padding:8px;color:#7a3d1a;font-weight:700;width:40%">Prénom / Nom</td><td style="padding:8px">{{ params.PRENOM }} {{ params.NOM }}</td></tr>
  <tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">E-mail</td><td style="padding:8px"><a href="mailto:{{ params.EMAIL }}">{{ params.EMAIL }}</a></td></tr>
  <tr><td style="padding:8px;color:#7a3d1a;font-weight:700">Téléphone</td><td style="padding:8px">{{ params.TEL }}</td></tr>
  <tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">Ville</td><td style="padding:8px">{{ params.VILLE }}</td></tr>
  <tr><td style="padding:8px;color:#7a3d1a;font-weight:700">Participants</td><td style="padding:8px">{{ params.NB_PARTS }}</td></tr>
  <tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">Option draps</td><td style="padding:8px">{{ params.DRAPS }}</td></tr>
  <tr><td style="padding:8px;color:#7a3d1a;font-weight:700">Paiement</td><td style="padding:8px">{{ params.PAIEMENT }}</td></tr>
  <tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">Droit à l'image</td><td style="padding:8px">{{ params.IMG_DROIT }}</td></tr>
  <tr><td style="padding:8px;color:#7a3d1a;font-weight:700">Contact urgence</td><td style="padding:8px">{{ params.URG_NOM }} — {{ params.URG_TEL }}</td></tr>
  <tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">Besoins particuliers</td><td style="padding:8px">{{ params.BESOINS }}</td></tr>
  <tr style="border-top:2px solid #ffe8d6"><td style="padding:10px 8px;color:#fd2c82;font-weight:900;font-size:16px">Total</td><td style="padding:10px 8px;color:#fd2c82;font-weight:900;font-size:16px">{{ params.TOTAL }}€</td></tr>
</table>`;

/* ══════════════════════════════════════════════════════
   TEMPLATE 3 — Confirmation réservation atelier / apéro
   Destinataire : participant·e
   Variables : PRENOM, NOM_EVENEMENT, TYPE_PARTS, NB_PARTS, ACCOMP_LIGNE
══════════════════════════════════════════════════════ */
const tpl3 = `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf6;padding:32px 16px;font-family:Arial,sans-serif;">
<tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:24px 24px 0 0;padding:40px 32px;text-align:center;">
      <div style="font-size:36px;margin-bottom:10px;">🎨</div>
      <h1 style="margin:0 0 6px;color:white;font-size:22px;font-weight:900;font-style:italic;">Ta réservation est en cours !</h1>
      <p style="margin:0;color:rgba(255,255,255,.85);font-size:13px;font-weight:600;">{{ params.NOM_EVENEMENT }}</p>
    </td></tr>
    <tr><td style="background:white;padding:32px;border-left:1px solid #ffe8d6;border-right:1px solid #ffe8d6;">
      <p style="margin:0 0 20px;color:#1a0800;font-size:15px;line-height:1.7;">Bonjour <strong>{{ params.PRENOM }}</strong> 🧡</p>
      <p style="margin:0 0 20px;color:#1a0800;font-size:14px;line-height:1.7;">Tu es redirigé·e vers notre page de paiement sécurisé. Une fois le paiement validé, ta place est confirmée ✦</p>
      <div style="background:#fff4ea;border-radius:14px;padding:20px;margin-bottom:20px;">
        <p style="margin:0 0 10px;color:#ff9430;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;">Récapitulatif</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr><td style="padding:5px 0;color:#7a3d1a;font-weight:700;width:50%">{{ params.TYPE_PARTS }}</td><td style="padding:5px 0;color:#1a0800">{{ params.NB_PARTS }}</td></tr>
          {{ params.ACCOMP_LIGNE | safe }}
        </table>
      </div>
      <div style="background:#fff4ea;border-radius:14px;padding:20px;margin-bottom:20px;">
        <p style="margin:0;color:#1a0800;font-size:13px;line-height:1.7;">Des questions ? Réponds à cet email ou écris-nous sur Instagram <strong>@safeplaceevenementiel</strong>.</p>
      </div>
      <p style="margin:0 0 16px;color:#1a0800;font-size:14px;line-height:1.7;">À très vite 🧡</p>
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="border-left:3px solid #ff9430;padding-left:12px;">
          <p style="margin:0;font-size:14px;font-weight:900;font-style:italic;color:#ff9430;">Angela</p>
          <p style="margin:2px 0 0;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fd2c82;">Fondatrice · Safe Place Événementiel ✦</p>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:0 0 24px 24px;padding:24px 32px;text-align:center;">
      <p style="margin:0 0 4px;color:white;font-size:12px;font-weight:800;font-style:italic;">✦ Un évènement ? Une Safe Place ✦</p>
      <p style="margin:0;color:rgba(255,255,255,.65);font-size:10px;">Confirmation automatique — Safe Place Événementiel · Boulogne-sur-Mer (62)</p>
    </td></tr>
  </table>
</td></tr>
</table>`;

/* ══════════════════════════════════════════════════════
   TEMPLATE 4 — Notification interne atelier / apéro
   Destinataire : Angela + Thiffany
   Variables : PRENOM, EMAIL, TEL, NOM_EVENEMENT, TYPE_PARTS, NB_PARTS, ACCOMP_LIGNE
══════════════════════════════════════════════════════ */
const tpl4 = `<h2 style="color:#ff9430;font-family:sans-serif">🎨 Nouvelle réservation — {{ params.NOM_EVENEMENT }}</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:500px">
  <tr><td style="padding:8px;color:#7a3d1a;font-weight:700;width:40%">Prénom</td><td style="padding:8px">{{ params.PRENOM }}</td></tr>
  <tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">E-mail</td><td style="padding:8px"><a href="mailto:{{ params.EMAIL }}">{{ params.EMAIL }}</a></td></tr>
  <tr><td style="padding:8px;color:#7a3d1a;font-weight:700">Téléphone</td><td style="padding:8px">{{ params.TEL }}</td></tr>
  <tr style="background:#fff4ea"><td style="padding:8px;color:#7a3d1a;font-weight:700">Événement</td><td style="padding:8px">{{ params.NOM_EVENEMENT }}</td></tr>
  <tr><td style="padding:8px;color:#7a3d1a;font-weight:700">{{ params.TYPE_PARTS }}</td><td style="padding:8px">{{ params.NB_PARTS }}</td></tr>
  {{ params.ACCOMP_LIGNE | safe }}
</table>`;

/* ══════════════════════════════════════════════════════
   TEMPLATE 5 — Bienvenue newsletter
   Destinataire : abonné·e
   Variables : aucune (email statique)
══════════════════════════════════════════════════════ */
const tpl5 = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fffaf6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf6;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:24px 24px 0 0;padding:48px 40px 36px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;color:white;">✦</div>
        <h1 style="margin:0;color:white;font-size:28px;font-weight:900;font-style:italic;line-height:1.2;">Bienvenue dans<br>la Safe Place ✦</h1>
        <p style="margin:16px 0 0;color:rgba(255,255,255,.88);font-size:15px;line-height:1.6;">Tu fais maintenant partie de notre communauté bienveillante 🌸</p>
      </td></tr>
      <tr><td style="background:white;padding:40px;border-left:1px solid #ffe8d6;border-right:1px solid #ffe8d6;">
        <p style="margin:0 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">Bonjour,</p>
        <p style="margin:0 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">Je suis <strong>Angela</strong>, fondatrice de Safe Place Événementiel, et je suis vraiment ravie de t'accueillir ici ✦</p>
        <p style="margin:0 0 28px;color:#1a0800;font-size:16px;line-height:1.7;">En t'inscrivant à la newsletter, tu seras parmi les premièr·e·s informé·e·s à chaque nouvel atelier, apéro créatif, week-end bien-être ou événement mis en ligne.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr><td style="background:#fff4ea;border-radius:16px;padding:28px;">
            <p style="margin:0 0 16px;color:#ff9430;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">Ce qui t'attend ✦</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="32" valign="top" style="padding-top:2px;font-size:18px;">🎨</td>
                <td style="padding-left:12px;padding-bottom:14px;color:#1a0800;font-size:14px;line-height:1.6;"><strong>Apéros Créatifs</strong> — Un mercredi sur deux, un thème créatif différent, une boisson offerte ✦</td>
              </tr>
              <tr>
                <td width="32" valign="top" style="padding-top:2px;font-size:18px;">👨‍👩‍👧</td>
                <td style="padding-left:12px;padding-bottom:14px;color:#1a0800;font-size:14px;line-height:1.6;"><strong>Ateliers Famille</strong> — Des moments créatifs et joyeux à partager avec vos enfants ✦</td>
              </tr>
              <tr>
                <td width="32" valign="top" style="padding-top:2px;font-size:18px;">🌿</td>
                <td style="padding-left:12px;padding-bottom:14px;color:#1a0800;font-size:14px;line-height:1.6;"><strong>Week-ends &amp; Retraites</strong> — Bien-être, développement personnel, reconnexion à soi ✦</td>
              </tr>
              <tr>
                <td width="32" valign="top" style="padding-top:2px;font-size:18px;">🛍️</td>
                <td style="padding-left:12px;color:#1a0800;font-size:14px;line-height:1.6;"><strong>&amp; bien d'autres surprises</strong> — Vide-dressing, marchés d'artisans &amp; créateurs, et des événements tout au long de l'année ✦</td>
              </tr>
            </table>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr><td align="center">
            <a href="https://www.safeplaceevenementiel.fr" style="display:inline-block;background:linear-gradient(135deg,#ff9430,#fd2c82);color:white;text-decoration:none;padding:16px 40px;border-radius:30px;font-size:14px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 6px 24px rgba(253,44,130,.35);">Voir les prochains événements ✦</a>
          </td></tr>
        </table>
        <p style="margin:0 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">À très vite sur la Côte d'Opale 🧡</p>
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="border-left:3px solid #ff9430;padding-left:14px;">
            <p style="margin:0;font-size:16px;font-weight:900;font-style:italic;color:#ff9430;">Angela</p>
            <p style="margin:4px 0 0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fd2c82;">Fondatrice · Safe Place Événementiel ✦</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:0 0 24px 24px;padding:28px 40px;text-align:center;">
        <p style="margin:0 0 6px;color:white;font-size:13px;font-weight:800;font-style:italic;">✦ Un évènement ? Une Safe Place ✦</p>
        <p style="margin:0 0 10px;color:rgba(255,255,255,.85);font-size:12px;">Safe Place Événementiel · Côte d'Opale, Boulogne-sur-Mer (62)</p>
        <p style="margin:0;color:rgba(255,255,255,.65);font-size:11px;">Tu reçois cet email car tu t'es inscrit·e à notre newsletter.<br>Pour te désabonner, réponds à cet email avec la mention "Désabonnement".</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

/* ══════════════════════════════════════════════════════
   TEMPLATE 6 — Accusé réception demande sur mesure
   Destinataire : client·e
   Variables : aucune (statique)
══════════════════════════════════════════════════════ */
const tpl6 = `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf6;padding:32px 16px;font-family:'Helvetica Neue',Arial,sans-serif;">
<tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:24px 24px 0 0;padding:48px 40px 36px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;color:white;">✨</div>
      <h1 style="margin:0;color:white;font-size:26px;font-weight:900;font-style:italic;line-height:1.2;">Votre demande est bien reçue !</h1>
    </td></tr>
    <tr><td style="background:white;padding:40px;border-left:1px solid #ffe8d6;border-right:1px solid #ffe8d6;">
      <p style="margin:0 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">Merci de faire confiance à Safe Place Événementiel pour votre projet ✦</p>
      <div style="background:#fff4ea;border-radius:16px;padding:24px;margin-bottom:20px;">
        <p style="margin:0 0 12px;color:#ff9430;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">La suite ✦</p>
        <p style="margin:0 0 10px;color:#1a0800;font-size:14px;line-height:1.7;">📞 Angela vous contactera sous <strong>48h</strong> pour en savoir plus sur votre projet et construire quelque chose d'unique ensemble.</p>
        <p style="margin:0;color:#1a0800;font-size:14px;line-height:1.7;">💌 En attendant, n'hésitez pas à répondre à cet email si vous avez des questions.</p>
      </div>
      <p style="margin:28px 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">À très vite 🧡</p>
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="border-left:3px solid #ff9430;padding-left:14px;">
          <p style="margin:0;font-size:16px;font-weight:900;font-style:italic;color:#ff9430;">Angela</p>
          <p style="margin:4px 0 0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fd2c82;">Fondatrice · Safe Place Événementiel ✦</p>
        </td>
      </tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr><td align="center">
        <a href="https://www.safeplaceevenementiel.fr" style="display:inline-block;background:linear-gradient(135deg,#ff9430,#fd2c82);color:white;text-decoration:none;padding:14px 32px;border-radius:30px;font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;">Voir nos événements ✦</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:0 0 24px 24px;padding:28px 40px;text-align:center;">
      <p style="margin:0 0 6px;color:white;font-size:13px;font-weight:800;font-style:italic;">✦ Un évènement ? Une Safe Place ✦</p>
      <p style="margin:0 0 10px;color:rgba(255,255,255,.85);font-size:12px;">Safe Place Événementiel · Côte d'Opale, Boulogne-sur-Mer (62)</p>
      <p style="margin:0;color:rgba(255,255,255,.65);font-size:11px;">Cet email est un accusé de réception automatique.</p>
    </td></tr>
  </table>
</td></tr>
</table>`;

/* ══════════════════════════════════════════════════════
   TEMPLATE 7 — Accusé réception question générale
   Destinataire : client·e
   Variables : aucune (statique)
══════════════════════════════════════════════════════ */
const tpl7 = `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf6;padding:32px 16px;font-family:'Helvetica Neue',Arial,sans-serif;">
<tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:24px 24px 0 0;padding:48px 40px 36px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;color:white;">💬</div>
      <h1 style="margin:0;color:white;font-size:26px;font-weight:900;font-style:italic;line-height:1.2;">Message bien reçu !</h1>
    </td></tr>
    <tr><td style="background:white;padding:40px;border-left:1px solid #ffe8d6;border-right:1px solid #ffe8d6;">
      <p style="margin:0 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">Merci de nous avoir contacté·e ✦</p>
      <div style="background:#fff4ea;border-radius:16px;padding:24px;margin-bottom:20px;">
        <p style="margin:0 0 12px;color:#ff9430;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">La suite ✦</p>
        <p style="margin:0;color:#1a0800;font-size:14px;line-height:1.7;">Angela lit chaque message personnellement et vous répond sous <strong>48h</strong>. Si votre question est urgente, vous pouvez aussi nous joindre directement sur Instagram <strong>@safeplaceevenementiel</strong>.</p>
      </div>
      <p style="margin:28px 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">À très vite 🧡</p>
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="border-left:3px solid #ff9430;padding-left:14px;">
          <p style="margin:0;font-size:16px;font-weight:900;font-style:italic;color:#ff9430;">Angela</p>
          <p style="margin:4px 0 0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fd2c82;">Fondatrice · Safe Place Événementiel ✦</p>
        </td>
      </tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr><td align="center">
        <a href="https://www.safeplaceevenementiel.fr" style="display:inline-block;background:linear-gradient(135deg,#ff9430,#fd2c82);color:white;text-decoration:none;padding:14px 32px;border-radius:30px;font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;">Voir nos événements ✦</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:0 0 24px 24px;padding:28px 40px;text-align:center;">
      <p style="margin:0 0 6px;color:white;font-size:13px;font-weight:800;font-style:italic;">✦ Un évènement ? Une Safe Place ✦</p>
      <p style="margin:0 0 10px;color:rgba(255,255,255,.85);font-size:12px;">Safe Place Événementiel · Côte d'Opale, Boulogne-sur-Mer (62)</p>
      <p style="margin:0;color:rgba(255,255,255,.65);font-size:11px;">Cet email est un accusé de réception automatique.</p>
    </td></tr>
  </table>
</td></tr>
</table>`;

/* ══════════════════════════════════════════════════════
   TEMPLATE 8 — Accusé réception candidature collaborateur
   Destinataire : candidat·e
   Variables : aucune (statique)
══════════════════════════════════════════════════════ */
const tpl8 = `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf6;padding:32px 16px;font-family:'Helvetica Neue',Arial,sans-serif;">
<tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:24px 24px 0 0;padding:48px 40px 36px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;color:white;">🤝</div>
      <h1 style="margin:0;color:white;font-size:26px;font-weight:900;font-style:italic;line-height:1.2;">Candidature bien reçue !</h1>
    </td></tr>
    <tr><td style="background:white;padding:40px;border-left:1px solid #ffe8d6;border-right:1px solid #ffe8d6;">
      <p style="margin:0 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">Merci de l'intérêt que vous portez à Safe Place Événementiel ✦</p>
      <div style="background:#fff4ea;border-radius:16px;padding:24px;margin-bottom:20px;">
        <p style="margin:0 0 12px;color:#ff9430;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">La suite ✦</p>
        <p style="margin:0 0 10px;color:#1a0800;font-size:14px;line-height:1.7;">Angela lit chaque candidature avec soin et vous répond sous <strong>48h</strong>. Si votre profil correspond à nos valeurs et à nos besoins, elle vous proposera un échange pour en apprendre davantage sur votre pratique.</p>
        <p style="margin:0;color:#1a0800;font-size:14px;line-height:1.7;">✦ Safe Place Événementiel est construite sur des collaborations humaines et sincères — hâte de vous découvrir !</p>
      </div>
      <p style="margin:28px 0 20px;color:#1a0800;font-size:16px;line-height:1.7;">À très vite 🧡</p>
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="border-left:3px solid #ff9430;padding-left:14px;">
          <p style="margin:0;font-size:16px;font-weight:900;font-style:italic;color:#ff9430;">Angela</p>
          <p style="margin:4px 0 0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fd2c82;">Fondatrice · Safe Place Événementiel ✦</p>
        </td>
      </tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr><td align="center">
        <a href="https://www.safeplaceevenementiel.fr/collaborateurs.html" style="display:inline-block;background:linear-gradient(135deg,#ff9430,#fd2c82);color:white;text-decoration:none;padding:14px 32px;border-radius:30px;font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;">Découvrir l'équipe ✦</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="background:linear-gradient(135deg,#ff9430,#fd2c82);border-radius:0 0 24px 24px;padding:28px 40px;text-align:center;">
      <p style="margin:0 0 6px;color:white;font-size:13px;font-weight:800;font-style:italic;">✦ Un évènement ? Une Safe Place ✦</p>
      <p style="margin:0 0 10px;color:rgba(255,255,255,.85);font-size:12px;">Safe Place Événementiel · Côte d'Opale, Boulogne-sur-Mer (62)</p>
      <p style="margin:0;color:rgba(255,255,255,.65);font-size:11px;">Cet email est un accusé de réception automatique.</p>
    </td></tr>
  </table>
</td></tr>
</table>`;

/* ══════════════════════════════════════════════════════
   MAIN — Création séquentielle
══════════════════════════════════════════════════════ */
(async () => {
  console.log('🚀 Création des templates Brevo via le Cloudflare Worker…\n');

  const ids = {};

  ids.tpl1 = await createTemplate(
    'SPE — Confirmation inscription Lumière Intérieure',
    '✨ Ton inscription au week-end Lumière Intérieure est confirmée !',
    tpl1
  );
  ids.tpl2 = await createTemplate(
    'SPE — Notif interne Lumière Intérieure',
    '🎉 Nouvelle inscription Lumière Intérieure — {{ params.PRENOM }} {{ params.NOM }}',
    tpl2
  );
  ids.tpl3 = await createTemplate(
    'SPE — Confirmation réservation atelier/apéro',
    '🎨 Ta réservation — {{ params.NOM_EVENEMENT }}',
    tpl3
  );
  ids.tpl4 = await createTemplate(
    'SPE — Notif interne atelier/apéro',
    '🎨 Nouvelle réservation — {{ params.NOM_EVENEMENT }} ({{ params.PRENOM }})',
    tpl4
  );
  ids.tpl5 = await createTemplate(
    'SPE — Bienvenue newsletter',
    '✦ Bienvenue dans la Safe Place !',
    tpl5
  );
  ids.tpl6 = await createTemplate(
    'SPE — Accusé réception demande sur mesure',
    '✨ Votre demande est bien reçue — Safe Place Événementiel',
    tpl6
  );
  ids.tpl7 = await createTemplate(
    'SPE — Accusé réception question générale',
    '💬 Message bien reçu — Safe Place Événementiel',
    tpl7
  );
  ids.tpl8 = await createTemplate(
    'SPE — Candidature collaborateur reçue',
    '🤝 Candidature bien reçue — Safe Place Événementiel',
    tpl8
  );

  console.log('══════════════════════════════════════════');
  console.log('📋 Résumé des IDs à coller dans js/brevo-templates.js :');
  console.log('══════════════════════════════════════════');
  console.log(JSON.stringify(ids, null, 2));
})();
