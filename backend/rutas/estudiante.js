const express = require('express');
const router = express.Router();

const estudianteController = require('../controller/estudianteController');
router.get('/', estudianteController.list);
router.post('/', estudianteController.save);
router.delete('/:id_est', estudianteController.delete);
router.get('/:id_est', estudianteController.edit);
router.post('/:id_est', estudianteController.update);

module.exports = router;