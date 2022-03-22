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
    let gameEvents = await csvtojson({
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

    gameEvents = gameEvents.map((gameEvent) => {
      if (gameEvent.defPlayer1) {
        gameEvent.defPlayer1Id = gameEvent.defPlayer1;
        delete gameEvent.defPlayer1;
      }
      if (gameEvent.defPlayer2) {
        gameEvent.defPlayer2Id = gameEvent.defPlayer2;
        delete gameEvent.defPlayer2;
      }
      if (gameEvent.defTeam) {
        gameEvent.defTeamId = gameEvent.defTeam;
        delete gameEvent.defTeam;
      }
      if (gameEvent.offPlayer1) {
        gameEvent.offPlayer1Id = gameEvent.offPlayer1;
        delete gameEvent.offPlayer1;
      }
      if (gameEvent.offPlayer2) {
        gameEvent.offPlayer2Id = gameEvent.offPlayer2;
        delete gameEvent.offPlayer2;
      }
      if (gameEvent.offTeam) {
        gameEvent.offTeamId = gameEvent.offTeam;
        delete gameEvent.offTeam;
      }
      if (gameEvent.team0) {
        gameEvent.team0Id = gameEvent.team0;
        delete gameEvent.team0;
      }
      if (gameEvent.team1) {
        gameEvent.team1Id = gameEvent.team1;
        delete gameEvent.team1;
      }
    });

    await prisma.gameEvent.createMany({
      data: {},
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
