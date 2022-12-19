import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // CRIANDO UM USER
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@email.com",
      avatarUrl: "https://avatars.githubusercontent.com/u/66570560?v=4",
    },
  });

  // CRIANDO UM BOLÃO
  const pool = await prisma.pool.create({
    data: {
      title: "Example pool",
      code: "P123",
      ownerId: user.id,

      // CRIANDO NA TABELA PARTICIPANT DE FORMA ENCADEADA (FEAT. PRISMA)
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  // CRIANDO GAME SEM PALPITE
  await prisma.game.create({
    data: {
      date: "2022-11-01T18:14:26.889Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    },
  });

  // CRIANDO GAME COM PALPITE
  await prisma.game.create({
    data: {
      date: "2022-11-02T18:14:26.889Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
