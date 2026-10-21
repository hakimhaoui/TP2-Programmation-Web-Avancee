const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Route introuvable : ${req.method} ${req.originalUrl}`, 404));
}

// Gestion centralisee des erreurs : toute erreur passe ici
function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  // Cle dupliquee MySQL (email, isbn, code de partage, avis deja donne...)
  if (err.code === 'ER_DUP_ENTRY') {
    status = 409;
    message = 'Conflit : une donnee identique existe deja';
  }
  // Cle etrangere invalide
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    status = 400;
    message = 'Reference invalide ou donnee encore utilisee ailleurs';
  }
  // Contrainte CHECK violee (prix, stock, quantite, note)
  if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    status = 400;
    message = 'Valeur interdite (prix, stock, quantite ou note invalide)';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
