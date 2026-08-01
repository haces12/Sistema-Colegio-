const express = require('express');
const router = express.Router();

const aulaController = require('../controller/aulaController');
router.get('/', aulaController.list);
router.post('/', aulaController.save);
router.delete('/:id_aula', aulaController.delete);
router.get('/:id_aula', aulaController.edit);
router.post('/:id_aula', aulaController.update);

module.exports = router;