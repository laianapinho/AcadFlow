import { Router } from "express";
import { prisma } from "../lib/prisma"; // Importa a instância do Prisma Client configurada

const userRoutes = Router();

// ROTA: POST /users - Criação de um novo usuário
userRoutes.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação básica: garante que todos os campos obrigatórios foram enviados
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, email e senha são obrigatórios."
      });
    }

    // Verifica se já existe um usuário com o mesmo email no banco de dados
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (userAlreadyExists) {
      return res.status(400).json({
        message: "Já existe um usuário cadastrado com este email."
      });
    }

    // Cria o novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password // ATENÇÃO: Em produção, nunca salve senhas em texto puro; utilize hash (ex: bcrypt)
      }
    });

    return res.status(201).json(user); // Retorna 201 (Created) com o usuário criado
  } catch (error) {
    // Retorna erro 500 em caso de falha no servidor ou no banco de dados
    return res.status(500).json({
      message: "Erro ao cadastrar usuário."
    });
  }
});

// ROTA: GET /users - Listagem de todos os usuários
userRoutes.get("/users", async (req, res) => {
  try {
    // Busca todos os registros da tabela User, ordenando pelo mais recente
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(users); // Retorna a lista de usuários
  } catch (error) {
    // Retorna erro 500 caso a busca falhe
    return res.status(500).json({
      message: "Erro ao listar usuários."
    });
  }
});

export { userRoutes };