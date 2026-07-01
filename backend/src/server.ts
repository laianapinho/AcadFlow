import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importação das rotas organizadas por domínio
import { userRoutes } from "./routes/user.routes";
import { subjectRoutes } from "./routes/subject.routes";
import { taskRoutes } from "./routes/task.routes";

// Carrega as variáveis de ambiente do arquivo .env para process.env
dotenv.config();

const app = express();

// Middlewares: configuram como o servidor processa as requisições
app.use(cors());        // Habilita o CORS (permite que o frontend acesse o backend de domínios diferentes)
app.use(express.json()); // Permite que a API entenda e interprete requisições com corpo em JSON

// Rota de monitoramento (Health Check): usada para saber se o servidor está no ar
app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "AcadFlow backend está funcionando"
  });
});

// Registro das rotas na aplicação
app.use(userRoutes);    // Rotas de Usuário
app.use(subjectRoutes); // Rotas de Disciplinas
app.use(taskRoutes);    // Rotas de Tarefas

// Define a porta: usa a porta definida no .env ou assume 3333 como padrão
const PORT = process.env.PORT || 3333;

// Inicializa o servidor e o coloca para "ouvir" as requisições na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});