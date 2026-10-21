const { pool } = require('../config/db');

const SELECT_WITH_CATEGORIE = `
  SELECT o.*, c.nom AS categorie_nom,
         (SELECT COALESCE(AVG(a.note), 0) FROM avis a WHERE a.ouvrage_id = o.id) AS note_moyenne,
         (SELECT COUNT(*) FROM avis a WHERE a.ouvrage_id = o.id) AS nombre_avis
  FROM ouvrages o
  LEFT JOIN categories c ON c.id = o.categorie_id
`;

// Affichage public : uniquement les ouvrages en stock (stock > 0)
// Filtres : search (titre/auteur), categorie_id ou categorie (nom), tri popularite/prix/recent
async function findPublic({ search, categorie_id, categorie, tri, limit, offset }) {
  const conditions = ['o.stock > 0'];
  const params = [];

  if (search) {
    conditions.push('(o.titre LIKE ? OR o.auteur LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (categorie_id) {
    conditions.push('o.categorie_id = ?');
    params.push(categorie_id);
  }
  if (categorie) {
    conditions.push('c.nom LIKE ?');
    params.push(`%${categorie}%`);
  }

  const orders = {
    popularite: 'o.popularite DESC, note_moyenne DESC',
    prix_asc: 'o.prix ASC',
    prix_desc: 'o.prix DESC',
    recent: 'o.created_at DESC',
    titre: 'o.titre ASC',
  };
  const orderBy = orders[tri] || 'o.popularite DESC, o.id DESC';

  const sql = `${SELECT_WITH_CATEGORIE} WHERE ${conditions.join(' AND ')}
               ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(sql, [...params, limit, offset]);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`${SELECT_WITH_CATEGORIE} WHERE o.id = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const [result] = await pool.query(
    `INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, image_url,
                           date_publication, categorie_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.titre, data.auteur, data.isbn || null, data.description || null, data.prix,
     data.stock ?? 0, data.image_url || null, data.date_publication || null,
     data.categorie_id || null, data.created_by || null]
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return findById(id);
  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  await pool.query(`UPDATE ouvrages SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM ouvrages WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findPublic, findById, create, update, remove };
