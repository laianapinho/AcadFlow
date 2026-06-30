import { Router } from "express";
import { prisma } from "../lib/prisma";

const subjectRoutes = Router();

// ROTA: POST /subjects - Criação de uma disciplina vinculada a um usuário
subjectRoutes.post("/subjects", async (req, res) => {
  try {
    const { name, professor, semester, userId } = req.body;

    // Valida se os campos mínimos necessários foram informados
    if (!name || !userId) {
      return res.status(400).json({
        message: "Nome da disciplina e userId são obrigatórios."
      });
    }

    // Verifica se o usuário informado realmente existe no banco (Integridade Referencial)
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!userExists) {
      return res.status(404).json({
        message: "Usuário não encontrado."
      });
    }

    // Cria a disciplina e associa ao usuário através do campo userId (Foreign Key)
    const subject = await prisma.subject.create({
      data: {
        name,
        professor,
        semester,
        userId
      }
    });

    return res.status(201).json(subject);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao cadastrar disciplina."
    });
  }
});

// ROTA: GET /subjects - Listagem de disciplinas com dados do usuário relacionado
subjectRoutes.get("/subjects", async (req, res) => {
  try {
    // Busca todas as disciplinas
    const subjects = await prisma.subject.findMany({
      include: {
        user: true // Faz um "join" trazendo os dados completos do usuário dono da disciplina
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar disciplinas."
    });
  }
});

export { subjectRoutes };