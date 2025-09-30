const express = require('express');
const bodyParser = require('body-parser');
const clientesRoutes = require('./src/routes/clientesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', clientesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});