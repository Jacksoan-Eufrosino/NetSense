import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Define a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota para servir a página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota para servir a página de login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Rota para servir a página de registro
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
