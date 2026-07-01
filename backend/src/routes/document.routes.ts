import { Router } from "express";
import { prisma } from "../lib/prisma";

const documentRoutes = Router();

/**
 * ROTA: POST /documents
 * Objetivo: Criar um novo documento vinculado a um usuário específico.
 */
documentRoutes.post("/documents", async (req, res) => {
  try {
    const { title, description, status, userId } = req.body;

    // Validação de presença de campos obrigatórios
    if (!title || !userId) {
      return res.status(400).json({
        message: "Título do documento e userId são obrigatórios."
      });
    }

    // Verifica se o usuário vinculado realmente existe no banco
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({
        message: "Usuário não encontrado."
      });
    }

    // Persiste o documento no banco de dados
    const document = await prisma.document.create({
      data: {
        title,
        description,
        status: status || "PENDENTE", // Define estado inicial caso não enviado
        userId
      }
    });

    return res.status(201).json(document);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao cadastrar documento."
    });
  }
});

/**
 * ROTA: GET /documents
 * Objetivo: Listar todos os documentos cadastrados, incluindo os dados do usuário dono.
 */
documentRoutes.get("/documents", async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        user: true // Realiza o join com a tabela de usuários
      },
      orderBy: {
        createdAt: "desc" // Ordena cronologicamente do mais novo para o mais antigo
      }
    });

    return res.json(documents);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar documentos."
    });
  }
});

/**
 * ROTA: PATCH /documents/:id/status
 * Objetivo: Atualiza o status de um documento específico através do seu ID.
 */
documentRoutes.patch("/documents/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status é obrigatório."
      });
    }

    // Valida se o documento existe antes da atualização
    const documentExists = await prisma.document.findUnique({
      where: { id }
    });

    if (!documentExists) {
      return res.status(404).json({
        message: "Documento não encontrado."
      });
    }

    // Atualiza apenas o campo status
    const document = await prisma.document.update({
      where: { id },
      data: { status }
    });

    return res.json(document);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar status do documento."
    });
  }
});

/**
 * ROTA: DELETE /documents/:id
 * Objetivo: Exclui um documento do sistema permanentemente.
 */
documentRoutes.delete("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica existência antes de deletar
    const documentExists = await prisma.document.findUnique({
      where: { id }
    });

    if (!documentExists) {
      return res.status(404).json({
        message: "Documento não encontrado."
      });
    }

    // Remove o registro
    await prisma.document.delete({
      where: { id }
    });

    return res.json({
      message: "Documento excluído com sucesso."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao excluir documento."
    });
  }
});

export { documentRoutes };