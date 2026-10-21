const { pool } = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY nom');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nom, description }) {
  const [result] = await pool.query(
    'INSERT INTO categories (nom, description) VALUES (?, ?)',
    [nom, description || null]
  );
  return findById(result.insertId);
}

async function update(id, { nom, description }) {
  await pool.query('UPDATE categories SET nom = ?, description = ? WHERE id = ?',
    [nom, description ?? null, id]);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
