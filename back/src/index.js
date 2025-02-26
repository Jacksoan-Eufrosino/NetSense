import express from 'express';
import bodyParser from 'body-parser';
import Router from './routes.js'

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', Router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});