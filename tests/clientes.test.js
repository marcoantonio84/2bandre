const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const clientesRoutes = require('../src/routes/clientesRoutes');
const clientesController = require('../src/controllers/clientesController');
const db = require('../src/config/db'); // Importe o db para limpar o banco de dados

const app = express();
app.use(bodyParser.json());
app.use('/api', clientesRoutes);

beforeEach(async () => {
  await clientesController.limparClientes();
});

// Continue com os testes como antes, mas agora eles interagem com o PostgreSQL

describe('POST /api/clientes', () => {
  test('Deve cadastrar um novo cliente com sucesso', async () => {
    const novoCliente = {
      nome: 'Maria da Silva',
      email: 'maria@email.com'
    };

    const response = await request(app)
      .post('/api/clientes')
      .send(novoCliente)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Cliente cadastrado com sucesso!');
    expect(response.body.cliente.nome).toBe(novoCliente.nome);
    expect(response.body.cliente.email).toBe(novoCliente.email);
    expect(response.body.cliente).toHaveProperty('id');
  });

  // Testes para validações
  test('Não deve cadastrar cliente com e-mail já existente', async () => {
    const clienteExistente = { nome: 'João', email: 'joao@email.com' };
    await request(app).post('/api/clientes').send(clienteExistente);
    
    const response = await request(app)
      .post('/api/clientes')
      .send(clienteExistente)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Este e-mail já está cadastrado.');
  });
});

describe('GET /api/clientes', () => {
  test('Deve retornar uma lista vazia se nenhum cliente foi cadastrado', async () => {
    const response = await request(app)
      .get('/api/clientes')
      .expect(200);

    expect(response.body.clientes).toEqual([]);
  });

  test('Deve retornar a lista de clientes cadastrados', async () => {
    await request(app)
      .post('/api/clientes')
      .send({ nome: 'Ana Carolina', email: 'ana@email.com' });
    
    const response = await request(app)
      .get('/api/clientes')
      .expect(200);
    
    expect(response.body.clientes.length).toBe(1);
    expect(response.body.clientes[0].nome).toBe('Ana Carolina');
  });
});

afterAll(async () => {
  await db.query('TRUNCATE TABLE clientes RESTART IDENTITY');
  await db.query('SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = current_database() AND pid <> pg_backend_pid();');
});