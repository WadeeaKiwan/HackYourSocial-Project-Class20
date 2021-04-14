const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  // Create the reusable `sendEmail` function
  async sendEmail(from, to, subject, html) {
    try {
      return await transporter.sendMail({ from, to, subject, html });
    } catch (err) {
      console.error(err);
    }
  },
};
