import Scheduler from "./entities/Scheduler";
import startExpressServer from "./startExpressServer";
import startHive from "./startHive";
import { generateSchedule } from "./utils";

(async () => {
  try {
    // await startHive();SELECT * FROM "Game";
    const prisma = await startExpressServer();

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
