const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};
const verifyToken = (token, secret) => {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  };
module.exports = generateToken;
