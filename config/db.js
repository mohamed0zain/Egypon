const mysql = require('mysql2/promise');

let connection;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'egypon',
};

const connectDB = async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connected.');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

module.exports = { connectDB, connection };
