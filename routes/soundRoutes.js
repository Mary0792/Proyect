const express = require('express');
const SoundController = require('../controllers/SoundController');

const router = express.Router();

// Rutas CRUD para sensores de sonido
router.post('/', SoundController.create);
router.get('/', SoundController.getAll);
router.get('/stats', SoundController.getStats);
router.get('/:id', SoundController.getById);
router.put('/:id', SoundController.update);
router.delete('/:id', SoundController.delete);

module.exports = router;
