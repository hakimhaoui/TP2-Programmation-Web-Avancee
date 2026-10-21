require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { pool } = require('../config/db');

// ---------------------------------------------------------------
// Nettoyage des paniers inactifs : vide les paniers dont la
// derniere activite depasse PANIER_INACTIF_JOURS jours (defaut 7).
// Lancement : npm run cleanup:paniers
// A planifier avec le Planificateur de taches Windows ou cron.
// ---------------------------------------------------------------
async function cleanupPaniersInactifs() {
  const jours = Number(process.env.PANIER_INACTIF_JOURS) || 7;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [items] = await connection.query(
      `DELETE pi FROM panier_items pi
       JOIN panier p ON p.id = pi.panier_id
       WHERE p.updated_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [jours]
    );
    const [paniers] = await connection.query(
      'DELETE FROM panier WHERE updated_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [jours]
    );
    await connection.commit();
    console.log(`Paniers inactifs (> ${jours} jours) nettoyes : ` +
      `${paniers.affectedRows} panier(s), ${items.affectedRows} article(s) supprime(s).`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

if (require.main === module) {
  cleanupPaniersInactifs()
    .then(() => pool.end())
    .catch((error) => { console.error(error); process.exit(1); });
}

module.exports = { cleanupPaniersInactifs };
