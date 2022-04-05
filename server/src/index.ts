import startExpressServer from "./startExpressServer";
import startHive from "./startHive";
import { generateSchedule } from "./utils";

(async () => {
  try {
    // await startHive();
    const prisma = await startExpressServer();

    const teams = await prisma.team.findMany({});

    generateSchedule({ scheduleType: "nba", teams });
  } catch (e) {
    console.error(e);
  }
})();
