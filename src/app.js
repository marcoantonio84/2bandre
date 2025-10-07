// src/app.js
const express = require('express');
const clientesRoutes = require('./routes/clientesRoutes');

const app = express();
app.use(express.json());
app.use('/clientes', clientesRoutes);

module.exports = app; // exporta para testes
