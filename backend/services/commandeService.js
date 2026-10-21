const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const { generatePaymentReference } = require('../utils/generateCode');
const commandeRepository = require('../repositories/commandeRepository');

// ---------------------------------------------------------------
// Creation d'une commande a partir du panier du client.
// Transaction MySQL + SELECT ... FOR UPDATE sur les ouvrages :
// le stock est verifie et decremente de facon atomique, donc
// pas de stock negatif ni de double decrementation possible.
// Le paiement est simule : aucune donnee bancaire n'est traitee.
// ---------------------------------------------------------------
async function createCommandeFromPanier(userId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [paniers] = await connection.query(
      'SELECT * FROM panier WHERE user_id = ? FOR UPDATE', [userId]
    );
    if (paniers.length === 0) throw new AppError('Panier introuvable', 404);
    const panier = paniers[0];

    const [items] = await connection.query(
      'SELECT * FROM panier_items WHERE panier_id = ? ORDER BY ouvrage_id', [panier.id]
    );
    if (items.length === 0) throw new AppError('Le panier est vide', 400);

    // Verrouillage des ouvrages concernes (ordre par id = anti-interblocage)
    let total = 0;
    for (const item of items) {
      const [ouvrages] = await connection.query(
        'SELECT * FROM ouvrages WHERE id = ? FOR UPDATE', [item.ouvrage_id]
      );
      if (ouvrages.length === 0) {
        throw new AppError(`Ouvrage ${item.ouvrage_id} introuvable`, 404);
      }
      const ouvrage = ouvrages[0];
      if (ouvrage.stock < item.quantite) {
        throw new AppError(
          `Stock insuffisant pour "${ouvrage.titre}" (disponible : ${ouvrage.stock})`, 409);
      }
      total += Number(item.prix_unitaire) * item.quantite;
    }

    // Paiement simule accepte, puis creation de la commande
    const reference = generatePaymentReference();
    const [cmd] = await connection.query(
      `INSERT INTO commandes (user_id, statut, total, mode_paiement, reference_paiement)
       VALUES (?, 'payee', ?, 'simulation', ?)`,
      [userId, total.toFixed(2), reference]
    );
    const commandeId = cmd.insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [commandeId, item.ouvrage_id, item.quantite, item.prix_unitaire]
      );
      // Decrementation protegee : le CHECK stock >= 0 reste une derniere garde
      await connection.query(
        'UPDATE ouvrages SET stock = stock - ?, popularite = popularite + ? WHERE id = ?',
        [item.quantite, item.quantite, item.ouvrage_id]
      );
    }

    // Le panier est vide une seule fois, dans la meme transaction
    await connection.query('DELETE FROM panier_items WHERE panier_id = ?', [panier.id]);

    await connection.commit();

    const commande = await commandeRepository.findById(commandeId);
    commande.items = await commandeRepository.getItems(commandeId);
    commande.paiement = { simule: true, reference, statut: 'accepte' };
    return commande;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ---------------------------------------------------------------
// Changement de statut. L'annulation d'une commande non annulee
// restaure le stock une seule fois (transaction + verrouillage).
// Aucune decrementation n'a lieu ici : elle se fait a la creation.
// ---------------------------------------------------------------
async function updateStatut(commandeId, nouveauStatut) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT * FROM commandes WHERE id = ? FOR UPDATE', [commandeId]
    );
    if (rows.length === 0) throw new AppError('Commande introuvable', 404);
    const commande = rows[0];

    if (commande.statut === nouveauStatut) {
      throw new AppError(`La commande est deja au statut "${nouveauStatut}"`, 409);
    }
    if (commande.statut === 'annulee') {
      throw new AppError('Une commande annulee ne peut plus changer de statut', 409);
    }
    if (commande.statut === 'livree' && nouveauStatut !== 'livree') {
      throw new AppError('Une commande livree ne peut plus changer de statut', 409);
    }

    if (nouveauStatut === 'annulee') {
      const [items] = await connection.query(
        'SELECT * FROM commande_items WHERE commande_id = ? ORDER BY ouvrage_id', [commandeId]
      );
      for (const item of items) {
        await connection.query(
          'UPDATE ouvrages SET stock = stock + ? WHERE id = ?', [item.quantite, item.ouvrage_id]
        );
      }
    }

    await connection.query('UPDATE commandes SET statut = ? WHERE id = ?', [nouveauStatut, commandeId]);
    await connection.commit();

    const updated = await commandeRepository.findById(commandeId);
    updated.items = await commandeRepository.getItems(commandeId);
    return updated;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { createCommandeFromPanier, updateStatut };
