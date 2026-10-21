const express = require('express');
const router = express.Router();
const ouvrageController = require('../controllers/ouvrageController');
const avisController = require('../controllers/avisController');
const { auth, optionalAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { idParamValidator } = require('../validators/authValidators');
const {
  ouvrageValidator, updateOuvrageValidator, listOuvragesValidator,
} = require('../validators/ouvrageValidators');
const {
  createAvisValidator, createCommentaireValidator,
} = require('../validators/listeValidators');

// Public
router.get('/', listOuvragesValidator, validate, ouvrageController.getAll);
router.get('/:id', optionalAuth, idParamValidator, validate, ouvrageController.getById);

// Modifications : editeur, gestionnaire, administrateur (suppression : staff seulement)
router.post('/', auth, authorize('editeur', 'gestionnaire', 'administrateur'),
  ouvrageValidator, validate, ouvrageController.create);
router.put('/:id', auth, authorize('editeur', 'gestionnaire', 'administrateur'),
  updateOuvrageValidator, validate, ouvrageController.update);
router.delete('/:id', auth, authorize('gestionnaire', 'administrateur'),
  idParamValidator, validate, ouvrageController.remove);

// Avis : client ayant achete l'ouvrage (verifie dans le controleur)
router.post('/:id/avis', auth, authorize('client'),
  createAvisValidator, validate, avisController.createAvis);

// Commentaires : tout client connecte, validation par un editeur ensuite
router.post('/:id/commentaires', auth, authorize('client', 'editeur', 'gestionnaire', 'administrateur'),
  createCommentaireValidator, validate, avisController.createCommentaire);

module.exports = router;
