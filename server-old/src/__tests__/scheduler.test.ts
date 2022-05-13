import { PrismaClient } from "@prisma/client";
import Scheduler from "../entities/Scheduler";

const prisma = new PrismaClient();

describe("Scheduler tets", () => {
  test("NBA Scheduler test", async () => {
    const conferences = await prisma.conference.findMany({});
    const divisions = await prisma.division.findMany({});
    const teams = await prisma.team.findMany({});

    const scheduler = new Scheduler(conferences, divisions, teams);

    scheduler.createNbaSchedule();

    const { teamSchedulerObj } = scheduler;

    const teamSchedulerObjKeys = Object.keys(teamSchedulerObj);
    teamSchedulerObjKeys.forEach((key) => {
      const { commonNonDivisionOpponents, rareNonDivisionOpponents, schedule } =
        teamSchedulerObj[key];
      expect(commonNonDivisionOpponents.length).toBe(6);
      expect(rareNonDivisionOpponents.length).toBe(4);
      // expect(schedule.length).toBe(82);

      // console.log("schedule.length", schedule.length);
    });

    // expect(scheduleName.length).toBe(NUM_GAMES_IN_SEASON);
    // expect(homeTeam.length).toBe(NUM_GAMES_IN_SEASON);
    // expect(schedule.length).toBe(NUM_GAMES_IN_SEASON);

    // console.log("scheduleName.length", scheduleName.length);
    // console.log("schedule.length", schedule.length);
    // console.log("homeTeam.length", homeTeam.length);
  });
});
