const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { createCommandeValidator, updateStatusValidator } = require('../validators/panierValidators');
const { idParamValidator } = require('../validators/authValidators');

router.post('/', auth, authorize('client'),
  createCommandeValidator, validate, commandeController.create);
router.get('/', auth, commandeController.getAll);
router.get('/:id', auth, idParamValidator, validate, commandeController.getById);
router.put('/:id/status', auth, authorize('gestionnaire', 'administrateur'),
  updateStatusValidator, validate, commandeController.updateStatus);

module.exports = router;
