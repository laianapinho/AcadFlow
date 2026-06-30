// Importa automaticamente as variáveis de ambiente do arquivo .env
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
// Importa o adaptador do Prisma para PostgreSQL (específico para ambientes como o Neon ou Vercel Postgres)
import { PrismaPg } from "@prisma/adapter-pg";

// Cria uma instância do adaptador utilizando a string de conexão definida no arquivo .env
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

// Exporta a instância do PrismaClient configurada com o adaptador.
// Esta instância será importada em todos os outros arquivos (rotas, controllers, etc.)
// para realizar as operações no banco de dados.
export const prisma = new PrismaClient({
  adapter
});

//basicamente esse arquivo faz PrismaClient → usa o adapter PostgreSQL → conecta no banco acadflow