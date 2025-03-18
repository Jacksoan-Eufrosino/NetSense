import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './back/src/routes.js';
import prisma from './back/src/database/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, 'back/.env') });

const app = express();
let requestHistory = [];

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'front/public')));

// Usar as rotas definidas no arquivo routes.js
app.use('/api', routes);

// Rota para processar requisições HTTP personalizadas
app.post('/track', async (req, res) => {
  try {
    const startTime = Date.now();
    const { method, url, headers = {}, body } = req.body;

    const response = await axios({
      method,
      url,
      headers,
      data: body,
      validateStatus: () => true,
      responseType: 'arraybuffer'
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    
    const entry = {
      id: Date.now(),
      method: method.toUpperCase(),
      url,
      response: {
        status: response.status,
        headers: response.headers,
        time: Date.now() - startTime,
        body: response.data.toString('base64'),
        type: contentType.split(';')[0],
        isText: /text|json|xml/.test(contentType)
      },
      request: { headers, body }
    };

    requestHistory.unshift(entry);
    res.json({ success: true, entry });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});

// Rota para obter o histórico de requisições
app.get('/history', (req, res) => {
  res.json(requestHistory);
});

// Rota para limpar o histórico de requisições
app.post('/clear-history', (req, res) => {
  requestHistory = [];
  res.json({ success: true });
});

// Rota para servir a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/public', 'index.html'));
});

// Rota para servir a página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/public', 'login.html'));
});

// Rota para servir a página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/public', 'signup.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
