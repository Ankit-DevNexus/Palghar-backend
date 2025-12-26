

export const enquiryEmailTemplate = ({
  email,
  phone,
  countryCode,
  city,
  enquiryType,
  message,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Enquiry Received</title>
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
        background: #2563eb;
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
        color: #333333;
        font-size: 14px;
        line-height: 1.6;
      }
      .content p {
        margin: 0 0 12px;
      }
      .details {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 16px;
        margin-top: 16px;
      }
      .details h3 {
        margin-top: 0;
        font-size: 16px;
        color: #111827;
      }
      .details p {
        margin: 6px 0;
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
        <h1>We’ve received your enquiry</h1>
      </div>

      <div class="content">
        <p>Hello,</p>

        <p>
          Thank you for reaching out to us. We have successfully received your enquiry.
          Our team will review it and get back to you as soon as possible.
        </p>

        <div class="details">
          <h3>Enquiry Details</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${countryCode} ${phone}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>

        <p style="margin-top: 20px;">
          If you have any additional questions or information to share, feel free to reply to this email.
        </p>

        <p>
          Best regards,<br />
          <strong>Palghar Team</strong>
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
