const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.restaurant.createMany({
    data: [
      { name: "Pizzaria Napoli", category: "Pizza", rating: 4.8 },
      { name: "Burger House", category: "Hambúrguer", rating: 4.7 },
      { name: "Sushi House", category: "Japonês", rating: 4.9 },
      { name: "Taco Loco", category: "Mexicana", rating: 4.3 },
    ],
    skipDuplicates: true,
  });

  console.log("Dados iniciais inseridos com sucesso!");
}

main()
  .catch((error) => {
    console.error("Erro ao popular o banco:", error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
