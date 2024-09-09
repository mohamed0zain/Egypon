const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || '30b69b7f2ce9c95d68309b596185c35ac728327250c66d895a9d1cffe394019a';

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'egypon'
};

let connection; 
mysql.createConnection(dbConfig)
  .then(conn => {
    connection = conn;
    console.log('Database connected.');
  })
  .catch(err => console.error('Database connection failed:', err));

// Middleware for authenticating JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};


// Register a new company user
// app.post('/register-company', [
//   check('company_name').not().isEmpty(),
//   check('company_mobile_phone').not().isEmpty(),
//   check('company_land_number').not().isEmpty(),
//   check('email').isEmail(),
//   check('password').isLength({ min: 6 }),
//   check('commercial_register_number').not().isEmpty(),
//   check('tax_card_number').not().isEmpty(),
//   check('address').not().isEmpty(),
//   check('country').not().isEmpty(),
//   check('city').not().isEmpty()
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { company_name, company_mobile_phone, company_land_number, email, password, commercial_register_number, tax_card_number, address, country, city } = req.body;

//   try {
//     const [existingUser] = await connection.query('SELECT * FROM company_users WHERE email = ?', [email]);
//     if (existingUser.length > 0) {
//       return res.status(400).json({ error: 'Email already exists.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const token = jwt.sign({ email, type: 'company_user' }, jwtSecret, { expiresIn: '1h' });

//     await connection.query('INSERT INTO company_users (company_name, company_mobile_phone, company_land_number, email, password, commercial_register_number, tax_card_number, address, country, city, account_status, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
//       [company_name, company_mobile_phone, company_land_number, email, hashedPassword, commercial_register_number, tax_card_number, address, country, city, 'Pending', token]);

//     res.status(201).json({ message: 'Company user registered successfully.', token });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// });

// Register a new customer
app.post('/register-customer', [
  check('first_name').not().isEmpty(),
  check('last_name').not().isEmpty(),
  check('display_name').not().isEmpty(),
  check('gender').isIn(['Male', 'Female']),
  check('email').isEmail(),
  check('mobile_number').not().isEmpty(),
  check('line_number').not().isEmpty(),
  check('address').not().isEmpty(),
  check('country').not().isEmpty(),
  check('city').not().isEmpty(),
  check('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
 
  const { first_name, last_name, display_name, gender, email, mobile_number, line_number, address, country, city, password } = req.body;

  try {
    const [existingUser] = await connection.query('SELECT * FROM customer WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email, type: 'customer' }, jwtSecret, { expiresIn: '1h' });

    await connection.query('INSERT INTO customer (first_name, last_name, display_name, gender, email, mobile_number, line_number, address, country, city, password, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [first_name, last_name, display_name, gender, email, mobile_number, line_number, address, country, city, hashedPassword, token]);

    res.status(201).json({ message: 'Customer registered successfully.', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});




// Customer login
app.post('/login-customer', [
  check('email').isEmail(),
  check('password').not().isEmpty()
], async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await connection.query('SELECT * FROM customer WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user[0].id, email: user[0].email, type: 'customer' }, jwtSecret, { expiresIn: '1h' });
    await connection.query('UPDATE customer SET token = ? WHERE id = ?', [token, user[0].id]);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Company user logins
app.post('/login-company', [
  check('email').isEmail(),
  check('password').not().isEmpty()
], async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await connection.query('SELECT * FROM company_users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user[0].id, email: user[0].email, type: 'company_user' }, jwtSecret, { expiresIn: '1h' });
    await connection.query('UPDATE company_users SET token = ? WHERE id = ?', [token, user[0].id]);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// User profile update
app.put('/profile', authenticateToken, async (req, res) => {
  const { first_name, last_name, display_name, mobile_number, instagram, youtube } = req.body;
  const userId = req.user.id;

  try {
    await connection.query('UPDATE users SET first_name = ?, last_name = ?, display_name = ?, mobile_number = ?, instagram = ?, youtube = ? WHERE id = ?', 
      [first_name, last_name, display_name, mobile_number, instagram, youtube, userId]);
    
    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// User password change
app.put('/change-password', authenticateToken, [
  check('old_password').not().isEmpty(),
  check('new_password').isLength({ min: 6 })
], async (req, res) => {
  const { old_password, new_password } = req.body;
  const userId = req.user.id;

  try {
    const [user] = await connection.query('SELECT * FROM company-users WHERE id = ?', [userId]);
    const validPassword = await bcrypt.compare(old_password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Old password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status ().json({ error: 'Internal server error.' });
  }
});

// Server setup
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});