const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { idParamValidator } = require('../validators/authValidators');
const { categorieValidator } = require('../validators/ouvrageValidators');

router.get('/', categorieController.getAll);
router.post('/', auth, authorize('gestionnaire', 'administrateur'),
  categorieValidator, validate, categorieController.create);
router.put('/:id', auth, authorize('gestionnaire', 'administrateur'),
  idParamValidator, categorieValidator, validate, categorieController.update);
router.delete('/:id', auth, authorize('gestionnaire', 'administrateur'),
  idParamValidator, validate, categorieController.remove);

module.exports = router;
