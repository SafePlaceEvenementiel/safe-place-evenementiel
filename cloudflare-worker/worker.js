/**
 * Safe Place Événementiel — Cloudflare Worker
 * Proxy sécurisé vers l'API Brevo (la clé API reste côté serveur)
 *
 * Routes :
 *   POST /        → envoie un email transactionnel (smtp/email)
 *   POST /contact → ajoute un contact à une liste Brevo
 */

const ALLOWED_ORIGINS = [
  'https://safeplaceevenementiel.fr',
  'https://www.safeplaceevenementiel.fr',
  'https://safeplaceevenementiel.github.io',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Corps invalide' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const path = new URL(request.url).pathname;
    const brevoUrl = path === '/contact'
      ? 'https://api.brevo.com/v3/contacts'
      : 'https://api.brevo.com/v3/smtp/email';

    const brevoRes = await fetch(brevoUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await brevoRes.json();

    return new Response(JSON.stringify(data), {
      status: brevoRes.status,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
};
