// src/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db", // "db" é o nome do serviço no docker-compose
  database: process.env.DB_NAME || "clientes_db",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
