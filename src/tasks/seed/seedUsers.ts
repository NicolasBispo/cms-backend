import { PrismaClient } from '@prisma/client';

import {faker} from'@faker-js/faker';

const prisma = new PrismaClient();
async function main() {

    const users = Array.from({ length: 20 }, () => ({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
    }));


    await prisma.user.createMany({
        data: users,
    });

    console.log('Usuários inseridos com sucesso.');
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
