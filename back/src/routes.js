import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { hosts } from './data/hosts.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dbPromise from './database.js';

const __filename = fileURLToPath(import.meta.url); // Caminho do arquivo atual
const __dirname = path.dirname(__filename); // Diretório do arquivo atual

const router = express.Router();

//Trata dos erros HTTP
class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

// Servir arquivos estáticos do diretório 'public'
router.use(express.static(path.join(__dirname, '../public')));

// Rota para servir o arquivo index.html na raiz
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Rota para servir o arquivo signup.html
router.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'signup.html'));
});

// Rota para servir o arquivo login.html
router.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Rota para servir o arquivo about.html
router.get('/public/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'about.html'));
});

// Rota para servir o arquivo dashboard.html
router.get('/public/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

// Rota para servir o arquivo index.html na pasta public
router.get('/public/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Obter todos os usuários
router.get('/api/users', async (req, res) => {
  const db = await dbPromise;
  const users = await db.all('SELECT * FROM users');
  res.json(users);
});

// Registrar um novo usuário
router.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError('Please fill in all fields', 400);
  }

 // const userExists = hosts.some((host) => host.email === email);

  const db = await dbPromise;
  const userExists = await db.get('SELECT * FROM users WHERE email = ?', email);

  if (userExists) {
    throw new HttpError('Email already registered. Please use another email.', 400);
  }

  const id = uuidv4();
 // const newUser = { id, name, email, password };
 
 await db.run('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', id , name, email, password);
  
// hosts.push(newUser);

res.status(201).json({id, name, email, password});
});


//   // Atualizar o arquivo hosts.js
//   const hostsContent = `export const hosts = ${JSON.stringify(hosts, null, 2)};`;

//   fs.writeFile(path.join(__dirname, './data/hosts.js'), hostsContent, (err) => {
//     if (err) {
//       console.error('Erro ao salvar usuário:', err);
//       throw new HttpError('Unable to save user data', 500);
//     }

//     res.status(201).json(newUser);
//   });
// });

// Autenticar um usuário
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const db = await dbPromise;
  const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', email, password);

// const user = hosts.find((host) => host.email === email && host.password === password);

  if (!user) {
    throw new HttpError('Invalid email or password', 401);
  }

  res.status(200).json({ message: 'Login successful', user });
});

// Tratativa de Erros!
router.use((req, res, next) => {
  return res.status(404).json({ message: 'Content not found' });
});

// Erro genérico
router.use((err, req, res, next) => {
  console.error(err.stack); // stack é o rastreamento do erro, ou seja, vai mostrar onde o erro ocorreu

  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Something broke!' });
});

export default router;