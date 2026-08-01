const express = require('express');
const router = express.Router();

const seccionController = require('../controller/seccionController');
router.get('/', seccionController.list);
router.post('/', seccionController.save);
router.delete('/:cod_sec', seccionController.delete);
router.get('/:cod_sec', seccionController.edit);
router.post('/:cod_sec', seccionController.update);

module.exports = router;