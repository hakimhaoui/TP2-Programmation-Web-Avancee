const { pool } = require('../config/db');

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM commandes WHERE id = ?', [id]);
  return rows[0] || null;
}

async function getItems(commandeId) {
  const [rows] = await pool.query(
    `SELECT ci.*, o.titre, o.auteur FROM commande_items ci
     JOIN ouvrages o ON o.id = ci.ouvrage_id WHERE ci.commande_id = ? ORDER BY ci.id`,
    [commandeId]
  );
  return rows;
}

// Client : ses commandes. Gestionnaire/administrateur : toutes (userId = null)
async function findAll(userId) {
  const sql = userId
    ? 'SELECT * FROM commandes WHERE user_id = ? ORDER BY created_at DESC'
    : 'SELECT * FROM commandes ORDER BY created_at DESC';
  const [rows] = await pool.query(sql, userId ? [userId] : []);
  return rows;
}

module.exports = { findById, getItems, findAll };
