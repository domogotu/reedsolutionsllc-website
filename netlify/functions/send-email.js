const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: process.env.TO_EMAIL,   // your destination email
      from: process.env.FROM_EMAIL, // must be verified in SendGrid
      subject: `New RFQ from ${data.name}`,
      text: `
        Name: ${data.name}
        Email: ${data.email}
        Company: ${data.company}
        Phone: ${data.phone}
        Service: ${data.service}
        Timeline: ${data.timeline}
        Location: ${data.location}
        Details: ${data.details}
      `,
    };

    await sgMail.send(msg);

    return {
      statusCode: 302,
      headers: {
        Location: '/thanks.html',
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
