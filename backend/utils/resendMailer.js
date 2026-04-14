const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    // If we're using Resend, we can use their official SDK
    // Note: If you don't have a verified domain on Resend, you can only send to yourself (the account owner)
    // unless you use their 'onboarding@resend.dev' default address.
    
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.length < 5) {
      console.error('❌ RESEND_API_KEY is missing or invalid in environment variables!');
      throw new Error('Email service misconfigured: Missing API Key');
    }

    console.log(`Attempting to send email via Resend API to: ${options.email}...`);
    
    const { data, error } = await resend.emails.send({
      from: 'EduVantage AI <onboarding@resend.dev>', // Default for unverified domains
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('❌ Resend API Error Details:', JSON.stringify(error, null, 2));
      throw new Error(error.message);
    }

    console.log('✅ Email sent successfully via Resend. ID:', data.id);
    return data;
  } catch (error) {
    console.error('Resend Mailer Error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
