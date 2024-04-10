import { PrismaClient } from '@prisma/client';

import {faker} from'@faker-js/faker';

const prisma = new PrismaClient();
async function main() {

    const postTags = Array.from({ length: 100 }, () => ({
        name: faker.word.sample()
    }));


    await prisma.postTag.createMany({
        data: postTags,
    });

    console.log('post-tags inseridos com sucesso.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        process.exit();
    });
