const { pool } = require('../config/db');

// Cree le panier de l'utilisateur s'il n'existe pas encore
async function getOrCreatePanier(userId) {
  await pool.query('INSERT IGNORE INTO panier (user_id) VALUES (?)', [userId]);
  const [rows] = await pool.query('SELECT * FROM panier WHERE user_id = ?', [userId]);
  return rows[0];
}

async function getItems(panierId) {
  const [rows] = await pool.query(
    `SELECT pi.id, pi.panier_id, pi.ouvrage_id, pi.quantite, pi.prix_unitaire,
            (pi.quantite * pi.prix_unitaire) AS sous_total,
            o.titre, o.auteur, o.stock
     FROM panier_items pi
     JOIN ouvrages o ON o.id = pi.ouvrage_id
     WHERE pi.panier_id = ?
     ORDER BY pi.id`,
    [panierId]
  );
  return rows;
}

async function findItemByOuvrage(panierId, ouvrageId) {
  const [rows] = await pool.query(
    'SELECT * FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?',
    [panierId, ouvrageId]
  );
  return rows[0] || null;
}

async function findItemById(itemId) {
  const [rows] = await pool.query('SELECT * FROM panier_items WHERE id = ?', [itemId]);
  return rows[0] || null;
}

async function addItem(panierId, ouvrageId, quantite, prixUnitaire) {
  const [result] = await pool.query(
    'INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
    [panierId, ouvrageId, quantite, prixUnitaire]
  );
  return findItemById(result.insertId);
}

async function updateQuantite(itemId, quantite) {
  await pool.query('UPDATE panier_items SET quantite = ? WHERE id = ?', [quantite, itemId]);
  return findItemById(itemId);
}

async function removeItem(itemId) {
  const [result] = await pool.query('DELETE FROM panier_items WHERE id = ?', [itemId]);
  return result.affectedRows > 0;
}

// Met a jour updated_at : sert a detecter les paniers inactifs
async function touch(panierId) {
  await pool.query('UPDATE panier SET updated_at = NOW() WHERE id = ?', [panierId]);
}

module.exports = {
  getOrCreatePanier, getItems, findItemByOuvrage, findItemById,
  addItem, updateQuantite, removeItem, touch,
};
