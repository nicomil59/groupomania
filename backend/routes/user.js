// Imports

const express = require('express');
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

// Création du routeur Express

const router = express.Router();

// Création des routes

router.post('/signup', userCtrl.signup);
router.post('/signin', userCtrl.signin);
router.get('/:id', auth, userCtrl.getUser);
router.put('/:id', auth, userCtrl.updatePwdUser);
router.delete('/:id', auth, userCtrl.deleteUser);

// Exports

module.exports = router;