const { body, param, query } = require('express-validator');

const ouvrageValidator = [
  body('titre').trim().notEmpty().withMessage('Le titre est obligatoire')
    .isLength({ max: 200 }),
  body('auteur').trim().notEmpty().withMessage('L\'auteur est obligatoire')
    .isLength({ max: 150 }),
  body('isbn').optional({ values: 'falsy' }).isLength({ max: 20 }),
  body('description').optional({ values: 'falsy' }).isString(),
  body('prix').isFloat({ min: 0 }).withMessage('Le prix doit etre >= 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Le stock doit etre >= 0'),
  body('categorie_id').optional({ values: 'falsy' }).isInt({ min: 1 }),
  body('image_url').optional({ values: 'falsy' }).isLength({ max: 255 }),
  body('date_publication').optional({ values: 'falsy' }).isDate()
    .withMessage('Date de publication invalide (AAAA-MM-JJ)'),
];

const updateOuvrageValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  body('titre').optional().trim().notEmpty().isLength({ max: 200 }),
  body('auteur').optional().trim().notEmpty().isLength({ max: 150 }),
  body('isbn').optional({ values: 'falsy' }).isLength({ max: 20 }),
  body('description').optional({ values: 'falsy' }).isString(),
  body('prix').optional().isFloat({ min: 0 }).withMessage('Le prix doit etre >= 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Le stock doit etre >= 0'),
  body('categorie_id').optional({ values: 'falsy' }).isInt({ min: 1 }),
  body('image_url').optional({ values: 'falsy' }).isLength({ max: 255 }),
  body('date_publication').optional({ values: 'falsy' }).isDate(),
];

const listOuvragesValidator = [
  query('search').optional().isString().isLength({ max: 200 }),
  query('categorie_id').optional().isInt({ min: 1 }).withMessage('categorie_id invalide'),
  query('categorie').optional().isString().isLength({ max: 100 }),
  query('tri').optional().isIn(['popularite', 'prix_asc', 'prix_desc', 'recent', 'titre'])
    .withMessage('Tri invalide'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const categorieValidator = [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire').isLength({ max: 100 }),
  body('description').optional({ values: 'falsy' }).isString(),
];

module.exports = { ouvrageValidator, updateOuvrageValidator, listOuvragesValidator, categorieValidator };
