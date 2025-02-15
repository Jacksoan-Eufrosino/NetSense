import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Abre a conexão com o banco de dados
const dbPromise = open({
    filename: './src/data/database.db',
    driver: sqlite3.Database
});

// Função para inicializar o banco de dados
async function initializeDatabase() {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT not null,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
        )
        `);
}

initializeDatabase();

export default dbPromise;