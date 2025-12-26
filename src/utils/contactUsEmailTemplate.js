export const contactUsEmailTemplate = ({ name, email, message }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Contact Request Received</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .header {
        background: #0f172a;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .content {
        padding: 24px;
        color: #334155;
        font-size: 14px;
        line-height: 1.6;
      }
      .content p {
        margin: 0 0 14px;
      }
      .card {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 16px;
        margin-top: 16px;
      }
      .card h3 {
        margin: 0 0 10px;
        font-size: 16px;
        color: #111827;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #6b7280;
        padding: 16px;
        background: #f4f6f8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Thanks for contacting us </h1>
      </div>

      <div class="content">
        <p>Hi <strong>${name}</strong>,</p>

        <p>
          Thank you for reaching out to us. We’ve received your message and
          our team will get back to you as soon as possible.
        </p>

        <div class="card">
          <h3>Your Message</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p>${message}</p>
        </div>

        <p style="margin-top: 20px;">
          If you have more details to add, simply reply to this email.
        </p>

        <p>
          Warm regards,<br />
          <strong>Palghar Support Team</strong>
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Palghar. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
