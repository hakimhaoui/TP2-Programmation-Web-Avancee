const { body, param } = require('express-validator');

const addPanierItemValidator = [
  body('ouvrage_id').isInt({ min: 1 }).withMessage('ouvrage_id invalide'),
  body('quantite').optional().isInt({ min: 1 }).withMessage('La quantite doit etre >= 1'),
];

const updatePanierItemValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  body('quantite').isInt({ min: 1 }).withMessage('La quantite doit etre >= 1'),
];

const createCommandeValidator = [
  // Paiement simule uniquement : on n'accepte qu'un mode, jamais de donnees bancaires
  body('mode_paiement').optional().isIn(['simulation', 'simule', 'carte_simulee'])
    .withMessage('Seul le paiement simule est accepte'),
];

const updateStatusValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  body('statut').isIn(['en_attente', 'payee', 'expediee', 'livree', 'annulee'])
    .withMessage('Statut invalide'),
];

module.exports = {
  addPanierItemValidator, updatePanierItemValidator,
  createCommandeValidator, updateStatusValidator,
};
