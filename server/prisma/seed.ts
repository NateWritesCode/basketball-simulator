import { PrismaClient } from "@prisma/client";
import players from "../src/data/players.json";
import teams from "../src/data/teams.json";
import csvtojson from "csvtojson";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  await prisma.team.createMany({
    data: teams,
  });

  await prisma.player.createMany({
    data: players,
  });

  const gameEventFiles = fs.readdirSync("./src/data/game-events");
  for (const [_, file] of gameEventFiles.entries()) {
    const gameEvents = await csvtojson({
      checkType: true,
      colParser: {
        defPlayersOnCourt: (item) => {
          return item.split(",").map((v) => Number(v));
        },
        offPlayersOnCourt: (item) => {
          return item.split(",").map((v) => Number(v));
        },
      },
      delimiter: "|",
      ignoreEmpty: true,
    }).fromFile(`./src/data/game-events/${file}`);

    await prisma.gameEvent.createMany({
      data: gameEvents,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
