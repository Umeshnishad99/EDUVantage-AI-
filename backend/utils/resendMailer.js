const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    // If we're using Resend, we can use their official SDK
    // Note: If you don't have a verified domain on Resend, you can only send to yourself (the account owner)
    // unless you use their 'onboarding@resend.dev' default address.
    
    console.log('Attempting to send email via Resend API...');
    
    const { data, error } = await resend.emails.send({
      from: 'EduVantage AI <onboarding@resend.dev>', // Default for unverified domains
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent successfully via Resend:', data.id);
    return data;
  } catch (error) {
    console.error('Resend Mailer Error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
