// Importa o Router do Express.
// O Router permite criar um conjunto separado de rotas para uma entidade específica.
import { Router } from "express";

// Importa a instância do Prisma criada no arquivo src/lib/prisma.ts.
// Essa instância é usada para conversar com o banco de dados.
import { prisma } from "../lib/prisma";

// Cria um grupo de rotas específico para oportunidades.
// Todas as rotas relacionadas a oportunidades ficarão dentro desse objeto.
const opportunityRoutes = Router();

// Rota responsável por cadastrar uma nova oportunidade.
// Método: POST
// URL: /opportunities
opportunityRoutes.post("/opportunities", async (req, res) => {
  try {
    // Pega os dados enviados no corpo da requisição.
    // Esses dados vêm do Insomnia, Postman, Thunder Client ou do frontend.
    const { title, description, link, deadline, status, userId } = req.body;

    // Verifica se os campos obrigatórios foram enviados.
    // Para criar uma oportunidade, precisamos obrigatoriamente de um título e do id do usuário.
    if (!title || !userId) {
      // Retorna erro 400, que significa erro nos dados enviados pelo cliente.
      return res.status(400).json({
        message: "Título da oportunidade e userId são obrigatórios."
      });
    }

    // Procura no banco se existe um usuário com o id informado.
    // Isso evita cadastrar uma oportunidade ligada a um usuário inexistente.
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    // Se o usuário não existir, retorna erro 404.
    // O erro 404 significa que o recurso procurado não foi encontrado.
    if (!userExists) {
      return res.status(404).json({
        message: "Usuário não encontrado."
      });
    }

    // Cria uma nova oportunidade no banco de dados.
    const opportunity = await prisma.opportunity.create({
      data: {
        // Salva o título da oportunidade.
        title,

        // Salva a descrição da oportunidade, caso ela tenha sido enviada.
        description,

        // Salva o link da oportunidade, caso ele tenha sido enviado.
        link,

        // Se a data limite foi enviada, converte para Date.
        // Se não foi enviada, salva como undefined.
        deadline: deadline ? new Date(deadline) : undefined,

        // Se o status foi enviado, usa o status enviado.
        // Caso contrário, define o status padrão como "ABERTO".
        status: status || "ABERTO",

        // Liga a oportunidade ao usuário informado.
        userId
      }
    });

    // Retorna a oportunidade criada com status 201.
    // O status 201 significa "criado com sucesso".
    return res.status(201).json(opportunity);
  } catch (error) {
    // Se acontecer algum erro inesperado, retorna erro 500.
    // O erro 500 significa erro interno no servidor.
    return res.status(500).json({
      message: "Erro ao cadastrar oportunidade."
    });
  }
});

// Rota responsável por listar todas as oportunidades cadastradas.
// Método: GET
// URL: /opportunities
opportunityRoutes.get("/opportunities", async (req, res) => {
  try {
    // Busca todas as oportunidades no banco de dados.
    const opportunities = await prisma.opportunity.findMany({
      // Inclui os dados do usuário relacionado a cada oportunidade.
      include: {
        user: true
      },

      // Ordena as oportunidades pela data de criação.
      // As mais recentes aparecem primeiro.
      orderBy: {
        createdAt: "desc"
      }
    });

    // Retorna a lista de oportunidades em formato JSON.
    return res.json(opportunities);
  } catch (error) {
    // Se ocorrer algum erro ao buscar as oportunidades, retorna erro 500.
    return res.status(500).json({
      message: "Erro ao listar oportunidades."
    });
  }
});

// Rota responsável por atualizar apenas o status de uma oportunidade.
// Método: PATCH
// URL: /opportunities/:id/status
opportunityRoutes.patch("/opportunities/:id/status", async (req, res) => {
  try {
    // Pega o id da oportunidade enviado na URL.
    const { id } = req.params;

    // Pega o novo status enviado no corpo da requisição.
    const { status } = req.body;

    // Verifica se o status foi enviado.
    if (!status) {
      // Se o status não foi enviado, retorna erro 400.
      return res.status(400).json({
        message: "Status é obrigatório."
      });
    }

    // Procura no banco se existe uma oportunidade com o id informado.
    const opportunityExists = await prisma.opportunity.findUnique({
      where: {
        id
      }
    });

    // Se a oportunidade não existir, retorna erro 404.
    if (!opportunityExists) {
      return res.status(404).json({
        message: "Oportunidade não encontrada."
      });
    }

    // Atualiza o status da oportunidade no banco.
    const opportunity = await prisma.opportunity.update({
      where: {
        id
      },
      data: {
        status
      }
    });

    // Retorna a oportunidade atualizada.
    return res.json(opportunity);
  } catch (error) {
    // Se ocorrer algum erro durante a atualização, retorna erro 500.
    return res.status(500).json({
      message: "Erro ao atualizar status da oportunidade."
    });
  }
});

// Rota responsável por excluir uma oportunidade.
// Método: DELETE
// URL: /opportunities/:id
opportunityRoutes.delete("/opportunities/:id", async (req, res) => {
  try {
    // Pega o id da oportunidade enviado na URL.
    const { id } = req.params;

    // Verifica se existe uma oportunidade com esse id no banco.
    const opportunityExists = await prisma.opportunity.findUnique({
      where: {
        id
      }
    });

    // Se a oportunidade não existir, retorna erro 404.
    if (!opportunityExists) {
      return res.status(404).json({
        message: "Oportunidade não encontrada."
      });
    }

    // Exclui a oportunidade do banco de dados.
    await prisma.opportunity.delete({
      where: {
        id
      }
    });

    // Retorna uma mensagem confirmando que a exclusão deu certo.
    return res.json({
      message: "Oportunidade excluída com sucesso."
    });
  } catch (error) {
    // Se ocorrer algum erro ao excluir, retorna erro 500.
    return res.status(500).json({
      message: "Erro ao excluir oportunidade."
    });
  }
});

// Exporta as rotas de oportunidade.
// Assim, o arquivo server.ts consegue importar e usar essas rotas.
export { opportunityRoutes };