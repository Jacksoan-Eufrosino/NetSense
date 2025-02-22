import express from 'express';
import Traffic from './src/models/traffic.js';
import User from './src/models/user.js';

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

// Traffic routes
router.post('/traffic', async (req, res) => {
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

router.get('/traffic', async (req, res) => {
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

router.get('/traffic/:id', async (req, res) => {
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

router.put('/traffic/:id', async (req, res) => {
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

router.delete('/traffic/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Traffic.remove(id);

    return res.sendStatus(204);
  } catch (error) {
    throw new HttpError('Unable to delete traffic');
  }
});

// User routes
router.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const createdUser = await User.create({ name, email, password });

    return res.status(201).json(createdUser);
  } catch (error) {
    throw new HttpError('Unable to create user');
  }
});

router.get('/users', async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      const filteredUsers = await User.read({ name });

      return res.json(filteredUsers);
    }

    const users = await User.read();

    return res.json(users);
  } catch (error) {
    throw new HttpError('Unable to read users');
  }
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.readById(id);

    if (user) {
      return res.json(user);
    } else {
      throw new HttpError('User not found');
    }
  } catch (error) {
    throw new HttpError('Unable to read user');
  }
});

router.put('/users/:id', async (req, res) => {
  const { name, email, password } = req.body;

  const id = req.params.id;

  if (!name || !email || !password) {
    throw new HttpError('Error when passing parameters');
  }

  try {
    const updatedUser = await User.update({ id, name, email, password });

    return res.json(updatedUser);
  } catch (error) {
    throw new HttpError('Unable to update user');
  }
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await User.remove(id);

    return res.sendStatus(204);
  } catch (error) {
    throw new HttpError('Unable to delete user');
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