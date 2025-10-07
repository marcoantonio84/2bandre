// src/controllers/clientesController.js
const pool = require('../config/db');

exports.cadastrarCliente = async (req, res) => {
  const { nome, email } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );

    res.status(201).json({
      message: 'Cliente cadastrado com sucesso!',
      cliente: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // email duplicado
      res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    } else {
      res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
    }
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.status(200).json({ clientes: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar clientes' });
  }
};
