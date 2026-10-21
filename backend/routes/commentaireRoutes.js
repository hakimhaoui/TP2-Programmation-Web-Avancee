const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { validerCommentaireValidator } = require('../validators/listeValidators');

// Validation / rejet d'un commentaire : editeur, gestionnaire, administrateur
router.put('/:id/valider', auth, authorize('editeur', 'gestionnaire', 'administrateur'),
  validerCommentaireValidator, validate, avisController.validerCommentaire);

module.exports = router;
