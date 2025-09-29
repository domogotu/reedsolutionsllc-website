// Handles contact form submissions (JSON or urlencoded) and redirects to /thanks.html
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function parseBody(event) {
  const ct = (event.headers['content-type'] || event.headers['Content-Type'] || '').toLowerCase();

  if (ct.includes('application/json')) {
    try { return JSON.parse(event.body || '{}'); } catch { return {}; }
  }

  if (ct.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(event.body || '');
    const obj = {};
    for (const [k, v] of params.entries()) obj[k] = v;
    return obj;
  }

  // Fallback
  try { return JSON.parse(event.body || '{}'); } catch { return {}; }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = parseBody(event);

  // Honeypot
  if (data['bot-field']) {
    return { statusCode: 200, body: 'OK' };
  }

  const name = (data.name || '').trim();
  const email = (data.email || '').trim();
  const details = (data.details || '').trim();

  if (!name || !email || !details) {
    return { statusCode: 400, body: 'Missing required fields.' };
  }

  const msg = {
    to: process.env.TO_EMAIL,
    from: process.env.FROM_EMAIL,
    replyTo: email || process.env.FROM_EMAIL,
    subject: `New RFQ from ${name}${data.company ? ' — ' + data.company : ''}`,
    text:
`Name: ${name}
Email: ${email}
Company/Agency: ${data.company || '-'}
Phone: ${data.phone || '-'}
Service Area: ${data.service || '-'}
Timeline: ${data.timeline || '-'}
Location: ${data.location || '-'}

Details:
${details}
`,
  };

  try {
    await sgMail.send(msg);
    return { statusCode: 302, headers: { Location: '/thanks.html' } };
  } catch (err) {
    console.error('SendGrid error:', err);
    return { statusCode: 500, body: `Email failed: ${err.message}` };
  }
};
