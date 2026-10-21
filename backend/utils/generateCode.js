const crypto = require('crypto');

// Code de partage unique d'une liste de cadeaux, ex. : LC-8F3K2Q9A
function generateShareCode() {
  return 'LC-' + crypto.randomBytes(5).toString('hex').toUpperCase();
}

// Reference fictive d'un paiement simule (aucune donnee bancaire)
function generatePaymentReference() {
  return 'SIM-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

module.exports = { generateShareCode, generatePaymentReference };
