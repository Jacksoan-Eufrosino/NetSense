import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = express.Router();

// Rota para servir a página inicial
routes.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../front/public", "index.html"));
});

// Rota para servir a página de login
routes.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../front/public", "login.html"));
});

// Rota para servir a página de registro
routes.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../../front/public", "signup.html"));
});

// Rota para servir a página "about"
routes.get("/about.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../front/public", "about.html"));
});

// Rota para servir a página de erro
routes.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "../../front/public", "error.html"));
});

// Rota para servir o dashboard
routes.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../../front/public", "dashboard.html"));
});

// Rota para registrar um novo usuário
routes.post("/api/register", async (req, res) => {
  const {name , email, password} = req.body;

  try {
    const newUser = await Users.create({name, email, password});
    res.status(201).json({message: "Usuário registrado com sucesso!", user: newUser});
  } catch(error) {
    res.status(500).json({message: 'Erro ao registrar usuário', error: error.message});
  }
});

export default routes;