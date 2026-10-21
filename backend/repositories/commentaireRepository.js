const { pool } = require('../config/db');

async function create({ user_id, ouvrage_id, contenu }) {
  // valide = 0 par defaut en base : invisible publiquement avant validation
  const [result] = await pool.query(
    'INSERT INTO commentaires (user_id, ouvrage_id, contenu, valide) VALUES (?, ?, ?, 0)',
    [user_id, ouvrage_id, contenu]
  );
  const [rows] = await pool.query('SELECT * FROM commentaires WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM commentaires WHERE id = ?', [id]);
  return rows[0] || null;
}

// Seuls les commentaires valides sont visibles publiquement
async function findValidesByOuvrage(ouvrageId) {
  const [rows] = await pool.query(
    `SELECT cm.*, u.nom AS auteur_nom FROM commentaires cm
     JOIN users u ON u.id = cm.user_id
     WHERE cm.ouvrage_id = ? AND cm.valide = 1 ORDER BY cm.created_at DESC`,
    [ouvrageId]
  );
  return rows;
}

async function setValide(id, valide, validePar) {
  await pool.query(
    'UPDATE commentaires SET valide = ?, valide_par = ?, date_validation = ? WHERE id = ?',
    [valide ? 1 : 0, validePar, valide ? new Date() : null, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM commentaires WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { create, findById, findValidesByOuvrage, setValide, remove };
