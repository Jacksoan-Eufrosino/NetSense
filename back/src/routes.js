import express from 'express';
import Traffic from './models/traffic.js';
import User from './models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { isAuthenticated } from './middleware/auth.js';

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

// Traffic routes
router.post('/traffic', isAuthenticated, async (req, res) => {
  const { source_ip, destination_ip, protocol, user_id } = req.body;

  if (!source_ip || !destination_ip || !protocol || !user_id) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const createdTraffic = await Traffic.create({ source_ip, destination_ip, protocol, user_id });

    return res.status(201).json(createdTraffic);
  } catch (error) {
    throw new HttpError('Unable to create traffic');
  }
});

router.get('/traffic', isAuthenticated, async (req, res) => {
  const { source_ip } = req.query;

  try {
    if (source_ip) {
      const filteredTraffic = await Traffic.read({ source_ip });

      return res.json(filteredTraffic);
    }

    const traffic = await Traffic.read();

    return res.json(traffic);
  } catch (error) {
    throw new HttpError('Unable to read traffic');
  }
});

router.get('/traffic/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const traffic = await Traffic.readById(id);

    if (traffic) {
      return res.json(traffic);
    } else {
      throw new HttpError('Traffic not found');
    }
  } catch (error) {
    throw new HttpError('Unable to read traffic');
  }
});

router.put('/traffic/:id', isAuthenticated, async (req, res) => {
  const { source_ip, destination_ip, protocol, user_id } = req.body;

  const id = req.params.id;

  if (!source_ip || !destination_ip || !protocol || !user_id) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const updatedTraffic = await Traffic.update({ id, source_ip, destination_ip, protocol, user_id });

    return res.json(updatedTraffic);
  } catch (error) {
    throw new HttpError('Unable to update traffic');
  }
});

router.delete('/traffic/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    await Traffic.remove(id);

    return res.sendStatus(204);
  } catch (error) {
    throw new HttpError('Unable to delete traffic');
  }
});

// User routes

router.post('/createUser', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const existingUser = await User.readByEmail(email);
    if (existingUser) {
      throw new HttpError('Email already in use');
    }

    const createdUser = await User.create({ name, email, password });

    delete createdUser.password;

    return res.status(201).json(createdUser);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { id: userId, password: hash } = await User.read({ email });

    const match = await bcrypt.compare(password, hash);

    if (match) {
      const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: 3600 } // 1h
      );

      return res.json({ auth: true, token });
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(401).json({ error: 'User not found' });
  }
});

// 404 handler
router.use((req, res, next) => {
  return res.status(404).json({ message: 'Content not found!' });
});

// Error handler
router.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Something broke!' });
});

export default router;