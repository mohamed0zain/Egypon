const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yourdatabase'
};

let connection;
const connectToDB = async () => {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connected.');
  }
  return connection;
};

const checkDBConnection = async () => {
  try {
    const conn = await connectToDB();
    console.log('Database connection is successful.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

module.exports = { connectToDB, checkDBConnection };
