import { Router } from "express";
import { prisma } from "../lib/prisma";

const taskRoutes = Router();

/**
 * ROTA: POST /tasks
 * Objetivo: Criar uma nova tarefa vinculada a um usuário e, opcionalmente, a uma disciplina.
 */
taskRoutes.post("/tasks", async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      status,
      priority,
      userId,
      subjectId
    } = req.body;

    // Validação básica de campos obrigatórios
    if (!title || !userId) {
      return res.status(400).json({
        message: "Título da tarefa e userId são obrigatórios."
      });
    }

    // Verifica se o usuário existe antes de criar a tarefa
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({
        message: "Usuário não encontrado."
      });
    }

    // Se um subjectId foi enviado, valida se a disciplina existe
    if (subjectId) {
      const subjectExists = await prisma.subject.findUnique({
        where: { id: subjectId }
      });

      if (!subjectExists) {
        return res.status(404).json({
          message: "Disciplina não encontrada."
        });
      }
    }

    // Cria a tarefa no banco de dados
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined, // Converte a data se fornecida
        status: status || "PENDENTE", // Define valor padrão se não enviado
        priority: priority || "MEDIA",
        userId,
        subjectId: subjectId || undefined
      }
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao cadastrar tarefa."
    });
  }
});

/**
 * ROTA: GET /tasks
 * Objetivo: Listar todas as tarefas, incluindo as relações de usuário e disciplina.
 */
taskRoutes.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: true,    // Traz os dados completos do usuário
        subject: true  // Traz os dados completos da disciplina
      },
      orderBy: {
        createdAt: "desc" // Ordena pelas mais recentes
      }
    });

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar tarefas."
    });
  }
});

/**
 * ROTA: PATCH /tasks/:id/status
 * Objetivo: Atualizar apenas o status de uma tarefa específica.
 */
taskRoutes.patch("/tasks/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status é obrigatório."
      });
    }

    // Verifica se a tarefa existe antes de tentar atualizar
    const taskExists = await prisma.task.findUnique({
      where: { id }
    });

    if (!taskExists) {
      return res.status(404).json({
        message: "Tarefa não encontrada."
      });
    }

    // Realiza a atualização do campo status
    const task = await prisma.task.update({
      where: { id },
      data: { status }
    });

    return res.json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar status da tarefa."
    });
  }
});

/**
 * ROTA: DELETE /tasks/:id
 * Objetivo: Remover uma tarefa do banco de dados pelo seu ID.
 */
taskRoutes.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validação de existência antes da remoção
    const taskExists = await prisma.task.findUnique({
      where: { id }
    });

    if (!taskExists) {
      return res.status(404).json({
        message: "Tarefa não encontrada."
      });
    }

    // Deleta a tarefa
    await prisma.task.delete({
      where: { id }
    });

    return res.json({
      message: "Tarefa excluída com sucesso."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao excluir tarefa."
    });
  }
});

export { taskRoutes };