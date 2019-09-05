const nodemailer = require('nodemailer');
const config = require('config');
const gmailEmail = config.get('gmailEmail');
const gmailPassword = config.get('gmailPassword');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
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
