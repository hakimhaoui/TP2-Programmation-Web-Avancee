const { body, param } = require('express-validator');

const createListeValidator = [
  body('nom').trim().notEmpty().withMessage('Le nom de la liste est obligatoire')
    .isLength({ max: 150 }),
  body('description').optional({ values: 'falsy' }).isString(),
  body('items').optional().isArray().withMessage('items doit etre un tableau'),
  body('items.*.ouvrage_id').optional().isInt({ min: 1 }),
  body('items.*.quantite').optional().isInt({ min: 1 }),
];

const addListeItemValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  body('ouvrage_id').isInt({ min: 1 }).withMessage('ouvrage_id invalide'),
  body('quantite').optional().isInt({ min: 1 }),
];

const acheterListeValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  // On achete soit par item_id, soit par ouvrage_id
  body('item_id').optional().isInt({ min: 1 }),
  body('ouvrage_id').optional().isInt({ min: 1 }),
];

const createAvisValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  body('note').isInt({ min: 1, max: 5 }).withMessage('La note doit etre entre 1 et 5'),
  body('titre').optional({ values: 'falsy' }).isLength({ max: 150 }),
  body('contenu').optional({ values: 'falsy' }).isString(),
];

const createCommentaireValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  body('contenu').trim().notEmpty().withMessage('Le contenu est obligatoire'),
];

const validerCommentaireValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  body('valide').optional().isBoolean().withMessage('valide doit etre true ou false'),
  body('action').optional().isIn(['valider', 'rejeter']).withMessage('Action invalide'),
];

module.exports = {
  createListeValidator, addListeItemValidator, acheterListeValidator,
  createAvisValidator, createCommentaireValidator, validerCommentaireValidator,
};
