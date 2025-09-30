const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const clientesRoutes = require('../src/routes/clientesRoutes');
const clientesController = require('../src/controllers/clientesController');

const app = express();
app.use(bodyParser.json());
app.use('/api', clientesRoutes);

beforeEach(() => {
  clientesController.limparClientes();
});

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
    expect(clientesController.getClientes().length).toBe(1);
  });

  test('Não deve cadastrar cliente sem nome', async () => {
    const clienteInvalido = {
      nome: '',
      email: 'teste@email.com'
    };

    const response = await request(app)
      .post('/api/clientes')
      .send(clienteInvalido)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'O nome do cliente é obrigatório e deve ser uma string.');
  });
  
  test('Não deve cadastrar cliente com e-mail inválido', async () => {
    const clienteInvalido = {
      nome: 'João Souza',
      email: 'email-invalido'
    };

    const response = await request(app)
      .post('/api/clientes')
      .send(clienteInvalido)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'O e-mail do cliente é obrigatório e deve ser um e-mail válido.');
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