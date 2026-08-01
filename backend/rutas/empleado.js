const express = require('express');
const router = express.Router();

const empleadoController = require('../controller/empleadoController');
router.get('/', empleadoController.list);
router.post('/', empleadoController.save);
router.delete('/:id_emp', empleadoController.delete);
router.get('/:id_emp', empleadoController.edit);
router.post('/:id_emp', empleadoController.update);

module.exports = router;