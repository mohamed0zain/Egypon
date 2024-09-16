const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectToDB = require('../config/db'); // Adjust path if necessary

const router = express.Router();

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
    const token = jwt.sign({ email, type: 'company' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await connection.query(
      'INSERT INTO company_users (company_name, company_mobile_phone, company_land_number, email, commercial_register_number, tax_card_number, address, country, city, password, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [company_name, company_mobile_phone, company_land_number, email, commercial_register_number, tax_card_number, address, country, city, hashedPassword, token]
    );

    res.status(201).json({ message: 'Company registered successfully.', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
