const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const { generatePaymentReference } = require('../utils/generateCode');

// ---------------------------------------------------------------
// Achat d'un article d'une liste de cadeaux (paiement simule).
// Transaction + FOR UPDATE : verification du stock, decrementation,
// puis marquage "achete" de facon atomique.
// ---------------------------------------------------------------
async function acheterItem(listeId, item, acheteurId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [items] = await connection.query(
      'SELECT * FROM liste_items WHERE id = ? AND liste_id = ? FOR UPDATE', [item.id, listeId]
    );
    if (items.length === 0) throw new AppError('Article introuvable dans la liste', 404);
    const listeItem = items[0];
    if (listeItem.achete) throw new AppError('Cet article a deja ete achete', 409);

    const [ouvrages] = await connection.query(
      'SELECT * FROM ouvrages WHERE id = ? FOR UPDATE', [listeItem.ouvrage_id]
    );
    if (ouvrages.length === 0) throw new AppError('Ouvrage introuvable', 404);
    const ouvrage = ouvrages[0];
    if (ouvrage.stock < listeItem.quantite) {
      throw new AppError(`Stock insuffisant pour "${ouvrage.titre}"`, 409);
    }

    await connection.query(
      'UPDATE ouvrages SET stock = stock - ?, popularite = popularite + ? WHERE id = ?',
      [listeItem.quantite, listeItem.quantite, ouvrage.id]
    );
    await connection.query(
      'UPDATE liste_items SET achete = 1, achete_par = ? WHERE id = ?',
      [acheteurId, listeItem.id]
    );

    await connection.commit();
    return {
      liste_id: listeId,
      item_id: listeItem.id,
      ouvrage_id: ouvrage.id,
      titre: ouvrage.titre,
      quantite: listeItem.quantite,
      total: Number(ouvrage.prix) * listeItem.quantite,
      paiement: { simule: true, reference: generatePaymentReference(), statut: 'accepte' },
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { acheterItem };
