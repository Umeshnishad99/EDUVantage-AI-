const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.length < 5) {
      console.error('❌ RESEND_API_KEY is missing or invalid in environment variables!');
      throw new Error('Email service misconfigured: Missing API Key');
    }

    // Use verified domain from env, or fall back to Resend default
    // IMPORTANT: Without a verified domain, Resend can ONLY send to the account owner's email!
    // After verifying your domain on https://resend.com/domains, set RESEND_FROM in .env
    const fromAddress = process.env.RESEND_FROM 
      ? `EduVantage AI <${process.env.RESEND_FROM}>`
      : 'EduVantage AI <onboarding@resend.dev>';

    console.log(`📧 [Resend] Sending email to: ${options.email}`);
    console.log(`📧 [Resend] From: ${fromAddress}`);
    console.log(`📧 [Resend] API Key prefix: ${process.env.RESEND_API_KEY.substring(0, 8)}...`);
    
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('❌ Resend API Error Details:', JSON.stringify(error, null, 2));
      console.error('💡 If you see "can only send to yourself", you need to verify your domain at https://resend.com/domains');
      throw new Error(error.message);
    }

    console.log('✅ Email sent successfully via Resend. ID:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Resend Mailer Error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
