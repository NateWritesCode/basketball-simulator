import Scheduler from "./entities/Scheduler";
import startExpressServer from "./startExpressServer";
import startHive from "./startHive";
import { generateSchedule, seedData } from "./utils";
import Papa from "papaparse";
import players from "./data/players.json";
import teams from "./data/teams.json";
import { Blob } from "buffer";
import fs from "fs";

(async () => {
  try {
    // await startHive();SELECT * FROM "Game";
    // const prisma = await startExpressServer();
    // await seedData();
    // const playersCsv = await Papa.unparse(players, { delimiter: "|" });
    // const teamsCsv = await Papa.unparse(teams, { delimiter: "|" });
    // fs.writeFileSync("./src/data/players.txt", playersCsv);
    // fs.writeFileSync("./src/data/teams.txt", teamsCsv);
    // const conferences = await prisma.conference.findMany({});
    // const divisions = await prisma.division.findMany({});
    // const teams = await prisma.team.findMany({});
    // const scheduler = new Scheduler(conferences, divisions, teams);
    // scheduler.createNbaSchedule();
    // generateSchedule({ scheduleType: "nba", teams });
  } catch (e) {
    console.error(e);
  }
})();
