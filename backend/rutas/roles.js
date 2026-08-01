const express = require('express');
const router = express.Router();

const rolesController = require('../controller/rolesController');
router.get('/', rolesController.list);
router.post('/', rolesController.save);
router.delete('/:id_roles', rolesController.delete);
router.get('/:id_roles', rolesController.edit);
router.post('/:id_roles', rolesController.update);

module.exports = router;