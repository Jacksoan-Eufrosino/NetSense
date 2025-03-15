import express from 'express';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from './middleware/auth.js';
import prisma from './database/database.js';
import httpService from './services/httpService.js';
import requestsRepository from './models/requestsRepository.js';

const router = express.Router();

// Rotas de Usuário (mantidas intactas)
router.post('/createUser', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const user = await prisma.user.create({
      data: { name, email, password }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (user && user.password === password) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ auth: true, token });
    } else {
      res.status(401).json({ auth: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
});

// Novas Rotas de Requisições (substituindo as de tráfego)
router.post('/requests', isAuthenticated, async (req, res) => {
  try {
    const result = await httpService.sendRequest(req.body, req.userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

router.get('/requests', isAuthenticated, async (req, res) => {
  try {
    const requests = await requestsRepository.findByUserId(req.userId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

router.delete('/requests', isAuthenticated, async (req, res) => {
  try {
    await requestsRepository.clearHistory(req.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao limpar histórico' });
  }
});

// Rotas de Usuário Existente (mantidas)
router.get('/users/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

export default router;