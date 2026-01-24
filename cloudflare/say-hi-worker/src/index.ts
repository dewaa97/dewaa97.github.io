type Env = {
  ALLOWED_ORIGINS?: string;
  TO_EMAIL: string;
  FROM_EMAIL: string;
};

type Payload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

function corsHeaders(origin: string | null, allowed: string[]) {
  if (!origin) return {};
  if (!allowed.includes(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    'vary': 'Origin',
  };
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has('content-type')) headers.set('content-type', 'application/json');
  return new Response(JSON.stringify(body), { ...init, headers });
}

function normalizeAllowedOrigins(raw?: string) {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('origin');
    const allowed = normalizeAllowedOrigins(env.ALLOWED_ORIGINS);
    const cors = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST' || url.pathname !== '/api/hi') {
      return new Response('Not Found', { status: 404, headers: cors });
    }

    if (origin && allowed.length > 0 && !allowed.includes(origin)) {
      return jsonResponse({ error: 'Origin not allowed' }, { status: 403, headers: cors });
    }

    const ct = request.headers.get('content-type') ?? '';
    if (!ct.toLowerCase().includes('application/json')) {
      return jsonResponse({ error: 'Expected application/json' }, { status: 400, headers: cors });
    }

    let payload: Payload;
    try {
      payload = (await request.json()) as Payload;
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, { status: 400, headers: cors });
    }

    if (payload.website && payload.website.trim().length > 0) {
      return jsonResponse({ ok: true }, { status: 200, headers: cors });
    }

    const name = (payload.name ?? '').trim().slice(0, 80);
    const email = (payload.email ?? '').trim().slice(0, 120);
    const message = (payload.message ?? '').trim().slice(0, 4000);

    if (message.length < 10) {
      return jsonResponse({ error: 'Message must be at least 10 characters.' }, { status: 400, headers: cors });
    }

    if (!env.TO_EMAIL || !env.FROM_EMAIL) {
      return jsonResponse({ error: 'Server is not configured.' }, { status: 500, headers: cors });
    }

    const subject = name ? `Say Hi from ${name}` : 'Say Hi from website';
    const text = [`Name: ${name || '-'}`, `Email: ${email || '-'}`, '', 'Message:', message].join('\n');

    const mailchannelsPayload = {
      personalizations: [{ to: [{ email: env.TO_EMAIL }] }],
      from: {
        email: env.FROM_EMAIL,
        name: 'Dewa Fakha Shiva (Website)',
      },
      reply_to: {
        email: email || env.FROM_EMAIL,
        name: name || 'Visitor',
      },
      subject,
      content: [{ type: 'text/plain', value: text }],
    };

    const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(mailchannelsPayload),
    });

    if (!mcRes.ok) {
      const detail = await mcRes.text().catch(() => '');
      return jsonResponse({ error: 'Email delivery failed.', detail: detail.slice(0, 300) }, { status: 502, headers: cors });
    }

    return jsonResponse({ ok: true }, { status: 200, headers: cors });
  },
};

