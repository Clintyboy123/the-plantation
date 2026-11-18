// Sends email through the venue SMTP account. If SMTP is not configured, nothing is sent
// (the enquiry is still saved) and a warning is logged, so a missing mail setting never loses an enquiry.
const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;
if (env.mail.host) {
  transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.port === 465,
    auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined,
  });
}

exports.isConfigured = () => Boolean(transporter);

exports.send = async ({ to, subject, text, replyTo }) => {
  if (!transporter) {
    console.warn('[mail] SMTP is not configured (SMTP_HOST is empty); email not sent:', subject);
    return false;
  }
  await transporter.sendMail({ from: env.mail.from, to, subject, text, replyTo });
  return true;
};
