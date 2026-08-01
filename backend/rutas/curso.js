const express = require('express');
const router = express.Router();

const cursoController = require('../controller/cursoController');
router.get('/', cursoController.list);
router.post('/', cursoController.save);
router.delete('/:cod_cur', cursoController.delete);
router.get('/:cod_cur', cursoController.edit);
router.post('/:cod_cur', cursoController.update);

module.exports = router;