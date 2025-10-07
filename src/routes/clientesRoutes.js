// src/routes/clientesRoutes.js
const express = require('express');
const { cadastrarCliente, listarClientes } = require('../controllers/clientesController');

const router = express.Router();

router.post('/', cadastrarCliente);
router.get('/', listarClientes);

module.exports = router;
