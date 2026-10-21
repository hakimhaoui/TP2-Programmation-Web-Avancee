const { body, param } = require('express-validator');

const registerValidator = [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ max: 100 }).withMessage('Le nom est trop long'),
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('mot_de_passe').isString().isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caracteres'),
  body('telephone').optional({ values: 'falsy' }).isLength({ max: 20 }),
  body('adresse').optional({ values: 'falsy' }).isLength({ max: 255 }),
  // Le role n'est jamais pris du body a l'inscription : toujours 'client'
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('mot_de_passe').notEmpty().withMessage('Le mot de passe est obligatoire'),
];

const updateUserValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
  body('nom').optional().trim().notEmpty().isLength({ max: 100 }),
  body('email').optional().trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('mot_de_passe').optional().isString().isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caracteres'),
  body('telephone').optional({ values: 'falsy' }).isLength({ max: 20 }),
  body('adresse').optional({ values: 'falsy' }).isLength({ max: 255 }),
  body('role').optional()
    .isIn(['client', 'editeur', 'gestionnaire', 'administrateur'])
    .withMessage('Role invalide'),
];

const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide'),
];

module.exports = { registerValidator, loginValidator, updateUserValidator, idParamValidator };
