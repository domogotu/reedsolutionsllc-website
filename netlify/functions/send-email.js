// netlify/functions/send-email.js
import Busboy from 'busboy';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = [];
    const bb = Busboy({
      headers: { 'content-type': event.headers['content-type'] || event.headers['Content-Type'] }
    });

    let total = 0;
    bb.on('file', (name, file, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      file.on('data', d => {
        total += d.length;
        if (total > MAX_ATTACHMENT_BYTES) {
          bb.emit('error', new Error('Attachment too large'));
          file.unpipe();
        } else {
          chunks.push(d);
        }
      });
      file.on('end', () => {
        if (filename) files.push({ filename, type: mimeType, content: Buffer.concat(chunks) });
      });
    });
    bb.on('field', (name, val) => (fields[name] = val));
    bb.on('error', reject);
    bb.on('finish', () => resolve({ fields, files }));
    bb.end(Buffer.from(event.body || '', 'base64'));
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { fields, files } = await parseMultipart(event);

    // Honeypot – if filled, pretend success
    if (fields['bot-field']) {
      return { statusCode: 303, headers: { Location: '/thanks.html', 'Cache-Control': 'no-store' } };
    }

    const to = process.env.TO_EMAIL;
    const from = process.env.FROM_EMAIL;

    const text = [
      'New contact submission',
      `Name: ${fields.name || ''}`,
      `Email: ${fields.email || ''}`,
      `Company: ${fields.company || ''}`,
      `Phone: ${fields.phone || ''}`,
      `Service: ${fields.service || ''}`,
      `Timeline: ${fields.timeline || ''}`,
      `Location: ${fields.location || ''}`,
      '',
      'Message:',
      fields.details || fields.message || ''
    ].join('\n');

    const attachments = files.map(f => ({
      content: f.content.toString('base64'),
      filename: f.filename,
      type: f.type,
      disposition: 'attachment'
    }));

    await sgMail.send({
      to, from,
      subject: `Website Contact — ${fields.name || 'Unknown'}`,
      text,
      attachments: attachments.length ? attachments : undefined
    });

    return { statusCode: 303, headers: { Location: '/thanks.html', 'Cache-Control': 'no-store' } };
  } catch (err) {
    console.error('send-email error:', err);
    return { statusCode: 500, body: 'Unable to send message right now.' };
  }
};
