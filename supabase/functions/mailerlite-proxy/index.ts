const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const GROUP_IDS: Record<string, string> = {
  EN: '181794795567449718',
  RU: '181842220750473165',
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body: { name?: unknown; email?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const lang = typeof body.lang === 'string' ? body.lang.toUpperCase() : 'EN';

  if (!email) {
    return jsonResponse({ error: 'Email is required' }, 400);
  }

  const apiKey = (Deno.env.get('MAILERLITE_API_KEY') || '').trim();
  if (!apiKey) {
    console.error('MAILERLITE_API_KEY is not configured');
    return jsonResponse({ error: 'MailerLite API key is not configured' }, 500);
  }

  let response: Response;
  try {
    response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        fields: { name },
        groups: [GROUP_IDS[lang] || GROUP_IDS.EN],
      }),
    });
  } catch (err) {
    console.error('MailerLite request failed:', err);
    return jsonResponse({ error: 'MailerLite request failed' }, 502);
  }

  const rawText = await response.text();
  console.log('MailerLite status:', response.status);
  console.log('MailerLite body:', rawText);

  if (!response.ok) {
    return jsonResponse({ error: 'MailerLite error', status: response.status }, 502);
  }

  return jsonResponse({ ok: true });
});
