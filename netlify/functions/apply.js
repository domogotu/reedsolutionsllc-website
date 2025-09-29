// Parses multipart form-data with Busboy and emails the application using SendGrid (PDF attachments).
const sgMail = require('@sendgrid/mail');
const Busboy = require('busboy');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
  if (!ct.toLowerCase().includes('multipart/form-data')) {
    return { statusCode: 400, body: 'Invalid content type' };
  }

  try {
    const fields = {};
    const files = [];

    await new Promise((resolve, reject) => {
      const bb = Busboy({ headers: event.headers });
      bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info;
        const chunks = [];
        file.on('data', (d) => chunks.push(d));
        file.on('end', () => {
          const buffer = Buffer.concat(chunks);
          if (mimeType !== 'application/pdf') return; // only PDFs
          files.push({
            filename,
            type: mimeType,
            content: buffer.toString('base64'),
            disposition: 'attachment'
          });
        });
      });
      bb.on('field', (name, val) => { fields[name] = val; });
      bb.on('error', reject);
      bb.on('close', resolve);
      bb.end(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
    });

    if ((fields['bot-field'] || '').trim() !== '') {
      return { statusCode: 204, body: '' };
    }

    const textLines = [
      `New Applicant: ${fields.name || ''}`,
      `Email: ${fields.email || ''}`,
      `Phone: ${fields.phone || ''}`,
      `Location: ${fields.location || ''}`,
      `Position/Area: ${fields.position || ''}`,
      `Clearance: ${fields.clearance || 'None'}`,
      '',
      'Summary:',
      (fields.summary || '(no summary provided)')
    ];

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL || process.env.TO_EMAIL,
      subject: `New Application — ${fields.name || 'Unknown'}`,
      text: textLines.join('\n'),
      attachments: files.slice(0, 10)
    };

    await sgMail.send(msg);

    return { statusCode: 302, headers: { Location: '/thanks.html' }, body: '' };
  } catch (err) {
    console.error('Apply error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to submit application', detail: err.message }) };
  }
};
