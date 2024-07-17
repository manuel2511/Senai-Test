const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Para aceitar dados de formulário
app.set('view engine', 'ejs'); // Set the view engine to EJS

// Usuários fictícios para teste
const users = [
  {
    id: 1,
    nome: 'Manuel',
    email: 'a@a.com',
    password: '123' // senha fictícia
  }
];

app.get('/signup', (req, res) => {
  res.render('signup'); // Render the signup view
});

app.post('/signup', (req, res) => {
  const { nome, email, senha, confirmacaoSenha } = req.body;
  
  if (!nome || !email || !senha || !confirmacaoSenha) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  if (senha !== confirmacaoSenha) {
    return res.status(200).send('Senhas não correspondem');
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(200).send('E-mail já cadastrado');
  }

  users.push({ nome, email, senha });
  res.redirect('/welcome');
});

app.get('/welcome', (req, res) => {
  res.send('Welcome');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, users };
