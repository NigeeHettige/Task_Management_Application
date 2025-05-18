const pool = require('../config/db');

const getUsers = async () => {
  try {
    const [rows] = await pool.query('SELECT name,id FROM users');
    if (!rows.length) {
      return []; // Return empty array instead of throwing
    }
    return rows;
  } catch (error) {
    console.error('Database error in getUsers:', error);
    throw new Error('Failed to fetch users from database');
  }
};

module.exports = { getUsers };