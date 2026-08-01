const express = require('express');
const router = express.Router();

const profesorController = require('../controller/profesorController');
router.get('/', profesorController.list);
router.post('/', profesorController.save);
router.delete('/:id_emp', profesorController.delete);
router.get('/:id_emp', profesorController.edit);
router.post('/:id_emp', profesorController.update);

module.exports = router;