const { pool } = require('../config/db');

// Un client a-t-il achete cet ouvrage (commande non annulee) ?
async function hasPurchased(userId, ouvrageId) {
  const [rows] = await pool.query(
    `SELECT 1 FROM commande_items ci
     JOIN commandes c ON c.id = ci.commande_id
     WHERE c.user_id = ? AND ci.ouvrage_id = ? AND c.statut <> 'annulee'
     LIMIT 1`,
    [userId, ouvrageId]
  );
  return rows.length > 0;
}

async function findByUserAndOuvrage(userId, ouvrageId) {
  const [rows] = await pool.query(
    'SELECT * FROM avis WHERE user_id = ? AND ouvrage_id = ?', [userId, ouvrageId]
  );
  return rows[0] || null;
}

async function create({ user_id, ouvrage_id, note, titre, contenu }) {
  const [result] = await pool.query(
    'INSERT INTO avis (user_id, ouvrage_id, note, titre, contenu) VALUES (?, ?, ?, ?, ?)',
    [user_id, ouvrage_id, note, titre || null, contenu || null]
  );
  const [rows] = await pool.query('SELECT * FROM avis WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function findByOuvrage(ouvrageId) {
  const [rows] = await pool.query(
    `SELECT a.*, u.nom AS auteur_nom FROM avis a JOIN users u ON u.id = a.user_id
     WHERE a.ouvrage_id = ? ORDER BY a.created_at DESC`,
    [ouvrageId]
  );
  return rows;
}

module.exports = { hasPurchased, findByUserAndOuvrage, create, findByOuvrage };
