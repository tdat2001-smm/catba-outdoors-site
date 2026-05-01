// Vercel Serverless Function: receive booking from website forms,
// forward a formatted message to a Telegram chat via the Bot API.
//
// Required environment variables (set in Vercel dashboard):
//   TELEGRAM_BOT_TOKEN  - Token from @BotFather (e.g. 123456:ABC-...)
//   TELEGRAM_CHAT_ID    - Target chat id (your user id or a group id)
// Optional:
//   ALLOWED_ORIGIN      - Comma-separated origins for CORS (default: *)

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const escapeHtml = (s = '') => String(s).replace(/[&<>]/g, c => ESC[c]);

function corsHeaders(req) {
  const allowed = (process.env.ALLOWED_ORIGIN || '*').split(',').map(s => s.trim());
  const origin = req.headers.origin || '';
  const allow = allowed.includes('*') ? '*' : (allowed.includes(origin) ? origin : allowed[0] || '*');
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function setHeaders(res, headers) {
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
}

function formatMessage(data) {
  const e = escapeHtml;
  const lines = [
    '<b>🌊 New Booking — Cat Ba Outdoors</b>',
    '',
    `<b>Subject:</b> ${e(data.tour || data.subject || 'General Inquiry')}`,
    `<b>Name:</b> ${e(data.name || '-')}`,
    `<b>Email:</b> ${e(data.email || '-')}`,
    `<b>Phone:</b> ${e(data.phone || '-')}`,
  ];
  if (data.date)     lines.push(`<b>Date:</b> ${e(data.date)}`);
  if (data.adults)   lines.push(`<b>Adults:</b> ${e(data.adults)}`);
  if (data.children) lines.push(`<b>Children:</b> ${e(data.children)}`);
  if (data.total)    lines.push(`<b>Estimated total:</b> ${e(data.total)}`);
  if (data.message) {
    lines.push('', '<b>Message:</b>', e(data.message));
  }
  lines.push('', `<i>Sent ${new Date().toISOString()}</i>`);
  return lines.join('\n');
}

async function sendToTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error('Telegram is not configured (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID).');
  }
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok || !body.ok) {
    throw new Error(`Telegram API error: ${body.description || r.status}`);
  }
  return body;
}

module.exports = async (req, res) => {
  setHeaders(res, corsHeaders(req));

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let data = req.body;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { data = {}; }
  }
  data = data || {};

  // Honeypot anti-spam: any value in `website` blocks the request silently.
  if (data.website) return res.status(200).json({ ok: true });

  if (!data.name || !data.email || !data.message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields: name, email, message.' });
  }

  // Hard caps to avoid abuse
  for (const k of Object.keys(data)) {
    if (typeof data[k] === 'string' && data[k].length > 2000) {
      data[k] = data[k].slice(0, 2000) + '…';
    }
  }

  try {
    await sendToTelegram(formatMessage(data));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('booking error:', err.message);
    return res.status(500).json({ ok: false, error: 'Failed to send booking. Please contact us via Zalo or WhatsApp.' });
  }
};
