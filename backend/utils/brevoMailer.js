const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  try {
    if (!process.env.BREVO_USER || !process.env.BREVO_PASS) {
      console.error('❌ BREVO_USER or BREVO_PASS is missing in .env!');
      throw new Error('Email service misconfigured: Missing Brevo credentials');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    console.log(`📧 [Brevo] Sending email to: ${options.email}`);
    console.log(`📧 [Brevo] From: ${process.env.BREVO_USER}`);

    const mailOptions = {
      from: `"EduVantage AI" <${process.env.BREVO_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully via Brevo. ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Brevo Mailer Error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
