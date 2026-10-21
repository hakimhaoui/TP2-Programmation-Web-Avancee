const express = require('express');
const router = express.Router();
const listeController = require('../controllers/listeController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { idParamValidator } = require('../validators/authValidators');
const {
  createListeValidator, addListeItemValidator, acheterListeValidator,
} = require('../validators/listeValidators');

router.post('/', auth, authorize('client'),
  createListeValidator, validate, listeController.create);

// Consultation publique par code de partage (aucun token requis)
router.get('/:code', listeController.getByCode);

router.post('/:id/items', auth, authorize('client', 'administrateur'),
  addListeItemValidator, validate, listeController.addItem);
router.post('/:id/acheter', auth, authorize('client'),
  acheterListeValidator, validate, listeController.acheter);

module.exports = router;
