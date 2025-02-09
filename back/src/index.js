import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';


const server = express();
const PORT = process.env.PORT || 3001;

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(morgan('tiny'));

server.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
  })
);

server.use(express.json());

// Usar o roteador definido em routes.js
server.use(router);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;