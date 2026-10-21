// Erreur metier avec un code HTTP, lue par le gestionnaire centralise
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
