const { validationResult } = require('express-validator');

// Renvoie 400 avec le detail si express-validator a trouve des erreurs
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Donnees invalides',
      errors: errors.array().map((e) => ({ champ: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { validate };
