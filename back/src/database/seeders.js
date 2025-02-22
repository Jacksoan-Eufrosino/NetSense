import Database from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDataPath = path.resolve(__dirname, 'seeders.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

async function up() {
  const db = await Database.connect();

  for (const item of seedData.users) {
    await db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [item.name, item.email, item.password]);
  }

  for (const item of seedData.traffic) {
    await db.run(`INSERT INTO traffic (source_ip, destination_ip, protocol, user_id) VALUES (?, ?, ?, ?)`, [item.source_ip, item.destination_ip, item.protocol, item.user_id]);
  }

  db.close();
}

export default { up };