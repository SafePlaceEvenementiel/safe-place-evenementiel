/**
 * Safe Place Événementiel — Cloudflare Worker
 *
 * Routes publiques :
 *   POST /                    → email transactionnel Brevo
 *   POST /contact             → ajout contact Brevo
 *   GET  /api/events          → liste des événements publiés
 *   POST /api/reservations    → créer une réservation
 *
 * Routes admin (token requis) :
 *   POST /api/auth                       → login (retourne token)
 *   GET  /api/admin/events               → tous les événements
 *   POST /api/admin/events               → créer un événement
 *   PUT  /api/admin/events/:id           → modifier un événement
 *   DELETE /api/admin/events/:id         → supprimer un événement
 *   GET  /api/admin/reservations         → toutes les réservations (?event_id=)
 *   PUT  /api/admin/reservations/:id     → modifier statut
 *   DELETE /api/admin/reservations/:id   → supprimer
 */

const ALLOWED_ORIGINS = [
  'https://safeplaceevenementiel.fr',
  'https://www.safeplaceevenementiel.fr',
  'https://safeplaceevenementiel.github.io',
];

function corsHeaders(origin, wide = false) {
  const allowed = wide ? '*' : (ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]);
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonRes(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

// Token = SHA-256 de "safeplace:" + password
// Valide tant que le mot de passe ne change pas.
async function makeToken(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode('safeplace-admin:' + password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyToken(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !env.ADMIN_PASSWORD) return false;
  const expected = await makeToken(env.ADMIN_PASSWORD);
  return token === expected;
}

// ── Newsletter ──────────────────────────────────────────
async function sendNewsletter(env, evt) {
  if (!env.BREVO_API_KEY || !env.BREVO_NEWSLETTER_LIST_ID) return;
  const listId = parseInt(env.BREVO_NEWSLETTER_LIST_ID);

  // Récupère les abonnés de la liste (max 500)
  const contactsRes = await fetch(
    `https://api.brevo.com/v3/contacts?listIds=${listId}&limit=500&offset=0`,
    { headers: { 'api-key': env.BREVO_API_KEY, 'Accept': 'application/json' } }
  );
  if (!contactsRes.ok) return;
  const { contacts } = await contactsRes.json();
  if (!contacts?.length) return;

  const dateStr = evt.date
    ? new Date(evt.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
    : 'Date à confirmer';

  const TYPE_LABELS = { apero:'Apéro Créatif', famille:'Atelier Famille', weekend:'Week-end & Retraite', evenement:'Événement' };

  // Envoi par lots de 50 (limite Brevo)
  const BATCH = 50;
  for (let i = 0; i < contacts.length; i += BATCH) {
    const batch = contacts.slice(i, i + BATCH);
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Safe Place Événementiel', email: 'projets@safeplaceevenementiel.fr' },
        to: batch.map(c => ({ email: c.email, name: c.attributes?.PRENOM || c.email.split('@')[0] })),
        templateId: parseInt(env.BREVO_NEWSLETTER_TEMPLATE_ID || '6'),
        params: {
          NOM_EVENEMENT: evt.title + (evt.subtitle ? ' — ' + evt.subtitle : ''),
          TYPE_EVENT: TYPE_LABELS[evt.type] || evt.type,
          DATE_EVENT: dateStr,
          LIEU: evt.location || 'À confirmer',
          PRIX: evt.price_display || '',
          DESCRIPTION: evt.description || '',
        }
      })
    });
  }
}


function parseEventRow(row) {
  return { ...row, extra: JSON.parse(row.extra || '{}') };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);
    const path = url.pathname;

    // ── CORS preflight ──
    if (request.method === 'OPTIONS') {
      const isAdmin = path.startsWith('/api/admin') || path === '/api/auth';
      const isPublicApi = path === '/api/events' || path === '/api/reservations' || path === '/' || path === '/contact';
      return new Response(null, { headers: corsHeaders(origin, isAdmin || isPublicApi) });
    }

    // ══════════════════════════════════════════
    //  PUBLIC — GET /api/events
    // ══════════════════════════════════════════
    if (path === '/api/events' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM events
         WHERE status != 'draft'
         ORDER BY
           CASE WHEN date IS NULL THEN 1 ELSE 0 END,
           date ASC`
      ).all();
      return jsonRes(results.map(parseEventRow), 200, corsHeaders(origin, true));
    }

    // ══════════════════════════════════════════
    //  ADMIN AUTH — POST /api/auth
    // ══════════════════════════════════════════
    if (path === '/api/auth' && request.method === 'POST') {
      const hdrs = corsHeaders(origin, true);
      let body;
      try { body = await request.json(); } catch { body = {}; }

      if (!env.ADMIN_PASSWORD) {
        return jsonRes({ ok: false, error: 'Mot de passe admin non configuré' }, 500, hdrs);
      }
      if (body.password === env.ADMIN_PASSWORD) {
        const token = await makeToken(env.ADMIN_PASSWORD);
        return jsonRes({ ok: true, token }, 200, hdrs);
      }
      return jsonRes({ ok: false, error: 'Mot de passe incorrect' }, 401, hdrs);
    }

    // ══════════════════════════════════════════
    //  ADMIN ROUTES — /api/admin/events
    // ══════════════════════════════════════════
    if (path.startsWith('/api/admin/events')) {
      const hdrs = corsHeaders(origin, true);
      const authed = await verifyToken(request, env);
      if (!authed) return jsonRes({ error: 'Non autorisé' }, 401, hdrs);

      // GET — liste complète
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare(
          `SELECT * FROM events
           ORDER BY
             CASE WHEN date IS NULL THEN 1 ELSE 0 END,
             date ASC`
        ).all();
        return jsonRes(results.map(parseEventRow), 200, hdrs);
      }

      // POST — créer
      if (request.method === 'POST') {
        const b = await request.json().catch(() => ({}));
        const status = b.status || 'open';
        const result = await env.DB.prepare(
          `INSERT INTO events
           (type, title, subtitle, description, date, date_end, weekday,
            time_start, time_end, location, price_display, stripe_link, status, extra)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        ).bind(
          b.type || 'evenement', b.title || '', b.subtitle || '', b.description || '',
          b.date || null, b.date_end || null, b.weekday || '',
          b.time_start || '', b.time_end || '', b.location || '',
          b.price_display || '', b.stripe_link || '', status,
          JSON.stringify(b.extra || {})
        ).run();
        // Newsletter si publié directement (pas brouillon)
        if (status === 'open') {
          await sendNewsletter(env, b);
        }
        return jsonRes({ ok: true, id: result.meta.last_row_id }, 201, hdrs);
      }

      // PUT / DELETE — nécessite un id
      const idMatch = path.match(/\/api\/admin\/events\/(\d+)$/);

      if (idMatch && request.method === 'PUT') {
        const id = parseInt(idMatch[1]);
        const b = await request.json().catch(() => ({}));
        // Vérifie le statut actuel avant update (pour détecter brouillon → publié)
        const current = await env.DB.prepare(`SELECT status, extra FROM events WHERE id=?`).bind(id).first();
        const wasDraft = current?.status === 'draft';
        const isNowOpen = (b.status || 'open') === 'open';
        const currentExtra = JSON.parse(current?.extra || '{}');
        const newExtra = b.extra || currentExtra;
        await env.DB.prepare(
          `UPDATE events SET
            type=?, title=?, subtitle=?, description=?,
            date=?, date_end=?, weekday=?, time_start=?, time_end=?,
            location=?, price_display=?, stripe_link=?, status=?, extra=?,
            updated_at=datetime('now')
           WHERE id=?`
        ).bind(
          b.type || 'evenement', b.title || '', b.subtitle || '', b.description || '',
          b.date || null, b.date_end || null, b.weekday || '',
          b.time_start || '', b.time_end || '', b.location || '',
          b.price_display || '', b.stripe_link || '', b.status || 'open',
          JSON.stringify(newExtra), id
        ).run();
        // Newsletter si passage brouillon → publié
        if (wasDraft && isNowOpen) {
          await sendNewsletter(env, b);
        }
        return jsonRes({ ok: true }, 200, hdrs);
      }

      if (idMatch && request.method === 'DELETE') {
        const id = parseInt(idMatch[1]);
        await env.DB.prepare(`DELETE FROM events WHERE id=?`).bind(id).run();
        return jsonRes({ ok: true }, 200, hdrs);
      }

      return jsonRes({ error: 'Route introuvable' }, 404, hdrs);
    }

    // ══════════════════════════════════════════
    //  PUBLIC — POST /api/reservations
    // ══════════════════════════════════════════
    if (path === '/api/reservations' && request.method === 'POST') {
      const hdrs = corsHeaders(origin, true);
      const b = await request.json().catch(() => ({}));
      if (!b.prenom || !b.email || !b.event_id) {
        return jsonRes({ error: 'Champs obligatoires manquants' }, 400, hdrs);
      }
      const result = await env.DB.prepare(
        `INSERT INTO reservations (event_id, event_title, prenom, email, telephone, nb_places, nb_accompagnants, type, status)
         VALUES (?,?,?,?,?,?,?,?,?)`
      ).bind(
        b.event_id,
        b.event_title || '',
        b.prenom,
        b.email,
        b.telephone || '',
        b.nb_places || 1,
        b.nb_accompagnants || 0,
        b.type || '',
        'pending'
      ).run();
      return jsonRes({ ok: true, id: result.meta.last_row_id }, 201, hdrs);
    }

    // ══════════════════════════════════════════
    //  ADMIN — /api/admin/reservations
    // ══════════════════════════════════════════
    if (path.startsWith('/api/admin/reservations')) {
      const hdrs = corsHeaders(origin, true);
      const authed = await verifyToken(request, env);
      if (!authed) return jsonRes({ error: 'Non autorisé' }, 401, hdrs);

      const idMatch = path.match(/\/api\/admin\/reservations\/(\d+)$/);

      if (!idMatch && request.method === 'GET') {
        const eventId = url.searchParams.get('event_id');
        const query = eventId
          ? `SELECT * FROM reservations WHERE event_id=? ORDER BY created_at DESC`
          : `SELECT * FROM reservations ORDER BY created_at DESC`;
        const stmt = eventId
          ? env.DB.prepare(query).bind(parseInt(eventId))
          : env.DB.prepare(query);
        const { results } = await stmt.all();
        return jsonRes(results, 200, hdrs);
      }

      if (idMatch && request.method === 'PUT') {
        const id = parseInt(idMatch[1]);
        const b = await request.json().catch(() => ({}));
        await env.DB.prepare(`UPDATE reservations SET status=? WHERE id=?`)
          .bind(b.status || 'pending', id).run();
        return jsonRes({ ok: true }, 200, hdrs);
      }

      if (idMatch && request.method === 'DELETE') {
        const id = parseInt(idMatch[1]);
        await env.DB.prepare(`DELETE FROM reservations WHERE id=?`).bind(id).run();
        return jsonRes({ ok: true }, 200, hdrs);
      }

      return jsonRes({ error: 'Route introuvable' }, 404, hdrs);
    }

    // ══════════════════════════════════════════
    //  BREVO PROXY (existant)
    // ══════════════════════════════════════════
    const hdrs = corsHeaders(origin);

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: hdrs });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonRes({ error: 'Corps invalide' }, 400, hdrs);
    }

    let brevoUrl;
    if (path === '/contact') {
      brevoUrl = 'https://api.brevo.com/v3/contacts';
    } else if (path === '/template') {
      brevoUrl = 'https://api.brevo.com/v3/smtp/templates';
    } else if (path.startsWith('/template/')) {
      brevoUrl = 'https://api.brevo.com/v3/smtp/templates/' + path.split('/')[2];
    } else {
      brevoUrl = 'https://api.brevo.com/v3/smtp/email';
    }

    const brevoRes = await fetch(brevoUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
      body: JSON.stringify(body),
    });

    const data = await brevoRes.json();
    return new Response(JSON.stringify(data), {
      status: brevoRes.status,
      headers: { ...hdrs, 'Content-Type': 'application/json' },
    });
  },
};
