const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For generating random tokens
const bcrypt = require('bcrypt');
const connectToDB = require('../config/db');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../config/emailService');

const router = express.Router();

// Customer Email Verification Route
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
  
    try {
      if (!token) {
        return res.status(400).json({ error: 'Verification token is required.' });
      }
  
      // Verify token and extract payload
      const payload = verifyToken(token, process.env.JWT_SECRET);
  
      if (!payload || payload.type !== 'customer') {
        return res.status(400).json({ error: 'Invalid or expired token.' });
      }
  
      const { email } = payload;
  
      const connection = await connectToDB();
  
      // Check if the user exists
      const [user] = await connection.query('SELECT * FROM customer WHERE email = ?', [email]);
  
      if (user.length === 0) {
        return res.status(400).json({ error: 'User not found.' });
      }
  
      // Update the user to mark email as verified
      await connection.query('UPDATE customer SET is_email_verified = 1 WHERE email = ?', [email]);
  
      res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
      console.error('Error during email verification:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });
  
  
  
// Forgot Password Route (modified)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const connection = await connectToDB();

    // Find user by email (in both company and customer tables)
    let [user] = await connection.query('SELECT * FROM company_users WHERE email = ?', [email]);
    let table = 'company_users';
    if (user.length === 0) {
      [user] = await connection.query('SELECT * FROM customer WHERE email = ?', [email]);
      table = 'customer';
    }

    if (user.length === 0) {
      return res.status(404).json({ error: 'No account with that email address found.' });
    }

    // Generate plain reset token (no hashing)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save token and expiration (1 hour) in the database
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    await connection.query(
      `UPDATE ${table} SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?`,
      [resetToken, expires, email]
    );

    // Log reset token and expiration
    console.log('Reset Token Generated:', resetToken);
    console.log('Expiration Time Set:', expires);

    // Send the reset token to user's email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Reset Password Route (modified)
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const connection = await connectToDB();

    // Log the token received in the request
    console.log('Token received from request:', token);

    // Find user by token and ensure expiration is still valid
    let [user] = await connection.query(
      'SELECT * FROM company_users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [token]
    );
    let table = 'company_users';

    if (user.length === 0) {
      [user] = await connection.query(
        'SELECT * FROM customer WHERE reset_password_token = ? AND reset_password_expires > NOW()',
        [token]
      );
      table = 'customer';
    }

    // Log the user and token details found in the database
    console.log('User retrieved from DB:', user);

    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // Check if the token matches the stored token
    console.log('Token from DB:', user[0].reset_password_token);
    if (user[0].reset_password_token !== token) {
      console.log('Tokens do not match!');
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password and clear the reset token and expiration
    await connection.query(
      `UPDATE ${table} SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?`,
      [hashedPassword, user[0].id]
    );

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
