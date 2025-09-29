// netlify/functions/send-email.js
import Busboy from 'busboy';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = [];

    // Netlify provides body as base64 when multipart/form-data
    const bb = Busboy({
      headers: {
        'content-type': event.headers['content-type'] || event.headers['Content-Type']
      }
    });

    let totalBytes = 0;

    bb.on('file', (name, file, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      file.on('data', (d) => {
        totalBytes += d.length;
        if (totalBytes > MAX_ATTACHMENT_BYTES) {
          file.unpipe();
          bb.emit('error', new Error('Attachment too large'));
          return;
        }
        chunks.push(d);
      });
      file.on('end', () => {
        if (filename) {
          files.push({
            field: name,
            filename,
            type: mimeType,
            content: Buffer.concat(chunks)
          });
        }
      });
    });

    bb.on('field', (name, val) => {
      fields[name] = val;
    });

    bb.on('error', reject);
    bb.on('finish', () => resolve({ fields, files }));

    const body = Buffer.from(event.body || '', 'base64');
    bb.end(body);
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fields, files } = await parseMultipart(event);

    // Honeypot: if filled, silently succeed
    if (fields['bot-field']) {
      return {
        statusCode: 303,
        headers: { Location: '/thanks.html', 'Cache-Control': 'no-store' },
        body: ''
      };
    }

    const {
      name = '(no name)',
      email = '(no email)',
      company = '(no company)',
      phone = '(no phone)',
      service = '(no selection)',
      timeline = '(no timeline)',
      location = '(no location)',
      details = '(no details)'
    } = fields;

    const to = process.env.TO_EMAIL;
    const from = process.env.FROM_EMAIL;

    const text = [
      `New RFQ / Contact submission`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Company/Agency: ${company}`,
      `Phone: ${phone}`,
      `Service Area: ${service}`,
      `Timeline: ${timeline}`,
      `Location: ${location}`,
      ``,
      `Details:`,
      `${details}`
    ].join('\n');

    const attachments = files.map(f => ({
      content: f.content.toString('base64'),
      filename: f.filename,
      type: f.type,
      disposition: 'attachment'
    }));

    await sgMail.send({
      to,
      from,
      subject: `RFQ/Contact — ${name} (${company})`,
      text,
      attachments: attachments.length ? attachments : undefined
    });

    return {
      statusCode: 303,
      headers: { Location: '/thanks.html', 'Cache-Control': 'no-store' },
      body: ''
    };
  } catch (err) {
    console.error('send-email error:', err);
    return {
      statusCode: 500,
      body: 'Unable to send message right now.'
    };
  }
};
