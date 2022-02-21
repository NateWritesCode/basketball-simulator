import { PrismaClient } from "@prisma/client";
import teams from "../src/data/teams.json";
import bulls from "../src/data/bulls.json";
import knicks from "../src/data/knicks.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.team.createMany({
    data: teams,
  });

  await prisma.player.createMany({
    data: [...bulls, ...knicks],
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
