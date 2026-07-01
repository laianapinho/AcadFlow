import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importação dos módulos de rotas (cada arquivo gerencia um recurso do sistema)
import { userRoutes } from "./routes/user.routes";
import { subjectRoutes } from "./routes/subject.routes";
import { taskRoutes } from "./routes/task.routes";
import { documentRoutes } from "./routes/document.routes";
import { opportunityRoutes } from "./routes/opportunity.routes";

// Carrega variáveis de ambiente (como portas, chaves secretas ou URLs de banco)
dotenv.config();

const app = express();

// Middlewares: processam a requisição antes de chegar na lógica das rotas
app.use(cors());        // Habilita o CORS para permitir acesso de diferentes origens (ex: seu frontend)
app.use(express.json()); // Permite que o servidor entenda JSON no corpo das requisições (POST/PATCH)

// Rota de monitoramento (Health Check)
// Ideal para serviços de deploy (como Render ou Railway) saberem que o servidor está vivo
app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "AcadFlow backend está funcionando"
  });
});

// Registro de todas as rotas da aplicação
app.use(userRoutes);
app.use(subjectRoutes);
app.use(taskRoutes);
app.use(documentRoutes);
app.use(opportunityRoutes);

// Define a porta do servidor, priorizando a variável de ambiente PORT ou 3333 por padrão
const PORT = process.env.PORT || 3333;

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});