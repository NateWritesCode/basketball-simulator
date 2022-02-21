import { PrismaClient } from "@prisma/client";
import players from "../src/data/players.json";
import teams from "../src/data/teams.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.team.createMany({
    data: teams,
  });

  await prisma.player.createMany({
    data: players,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
