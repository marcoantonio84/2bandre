// tests/clientes.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

beforeAll(async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE
    );
  `);
});

beforeEach(async () => {
  await db.query('TRUNCATE TABLE clientes RESTART IDENTITY');
});

describe('POST /clientes', () => {
  test('Deve cadastrar um novo cliente com sucesso', async () => {
    const novoCliente = { nome: 'Maria da Silva', email: 'maria@email.com' };
    const response = await request(app).post('/clientes').send(novoCliente).expect(201);

    expect(response.body).toHaveProperty('message', 'Cliente cadastrado com sucesso!');
    expect(response.body.cliente.nome).toBe(novoCliente.nome);
    expect(response.body.cliente.email).toBe(novoCliente.email);
    expect(response.body.cliente).toHaveProperty('id');
  });

  test('Não deve cadastrar cliente com e-mail já existente', async () => {
    const clienteExistente = { nome: 'João', email: 'joao@email.com' };
    await request(app).post('/clientes').send(clienteExistente);

    const response = await request(app).post('/clientes').send(clienteExistente).expect(400);
    expect(response.body).toHaveProperty('error', 'Este e-mail já está cadastrado.');
  });
});

describe('GET /clientes', () => {
  test('Deve retornar lista vazia se nenhum cliente cadastrado', async () => {
    const response = await request(app).get('/clientes').expect(200);
    expect(response.body.clientes).toEqual([]);
  });

  test('Deve retornar lista de clientes cadastrados', async () => {
    await request(app).post('/clientes').send({ nome: 'Ana Carolina', email: 'ana@email.com' });

    const response = await request(app).get('/clientes').expect(200);
    expect(response.body.clientes.length).toBe(1);
    expect(response.body.clientes[0].nome).toBe('Ana Carolina');
  });
});

afterAll(async () => {
  await db.query('DROP TABLE IF EXISTS clientes');
  await db.end();
});
