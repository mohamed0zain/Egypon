const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/tokenUtils'); // Token utility
const { v4: uuidv4 } = require('uuid'); // UUID for unique identifiers
const connectToDB = require('../config/db'); // Database connection
const { sendVerificationEmail } = require('../config/emailService'); // Import email service

const router = express.Router();

// Customer Registration Route
router.post('/register-customer', [
  check('first_name').not().isEmpty().withMessage('First name is required.')
    .isLength({ max: 20 }).withMessage('First name cannot be longer than 20 characters.')
    .matches(/^[A-Za-z]+$/).withMessage('First name must contain only letters.'),
  check('last_name').not().isEmpty().withMessage('Last name is required.')
    .isLength({ max: 20 }).withMessage('Last name cannot be longer than 20 characters.')
    .matches(/^[A-Za-z]+$/).withMessage('Last name must contain only letters.'),
  check('display_name').not().isEmpty().withMessage('Display name is required.'),
  check('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female.'),
  check('email').isEmail().withMessage('Please provide a valid email.'),
  check('mobile_number').not().isEmpty().withMessage('Mobile number is required.'),
  check('line_number').not().isEmpty().withMessage('Line number is required.'),
  check('address').not().isEmpty().withMessage('Address is required.'),
  check('country').not().isEmpty().withMessage('Country is required.'),
  check('city').not().isEmpty().withMessage('City is required.'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, display_name, gender, email, mobile_number, line_number, address, country, city, password } = req.body;

  try {
    const connection = await connectToDB();

    // Check if email already exists
    const [existingUser] = await connection.query('SELECT * FROM customer WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueId = uuidv4(); // Generate a unique identifier
    const token = generateToken({ email, id: uniqueId, type: 'customer' }, process.env.JWT_SECRET, '1h'); // Include uniqueId in payload

    // Insert the customer into the database
    await connection.query(
      'INSERT INTO customer (first_name, last_name, display_name, gender, email, mobile_number, line_number, address, country, city, password, token, is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)', 
      [first_name, last_name, display_name, gender, email, mobile_number, line_number, address, country, city, hashedPassword, token]
    );

    // Send verification email
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Customer registered successfully. Please verify your email.', token });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Customer Login Route
router.post('/login-customer', [
  check('email').isEmail().withMessage('Must provide a valid email address.'),
  check('password').not().isEmpty().withMessage('Password is required.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const connection = await connectToDB();

    // Find customer by email
    const [user] = await connection.query('SELECT * FROM customer WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Check if email is verified
    if (!user[0].is_email_verified) {
      return res.status(403).json({ error: 'Email not verified.' });
    }

    // Generate JWT token with user ID
    const token = generateToken({ email, id: user[0].id, type: 'customer' }, process.env.JWT_SECRET, '1h');

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error.' });
  }
});
module.exports = router;
