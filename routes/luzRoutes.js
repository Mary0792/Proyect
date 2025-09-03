const express = require('express');
const LuzController = require('../controllers/LuzController');

const router = express.Router();

// Rutas CRUD para sensores de luz
router.post('/', LuzController.create);
router.get('/', LuzController.getAll);
router.get('/stats', LuzController.getStats);
router.get('/:id', LuzController.getById);
router.put('/:id', LuzController.update);
router.delete('/:id', LuzController.delete);

module.exports = router;
