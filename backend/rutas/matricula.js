const express = require('express');
const router = express.Router();

const matriculaController = require('../controller/matriculaController');
router.get('/', matriculaController.list);
router.post('/', matriculaController.save);
router.delete('/:id_mat', matriculaController.delete);
router.get('/:id_mat', matriculaController.edit);
router.post('/:id_mat', matriculaController.update);

module.exports = router;