const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

router.post('/clientes', clientesController.criarCliente);
router.get('/clientes', clientesController.listarClientes);

module.exports = router;