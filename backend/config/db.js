require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool de connexions MySQL (requetes parametrees partout dans le code)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'librairie',
  waitForConnections: true,
  connectionLimit: 10,
});

async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log(`MySQL connecte : ${process.env.DB_NAME || 'librairie'}`);
  } finally {
    connection.release();
  }
}

module.exports = { pool, testConnection };
