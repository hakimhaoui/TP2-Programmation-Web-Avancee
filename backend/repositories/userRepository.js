const { pool } = require('../config/db');

// Jamais de mot_de_passe dans les SELECT publics
const PUBLIC_FIELDS = 'id, nom, email, role, telephone, adresse, created_at, updated_at';

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users ORDER BY id`);
  return rows;
}

async function create({ nom, email, motDePasseHash, telephone, adresse }) {
  // Role force a 'client' a l'inscription, jamais choisi par l'utilisateur
  const [result] = await pool.query(
    'INSERT INTO users (nom, email, mot_de_passe, role, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?)',
    [nom, email, motDePasseHash, 'client', telephone || null, adresse || null]
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return findById(id);
  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
  return findById(id);
}

module.exports = { findByEmail, findById, findAll, create, update, PUBLIC_FIELDS };
