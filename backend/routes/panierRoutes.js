const express = require('express');
const router = express.Router();
const panierController = require('../controllers/panierController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { addPanierItemValidator, updatePanierItemValidator } = require('../validators/panierValidators');
const { idParamValidator } = require('../validators/authValidators');

// Panier reserve aux clients connectes
router.use(auth, authorize('client'));

router.get('/', panierController.getPanier);
router.post('/items', addPanierItemValidator, validate, panierController.addItem);
router.put('/items/:id', updatePanierItemValidator, validate, panierController.updateItem);
router.delete('/items/:id', idParamValidator, validate, panierController.removeItem);

module.exports = router;
