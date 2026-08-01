const express = require('express');
const router = express.Router();

const usuarioController = require('../controller/usuarioController');
router.get('/', usuarioController.list);
router.post('/', usuarioController.save);
router.delete('/:id_usuario', usuarioController.delete);
router.get('/:id_usuario', usuarioController.edit);
router.post('/:id_usuario', usuarioController.update);

module.exports = router;
