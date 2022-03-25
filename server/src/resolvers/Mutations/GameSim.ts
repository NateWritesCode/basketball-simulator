import { mutationField } from "nexus";
import fs from "fs";
import { GameSim, Player, Team } from "../../entities";
import {
  OvertimeLength,
  GameTypeTimeSegments,
  GameTotalTime,
  ShotClockLength,
} from "../../types";
import { generateSchedule } from "../../utils";

export const startGameSim = mutationField("startGameSim", {
  type: "SimResult",
  async resolve(_parent, _args, { presto, prisma, socket }) {
    try {
      const teams = await prisma.team.findMany({
        where: {
          leagueId: 1,
        },
      });

      console.log("teams", teams);

      const schedule = generateSchedule({ scheduleType: "nba", teams });

      // const team0 = await prisma.team.findUnique({ where: { abbrev: "CHI" } });
      // const team1 = await prisma.team.findUnique({ where: { abbrev: "MIL" } });

      // if (!team0 || !team1) {
      //   throw new Error("Teams do not exist");
      // }

      // const playersFetch = await prisma.player.findMany({
      //   where: {
      //     teamId: {
      //       in: [team0.id, team1.id],
      //     },
      //     // id: {
      //     //   in: [
      //     //     201942, 203897, 1629632, 202696, 1628366, 203507, 201950, 203114,
      //     //     1626171, 201572,
      //     //   ],
      //     // },
      //   },
      // });

      // const players = playersFetch
      //   .map((player) => {
      //     try {
      //       return new Player(
      //         player,
      //         JSON.parse(
      //           fs.readFileSync(
      //             `./src/data/probabilities-player/${player.id}.json`,
      //             "utf-8"
      //           )
      //         )
      //       );
      //     } catch (error) {
      //       return null;
      //     }
      //   })
      //   .filter((player) => player !== null) as Player[];

      // const teams = [team0, team1].map(
      //   (team) =>
      //     new Team({
      //       ...team,
      //       players: players.filter((player) => player.teamId === team.id),
      //     })
      // );

      // let counter = 1;

      // while (counter < 11) {
      //   const gameSim = new GameSim({
      //     foulPenaltySettings: {
      //       doublePenaltyThreshold: 10,
      //       penaltyThreshold: 6,
      //     },
      //     gameType: {
      //       overtimeOptions: {
      //         overtimeLength: OvertimeLength.NBA,
      //         type: "time",
      //       },
      //       segment: GameTypeTimeSegments.Quarter,
      //       totalTime: GameTotalTime.NBA,
      //       type: "time",
      //     },
      //     id: counter,
      //     numFoulsForPlayerFoulOut: 6,
      //     possessionTossupMethod: "jumpBall",
      //     shotClock: ShotClockLength.NBA,
      //     socket,
      //     teams: [teams[0], teams[1]],
      //     timeouts: 7,
      //   });
      //   gameSim.start();
      //   counter++;
      // }

      return null;

      // const { playerStats, teamStats } = gameSim.start();

      // return {
      //   playerStats: [playerStats[0], playerStats[1]],
      //   teams: [team0, team1],
      //   teamStats: [teamStats[0], teamStats[1]],
      // };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
});
