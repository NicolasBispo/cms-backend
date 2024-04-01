import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    "Tecnologia",
    "Viagens",
    "Alimentação e Culinária",
    "Saúde e Bem-estar",
    "Esportes e Fitness",
    "Moda e Estilo",
    "Arte e Cultura",
    "Música",
    "Educação e Aprendizagem",
    "Negócios e Empreendedorismo",
    "Filmes e Séries",
    "Livros e Literatura",
    "Fotografia",
    "Meio Ambiente e Sustentabilidade",
    "Animais de Estimação",
    "Carros e Veículos",
    "História e Arqueologia",
    "Jogos e Passatempos",
    "Finanças Pessoais",
    "Espiritualidade e Bem-estar emocional"
  ];

  const categoryData = categories.map(name => ({ name }));

  await prisma.category.createMany({
    data: categoryData,
  });

  console.log("Categorias populadas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit()
  });
