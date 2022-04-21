import { PrismaClient } from "@prisma/client";
import Scheduler from "../entities/Scheduler";

const prisma = new PrismaClient();

describe("Scheduler tets", () => {
  test("Scheduler test", async () => {
    const conferences = await prisma.conference.findMany({});
    const divisions = await prisma.division.findMany({});
    const teams = await prisma.team.findMany({});

    const scheduler = new Scheduler(conferences, divisions, teams);

    scheduler.createNbaSchedule();

    const NUM_GAMES_IN_SEASON = (82 * teams.length) / 2;

    const { scheduleName, homeTeam, schedule } = scheduler;
    expect(scheduleName.length).toBe(NUM_GAMES_IN_SEASON);
    expect(homeTeam.length).toBe(NUM_GAMES_IN_SEASON);
    expect(schedule.length).toBe(NUM_GAMES_IN_SEASON);

    console.log("scheduleName.length", scheduleName.length);
    console.log("schedule.length", schedule.length);
    console.log("homeTeam.length", homeTeam.length);
  });
});
