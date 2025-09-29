import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `New Contact Form Submission from ${data.name}`,
      text: `Email: ${data.email}\nMessage: ${data.message}`,
    };

    await sgMail.send(msg);

    return {
      statusCode: 303,
      headers: {
        Location: "/thanks.html",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`,
    };
  }
};
