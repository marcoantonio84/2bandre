const Cliente = require('../models/Cliente');

let clientes = [];

exports.criarCliente = (req, res) => {
  try {
    const novoCliente = new Cliente(req.body.nome, req.body.email);
    clientes.push(novoCliente);
    res.status(201).json({
      message: 'Cliente cadastrado com sucesso!',
      cliente: novoCliente
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarClientes = (req, res) => {
  res.status(200).json({ clientes: clientes });
};

// Funções para os testes
exports.limparClientes = () => {
  clientes = [];
};

exports.getClientes = () => {
  return clientes;
};