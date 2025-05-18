const mysql = require('mysql2/promise');
require('dotenv').config();


const dbConfig = {
  development: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  production: {
    host: process.env.PROD_DB_HOST,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME
  },
  test: {
    host: process.env.TEST_DB_HOST,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME
  }
};

const pool = mysql.createPool({
  ...dbConfig[process.env.NODE_ENV || 'development'],
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection pool by attempting a simple query
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`Database connection successfully established in ${process.env.NODE_ENV || 'development'} mode`);
  } catch (err) {
    console.error(`Database connection error in ${process.env.NODE_ENV || 'development'} mode:`, err);
  }
})();

module.exports = pool;