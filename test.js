const request = require('supertest');
const { app, users } = require('./server');

describe('Testes TDD para a aplicação Express', () => {
  beforeEach(() => {
    // Limpar usuários antes de cada teste
    users.length = 0;
    users.push({
      id: 1,
      nome: 'Manuel',
      email: 'a@a.com',
      password: '123'
    });
  });

  it('Deve retornar a página de signup', (done) => {
    request(app)
      .get('/signup')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('Deve retornar erro se campos estão faltando', (done) => {
    request(app)
      .post('/signup')
      .send({ nome: '', email: '', senha: '', confirmacaoSenha: '' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Todos os campos são obrigatórios');
        done();
      });
  });

  it('Deve retornar erro se senhas não correspondem', (done) => {
    request(app)
      .post('/signup')
      .send({ nome: 'John', email: 'john@example.com', senha: '123456', confirmacaoSenha: '654321' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Senhas não correspondem');
        done();
      });
  });

  it('Deve retornar erro se o email já está cadastrado', (done) => {
    request(app)
      .post('/signup')
      .send({ nome: 'John', email: 'a@a.com', senha: '123456', confirmacaoSenha: '123456' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('E-mail já cadastrado');
        done();
      });
  });

  it('Deve cadastrar um novo usuário e redirecionar para /welcome', (done) => {
    request(app)
      .post('/signup')
      .send({ nome: 'John', email: 'john@example.com', senha: '123456', confirmacaoSenha: '123456' })
      .expect(302)
      .expect('Location', '/welcome')
      .end((err, res) => {
        if (err) return done(err);
        expect(users).to.have.lengthOf(2);
        done();
      });
  });

  it('Deve retornar a página de welcome', (done) => {
    request(app)
      .get('/welcome')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Welcome');
        done();
      });
  });
});
