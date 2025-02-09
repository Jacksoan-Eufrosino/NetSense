import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { hosts } from './data/hosts.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Caminho do arquivo atual
const __dirname = path.dirname(__filename); // Diretório do arquivo atual

const router = express.Router();

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

// Rota para servir o arquivo index.html na raiz
router.get('/', (req, res) => {
  console.log('Rota / acessada')
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

// Rota para servir o arquivo error.html
router.get('/error.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'error.html'));
});

// Rota para servir o arquivo dashboard.html
router.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

// Rota para servidor o arquivo about.html
router.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'about.html'));
});

// Rota para servidor o index.html
router.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Registrar um novo usuário
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError('Please fill in all fields', 400);
  }

  const userExists = hosts.some((host) => host.email === email);

  if (userExists) {
    throw new HttpError('Email already registered. Please use another email.', 400);
  }

  const id = uuidv4();
  const newUser = { id, name, email, password };
  hosts.push(newUser);

  // Atualizar o arquivo hosts.js
  const hostsContent = `export const hosts = ${JSON.stringify(hosts, null, 2)};`;

  fs.writeFile('./src/data/hosts.js', hostsContent, (err) => {
    if (err) {
      throw new HttpError('Unable to save user data', 500);
    }

    res.status(201).json(newUser);
  });
});

// Login do usuário
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = hosts.find((host) => host.email === email && host.password === password);

  if (!user) {
    throw new HttpError('Invalid email or password', 401);
  }

  res.status(200).json({ message: 'Login successful', user });
});

// Obter todos os hosts ou filtrar hosts com base nos parâmetros de consulta
router.get('/data/hosts', (req, res) => {
  const where = req.query;

  if (Object.keys(where).length) {
    const filteredHosts = hosts.filter((host) => {
      return Object.keys(where).every((key) => {
        return host[key] === where[key];
      });
    });
    return res.json(filteredHosts);
  }

  return res.json(hosts);
});

// Obter um host pelo ID
router.get('/data/hosts/:id', (req, res) => {
  const { id } = req.params;

  const host = hosts.find((host) => host.id === id);

  if (!host) {
    throw new HttpError('Host not found', 404);
  }

  res.json(host);
});

// Atualizar um host pelo ID
router.put('/data/hosts/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError('Please fill in all fields', 400);
  }

  const host = hosts.find((host) => host.id === id);

  if (!host) {
    throw new HttpError('Host not found', 404);
  }

  host.name = name;
  host.email = email;
  host.password = password;

  // Atualizar o arquivo hosts.js
  const hostsContent = `export const hosts = ${JSON.stringify(hosts, null, 2)};`;

  fs.writeFile('./src/data/hosts.js', hostsContent, (err) => {
    if (err) {
      throw new HttpError('Unable to save user data', 500);
    }

    res.json(host);
  });
});

// Deletar um host pelo ID
router.delete('/data/hosts/:id', (req, res) => {
  const { id } = req.params;

  const index = hosts.findIndex((host) => host.id === id);

  if (index === -1) {
    throw new HttpError('Unable to delete host', 404);
  }

  hosts.splice(index, 1);

  // Atualizar o arquivo hosts.js
  const hostsContent = `export const hosts = ${JSON.stringify(hosts, null, 2)};`;

  fs.writeFile('./src/data/hosts.js', hostsContent, (err) => {
    if (err) {
      throw new HttpError('Unable to save user data', 500);
    }

    res.sendStatus(204);
  });
});



export default router;