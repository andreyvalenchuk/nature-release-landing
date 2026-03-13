module.exports.handler = async function (event) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, email, lang } = body;
  if (!email) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Email is required' }) };
  }

  const GROUP_IDS = {
    EN: '181794795567449718',
    RU: '181842220750473165',
  };
  const groupId = GROUP_IDS[lang] || GROUP_IDS.EN;

  const apiKey = process.env.MAILERLITE_API_KEY;

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      email,
      fields: { name },
      groups: [groupId],
    }),
  });

  const rawText = await response.text();

  if (!response.ok) {
    console.error('MailerLite error status:', response.status);
    console.error('MailerLite error body:', rawText);
    return {
      statusCode: 502,
      headers: CORS,
      body: JSON.stringify({ error: 'MailerLite error', status: response.status }),
    };
  }

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({ ok: true }),
  };
};
