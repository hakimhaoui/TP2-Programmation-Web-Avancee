const { pool } = require('../config/db');

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM listes_cadeaux WHERE id = ?', [id]);
  return rows[0] || null;
}

async function findByCode(code) {
  const [rows] = await pool.query('SELECT * FROM listes_cadeaux WHERE code_partage = ?', [code]);
  return rows[0] || null;
}

async function getItems(listeId) {
  const [rows] = await pool.query(
    `SELECT li.id, li.liste_id, li.ouvrage_id, li.quantite, li.achete,
            o.titre, o.auteur, o.prix, o.stock
     FROM liste_items li JOIN ouvrages o ON o.id = li.ouvrage_id
     WHERE li.liste_id = ? ORDER BY li.id`,
    [listeId]
  );
  return rows;
}

async function create({ user_id, nom, description, code_partage }) {
  const [result] = await pool.query(
    'INSERT INTO listes_cadeaux (user_id, nom, description, code_partage) VALUES (?, ?, ?, ?)',
    [user_id, nom, description || null, code_partage]
  );
  return findById(result.insertId);
}

async function addItem(listeId, ouvrageId, quantite) {
  const [result] = await pool.query(
    `INSERT INTO liste_items (liste_id, ouvrage_id, quantite) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantite = VALUES(quantite)`,
    [listeId, ouvrageId, quantite]
  );
  return result;
}

async function findItem(listeId, itemId, ouvrageId) {
  let rows;
  if (itemId) {
    [rows] = await pool.query('SELECT * FROM liste_items WHERE id = ? AND liste_id = ?', [itemId, listeId]);
  } else {
    [rows] = await pool.query('SELECT * FROM liste_items WHERE liste_id = ? AND ouvrage_id = ?', [listeId, ouvrageId]);
  }
  return rows[0] || null;
}

module.exports = { findById, findByCode, getItems, create, addItem, findItem };
