const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/tokenUtils'); // Token utility
const { v4: uuidv4 } = require('uuid'); // UUID for unique identifiers
const connectToDB = require('../config/db'); // Database connection
const { sendVerificationEmail } = require('../config/emailService'); // Import email service

const router = express.Router();

// Company Registration Route
router.post('/register-company', [
  check('company_name').not().isEmpty().isLength({ max: 50 }).withMessage('Company name must be less than 50 characters.'),
  check('company_mobile_phone').not().isEmpty().isNumeric().withMessage('Company mobile phone must be a valid number.'),
  check('company_land_number').not().isEmpty().isNumeric().withMessage('Company land number must be a valid number.'),
  check('email').isEmail().withMessage('Must provide a valid email address.'),
  check('commercial_register_number').not().isEmpty().isLength({ max: 15 }).withMessage('Commercial Register Number must be less than 15 digits.'),
  check('tax_card_number').not().isEmpty().isLength({ max: 15 }).withMessage('Tax Card Number must be less than 15 digits.'),
  check('address').not().isEmpty().withMessage('Address is required.'),
  check('country').not().isEmpty().withMessage('Country is required.'),
  check('city').not().isEmpty().withMessage('City is required.'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { company_name, company_mobile_phone, company_land_number, email, commercial_register_number, tax_card_number, address, country, city, password } = req.body;

  try {
    const connection = await connectToDB();

    // Check for existing records
    const [existingEmail] = await connection.query('SELECT * FROM company_users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const [existingCommercialRegister] = await connection.query('SELECT * FROM company_users WHERE commercial_register_number = ?', [commercial_register_number]);
    if (existingCommercialRegister.length > 0) {
      return res.status(400).json({ error: 'Commercial Register Number already exists.' });
    }

    const [existingTaxCard] = await connection.query('SELECT * FROM company_users WHERE tax_card_number = ?', [tax_card_number]);
    if (existingTaxCard.length > 0) {
      return res.status(400).json({ error: 'Tax Card Number already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueId = uuidv4();
    const token = generateToken({ email, id: uniqueId, type: 'company' }, process.env.JWT_SECRET, '1h');

    await connection.query(
      'INSERT INTO company_users (company_name, company_mobile_phone, company_land_number, email, commercial_register_number, tax_card_number, address, country, city, password, token, is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)', 
      [company_name, company_mobile_phone, company_land_number, email, commercial_register_number, tax_card_number, address, country, city, hashedPassword, token]
    );

    // Send verification email
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Company registered successfully. Please verify your email.', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});



// Company Login Route
router.post('/login-company', [
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

    // Find company by email
    const [user] = await connection.query('SELECT * FROM company_users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    // After checking if the user exists and password matches:
    if (!user[0].is_email_verified) {
      return res.status(403).json({ error: 'Email not verified.' });
    }

    // Generate JWT token with user ID
    const token = generateToken({ email, id: user[0].id, type: 'company' }, process.env.JWT_SECRET, '1h');

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
  const { sendVerificationEmail } = require('../services/emailService'); // Import email service

  // In the register-company route (after token creation):
  const token = jwt.sign({ email, type: 'company' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  // Save user to the database (as before)
  await connection.query(
    'INSERT INTO company_users (company_name, company_mobile_phone, company_land_number, email, commercial_register_number, tax_card_number, address, country, city, password, token, is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
    [company_name, company_mobile_phone, company_land_number, email, commercial_register_number, tax_card_number, address, country, city, hashedPassword, token]
  );
  
  // Send verification email
  await sendVerificationEmail(email, token);
  
  res.status(201).json({ message: 'Company registered successfully. Please verify your email.', token });
  
});

module.exports = router;
