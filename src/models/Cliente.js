class Cliente {
  constructor(nome, email) {
    if (!nome || typeof nome !== 'string') {
      throw new Error('O nome do cliente é obrigatório e deve ser uma string.');
    }
    if (!email || typeof email !== 'string' || !this.validarEmail(email)) {
      throw new Error('O e-mail do cliente é obrigatório e deve ser um e-mail válido.');
    }

    this.id = Math.random().toString(36).substr(2, 9);
    this.nome = nome;
    this.email = email;
  }

  validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
}

module.exports = Cliente;