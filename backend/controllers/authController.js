const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query } = require('../config/db');
const sendEmail = require('../utils/resendMailer');


const registerUser = async (req, res) => {
  let { name, email, password, role } = req.body;
  if (email) email = email.toLowerCase();

  try {
    const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const skipVerification = process.env.SKIP_VERIFICATION === 'true';
    const newUser = await query(
      'INSERT INTO users (name, email, password_hash, role, verification_token, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role',
      [name, email, hashedPassword, role || 'student', skipVerification ? null : verificationToken, skipVerification]
    );

    const user = newUser.rows[0];

    if (skipVerification) {
      return res.status(201).json({ 
        message: 'Registration successful! Verification skipped (debug mode).',
        user 
      });
    }

    // Send Verification Email
    const frontendUrl = req.headers.origin || process.env.APP_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify/${verificationToken}`;
    
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb; text-align: center;">Welcome to EduVantage AI!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining EduVantage AI. To access your predictive portal, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p style="font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #2563eb;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; 2026 EduVantage AI. All rights reserved.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your EduVantage AI Account',
        html: emailHtml,
      });
      res.status(201).json({ 
        message: 'Registration successful! Please check your email to verify your account.',
        user 
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(201).json({ 
        message: 'Registration successful, but verification email failed to send. Please contact support.',
        user 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', debug: error.message });
  }
};

const loginUser = async (req, res) => {
  let { email, password } = req.body;
  if (email) email = email.toLowerCase();

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if verified (unless skip enabled) - REMOVED TO PREVENT 401 ERRORS AS REQUESTED
    /*
    if (!user.is_verified && process.env.SKIP_VERIFICATION !== 'true') {
      return res.status(401).json({ message: 'Please verify your email address before logging in.' });
    }
    */


    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error('🔥 LOGIN ERROR:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      debug: error.message 
    });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const result = await query('SELECT * FROM users WHERE verification_token = $1', [token]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    const user = result.rows[0];
    await query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1', [user.id]);

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};

const resendVerification = async (req, res) => {
  let { email } = req.body;
  if (email) email = email.toLowerCase();

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    if (user.is_verified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Use existing token if it exists, otherwise generate a new one
    let verificationToken = user.verification_token;
    if (!verificationToken) {
      verificationToken = crypto.randomBytes(32).toString('hex');
      await query('UPDATE users SET verification_token = $1 WHERE id = $2', [verificationToken, user.id]);
    }

    const frontendUrl = req.headers.origin || process.env.APP_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify/${verificationToken}`;
    
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb; text-align: center;">EduVantage AI - Resend Verification</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a new verification link. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p style="font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #2563eb;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; 2026 EduVantage AI. All rights reserved.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Verify your EduVantage AI Account (Re-sent)',
      html: emailHtml,
    });

    res.json({ message: 'Verification email has been re-sent successfully.' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Error sending verification email', debug: error.message });
  }
};

const forgotPassword = async (req, res) => {
  let { email } = req.body;
  if (email) email = email.toLowerCase();

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

    await query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [resetToken, resetExpiry, user.id]
    );

    const frontendUrl = req.headers.origin || process.env.APP_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb; text-align: center;">EduVantage AI - Password Reset</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 12px; color: #64748b;">If you didn't request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; 2026 EduVantage AI. All rights reserved.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Reset your EduVantage AI Password',
      html: emailHtml,
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Error sending reset email' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const result = await query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    const user = result.rows[0];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

module.exports = { registerUser, loginUser, verifyEmail, resendVerification, forgotPassword, resetPassword };

