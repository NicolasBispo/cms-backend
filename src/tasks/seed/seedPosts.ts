import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const postsData = [];

  for (let i = 1; i <= 20; i++) {
    const categories = [];
    const postTags = [];
    for (let j = 1; j <= 4; j++) {
      categories.push({ id: Math.floor(Math.random() * 20) + 1 });
      postTags.push({ id: Math.floor(Math.random() * 100) + 1 });
    }

    postsData.push({
      title: `Post ${i}`,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      authorId: i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3,
      categories: { connect: categories },
      tags: { connect: postTags },
    });
  }

  for (const postData of postsData) {
    await prisma.post.create({
      data: postData,
    });
  }

  console.log("Posts populados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit();
  });
