const db = require('../config/db');

exports.criarCliente = async (req, res) => {
  const { nome, email } = req.body;
  
  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ error: 'O nome do cliente é obrigatório e deve ser uma string.' });
  }

  // Validação de e-mail simplificada, você pode expandir
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'O e-mail do cliente é obrigatório e deve ser um e-mail válido.' });
  }

  try {
    const text = 'INSERT INTO clientes(nome, email) VALUES($1, $2) RETURNING *';
    const values = [nome, email];
    const { rows } = await db.query(text, values);
    
    res.status(201).json({
      message: 'Cliente cadastrado com sucesso!',
      cliente: rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Código de erro para violação de UNIQUE
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }
    res.status(500).json({ error: 'Falha ao cadastrar cliente.' });
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM clientes');
    res.status(200).json({ clientes: rows });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar clientes.' });
  }
};

// Funções para os testes
exports.limparClientes = async () => {
  await db.query('TRUNCATE TABLE clientes RESTART IDENTITY');
};