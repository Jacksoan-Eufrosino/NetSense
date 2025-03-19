import Database from './database.js';

async function up() {
  const db = await Database.connect();

  const trafficSql = `
    CREATE TABLE IF NOT EXISTS traffic (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_ip TEXT,
      destination_ip TEXT,
      protocol TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `;

  const usersSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `;

  await db.run(trafficSql);
  await db.run(usersSql);

  db.close();
}

async function down() {
  const db = await Database.connect();

  const trafficSql = `DROP TABLE IF EXISTS traffic`;
  const usersSql = `DROP TABLE IF EXISTS users`;

  await db.run(trafficSql);
  await db.run(usersSql);

  db.close();
}

export default { up, down };