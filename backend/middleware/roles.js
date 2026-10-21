const AppError = require('../utils/AppError');

// Autorise uniquement les roles listes, ex. authorize('gestionnaire', 'administrateur')
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError('Authentification requise', 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Acces interdit pour votre role', 403));
    }
    next();
  };
}

module.exports = { authorize };
