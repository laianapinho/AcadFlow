import express from "express";
import cors from "cors"; // Middleware para permitir requisições de diferentes origens (front-end)
import dotenv from "dotenv"; // Carrega variáveis de ambiente de um arquivo .env

import { userRoutes } from "./routes/user.routes";
import { subjectRoutes } from "./routes/subject.routes";

// Carrega as variáveis de ambiente (.env) para o process.env
dotenv.config();

const app = express();

// Middlewares globais
app.use(cors()); // Habilita o CORS (Cross-Origin Resource Sharing)
app.use(express.json()); // Permite que a aplicação entenda requisições com corpo em JSON

// Rota de monitoramento (Health Check) - Útil para verificar se o servidor está no ar
app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "AcadFlow backend está funcionando"
  });
});

// Registro das rotas importadas
app.use(userRoutes);
app.use(subjectRoutes);

// Define a porta: usa a variável de ambiente PORT ou cai na porta 3333 por padrão
const PORT = process.env.PORT || 3333;

// Inicia o servidor e aguarda conexões
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});