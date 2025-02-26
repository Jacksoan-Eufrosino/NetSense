import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const Router = express.Router();

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

// Rota para servir a página "about"
app.get("/about.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Rota para servir a página de erro
app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "error.html"));
});

// Rota para servir o dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});


export default Router;