const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for port 465 (SMTPS)
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      family: 4, // Force IPv4 to avoid ENETUNREACH on Render
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,
      socketTimeout: 15000, // 15 seconds
    });



    const mailOptions = {
      from: `"EduVantage AI" <${process.env.GMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
