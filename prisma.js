const { PrismaClient } = require("@prisma/client");

// Responsabilidade desta camada: disponibilizar UMA única conexão
// com o banco de dados para o restante da aplicação.
const prisma = new PrismaClient();

module.exports = prisma;
