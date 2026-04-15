const axios = require('axios');
require('dotenv').config();

const sendEmail = async (options) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'umeshnishad657@gmail.com';

    if (!apiKey) {
      console.error('❌ BREVO_API_KEY is missing in environment variables!');
      throw new Error('Email service misconfigured: Missing Brevo API Key');
    }

    console.log(`📧 [Brevo] Sending email to: ${options.email}`);
    
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: "EduVantage AI", email: senderEmail },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.html
    }, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Email sent successfully via Brevo API. ID:', response.data.messageId);
    return response.data;
  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error('❌ Brevo Mailer Error:', errorMsg);
    throw new Error(errorMsg);
  }
};

module.exports = sendEmail;
