// Imports

const express = require('express');
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');

// Création du routeur Express

const router = express.Router();

// Création des routes

router.post('/:id/comment', auth, commentCtrl.createComment);
// router.put('/:id/comment/:id', auth, commentCtrl.updateComment);
// router.delete('/:id/comment/:id', auth, commentCtrl.deleteComment);

// Exports

module.exports = router;