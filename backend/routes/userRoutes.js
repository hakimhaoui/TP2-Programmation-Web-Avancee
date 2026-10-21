const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { updateUserValidator, idParamValidator } = require('../validators/authValidators');

router.get('/me', auth, userController.getMe);
router.get('/', auth, authorize('administrateur'), userController.getAll);
router.put('/:id', auth, updateUserValidator, validate, userController.updateUser);

module.exports = router;
