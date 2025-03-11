import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import routes from './routes.js';

const app = express();
const port = 3000;

// Resolve __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use morgan for logging
app.use(morgan('tiny'));

// Serve static files from the front/public directory
app.use(express.static(path.join(__dirname, '../../front/public')));

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});