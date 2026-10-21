const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Verifie le JWT : Authorization: Bearer <token>
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentification requise', 401));
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    return next(new AppError('Token invalide ou expire', 401));
  }
}

// Authentification optionnelle (ex. affichage public enrichi si connecte)
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
  } catch (error) {
    // Token invalide sur une route publique : on continue sans utilisateur
  }
  next();
}

module.exports = { auth, optionalAuth };
