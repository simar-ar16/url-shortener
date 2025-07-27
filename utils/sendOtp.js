const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_USER, // xxxxxx@smtp-brevo.com
    pass: process.env.BREVO_PASS, // smtp key
  },
});

async function sendOtpEmail(to, otp) {
  return transporter.sendMail({
    from: `Shortify <${process.env.EMAIL}>`, // <- your verified sender
    to,
    subject: 'Your Shortify OTP',
    html: `
      <h2>Verify your email</h2>
      <p>Your OTP is <b style="font-size: 20px">${otp}</b></p>
      <p>This code will expire in 5 minutes.</p>
    `,
  });
}

module.exports = sendOtpEmail;
