const express = require('express');
const router = express.Router();

const claseController = require('../controller/claseController');
router.get('/', claseController.list);
router.post('/', claseController.save);
router.delete('/:cod_cl', claseController.delete);
router.get('/:cod_cl', claseController.edit);
router.post('/:cod_cl', claseController.update);

module.exports = router;