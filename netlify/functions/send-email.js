// netlify/functions/send-email.js
// Forwards form submissions (with optional attachment) to your email via SendGrid.
// No storage on Netlify. On success, redirects to /thanks.html.

import Busboy from 'busboy';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
  const isMultipart = contentType.includes('multipart/form-data');

  // We only accept multipart/form-data for file uploads
  if (!isMultipart) {
    return { statusCode: 400, body: 'Bad Request: expected multipart/form-data' };
  }

  const fields = {};
  const files = [];

  try {
    // Parse multipart body with Busboy
    await new Promise((resolve, reject) => {
      const bb = new Busboy({ headers: event.headers });
      const bodyBuf = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : Buffer.from(event.body || '', 'utf8');

      bb.on('field', (name, value) => {
        if (name === 'bot-field' && value) {
          fields._bot = true;
        } else {
          fields[name] = value;
        }
      });

      bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info || {};
        if (!filename) {
          // No file selected
          file.resume();
          return;
        }
        const chunks = [];
        file.on('data', (d) => chunks.push(d));
        file.on('end', () => {
          const buffer = Buffer.concat(chunks);
          // limit to 10MB per file
          if (buffer.length <= 10 * 1024 * 1024) {
            files.push({
              filename,
              type: mimeType || 'application/octet-stream',
              content: buffer.toString('base64'),
              disposition: 'attachment'
            });
          }
        });
      });

      bb.on('error', reject);
      bb.on('close', resolve);

      bb.end(bodyBuf);
    });

    // Honeypot: discard bots silently
    if (fields._bot) {
      return { statusCode: 200, body: 'OK' };
    }

    // Build email
    const toEmail = process.env.TO_EMAIL;                  // REQUIRED (your inbox)
    const fromEmail = process.env.FROM_EMAIL || toEmail;   // VERIFIED sender in SendGrid

    const subject = `New RFQ from ${fields.name || 'Website Visitor'}`;
    const textLines = [
      `Name: ${fields.name || ''}`,
      `Email: ${fields.email || ''}`,
      `Company: ${fields.company || ''}`,
      `Phone: ${fields.phone || ''}`,
      `Service: ${fields.service || ''}`,
      `Timeline: ${fields.timeline || ''}`,
      `Location: ${fields.location || ''}`,
      '',
      'Details:',
      (fields.details || '')
    ];

    const msg = {
      to: toEmail,
      from: fromEmail,
      subject,
      text: textLines.join('\n'),
      attachments: files.length ? files : undefined
    };

    await sgMail.send(msg);

    // Redirect to thank-you page
    return {
      statusCode: 303,
      headers: { Location: '/thanks.html' },
      body: ''
    };
  } catch (err) {
    console.error('send-email error:', err);
    return { statusCode: 500, body: 'Email failed. Please email us directly.' };
  }
};
