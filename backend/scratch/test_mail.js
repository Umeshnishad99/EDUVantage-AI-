const nodemailer = require('nodemailer');
require('dotenv').config();

const testMail = async () => {
  console.log('Testing Gmail SMTP with reaching: smtp.gmail.com:465');
  console.log('User:', process.env.GMAIL_USER);
  console.log('Pass length:', process.env.GMAIL_PASS ? process.env.GMAIL_PASS.length : 0);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    debug: true, // Enable debug output
    logger: true // Log information to console
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER, // Send to self
    subject: 'SMTP Test - EduVantage AI',
    text: 'If you see this, your Gmail SMTP config is correct!',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Success! Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.code === 'EAUTH') {
      console.error('HINT: This is an Authentication error. Check your App Password.');
    }
  }
};

testMail();
