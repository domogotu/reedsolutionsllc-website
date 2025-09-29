// netlify/functions/send-email.js
// Sends the contact form via SendGrid and supports a single attachment.

import sgMail from "@sendgrid/mail";
import Busboy from "busboy";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Parse multipart/form-data (Netlify sends the body base64-encoded)
function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const fields = {};
    let attachment = null;

    // Netlify Functions provide the raw headers in event.headers
    const bb = Busboy({
      headers: {
        "content-type": event.headers["content-type"] || event.headers["Content-Type"]
      }
    });

    bb.on("field", (name, val) => {
      fields[name] = val;
    });

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      file.on("data", (d) => chunks.push(d));
      file.on("end", () => {
        const buf = Buffer.concat(chunks);
        if (buf.length > 0) {
          // Keep one attachment (you can expand to multiple later)
          attachment = {
            content: buf.toString("base64"),
            filename: filename || "attachment",
            type: mimeType || "application/octet-stream",
            disposition: "attachment"
          };
        }
      });
    });

    bb.on("error", reject);
    bb.on("close", () => resolve({ fields, attachment }));

    // Write the body into busboy
    const body = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : Buffer.from(event.body || "");
    bb.end(body);
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { fields, attachment } = await parseMultipart(event);

    // Basic spam trap (your form has a hidden "bot-field")
    if (fields["bot-field"]) {
      return { statusCode: 200, body: "OK" }; // silently ignore
    }

    const {
      name = "",
      email = "",
      company = "",
      phone = "",
      service = "",
      timeline = "",
      location = "",
      details = ""
    } = fields;

    const textLines = [
      `New contact/request from reedsolutionsllc.org`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Company/Agency: ${company}`,
      `Phone: ${phone}`,
      `Service Area: ${service}`,
      `Timeline: ${timeline}`,
      `Location: ${location}`,
      "",
      `Details:`,
      details
    ].join("\n");

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL, // must be a verified sender or your authenticated domain
      replyTo: email || undefined,
      subject: `Website contact from ${name || "Unknown"}`,
      text: textLines,
      attachments: attachment ? [attachment] : undefined
    };

    await sgMail.send(msg);

    // Redirect to thank-you page (keeps URL clean)
    return {
      statusCode: 303,
      headers: { Location: "/thanks.html" }
    };
  } catch (err) {
    // Show a friendly error (and surface details in logs)
    console.error("send-email error:", err);
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};
