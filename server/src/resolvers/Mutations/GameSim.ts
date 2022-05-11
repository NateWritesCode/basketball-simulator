import { mutationField } from "nexus";
import fs from "fs";
import { GameSim, Player, Team } from "../../entities";
import {
  OvertimeLength,
  GameTypeTimeSegments,
  GameTotalTime,
  ShotClockLength,
} from "../../types";
import { csvDbClient } from "../../csvDbClient";
import { emptyFolders } from "../../utils/seedData";

export const startGameSim = mutationField("startGameSim", {
  type: "SimResult",
  async resolve(_parent, _args, { prisma, socket }) {
    try {
      let teams: any = await csvDbClient.getMany("team", "team");
      teams = teams.map((team: Team) => {
        return {
          teamId: team.id,
          w: 0,
          l: 0,
        };
      });

      await csvDbClient.add("1", "standings", teams);

      const games: any = (await csvDbClient.getMany("1", "schedule")).sort(
        (a: any, b: any) => a.date - b.date
      );

      const playersDb = await csvDbClient.getMany("player", "player");

      for await (const game of games.slice(0, 15)) {
        const team0 = await csvDbClient.getOne("team", "team", {
          id: game.team0Id,
        });
        const team1 = await csvDbClient.getOne("team", "team", {
          id: game.team1Id,
        });

        if (!team0 || !team1) {
          throw new Error("Need two teams to sim");
        }

        const playersFetch = playersDb.filter(
          (player: any) =>
            player.teamId === team0.id || player.teamId === team1.id
        );

        const players = playersFetch
          .map((player: any) => {
            try {
              return new Player(
                player,
                JSON.parse(
                  fs.readFileSync(
                    `./src/data/probabilities-player/${player.id}.json`,
                    "utf-8"
                  )
                ),
                JSON.parse(
                  fs.readFileSync(
                    `./src/data/totals-player/${player.id}.json`,
                    "utf-8"
                  )
                )
              );
            } catch (error) {
              return null;
            }
          })
          .filter((player: any) => player !== null);

        const teams = [team0, team1].map(
          (team) =>
            new Team({
              ...team,
              players: players.filter(
                (player: any) => player.teamId === team.id
              ),
            })
        );

        const gameSim = new GameSim({
          foulPenaltySettings: {
            doublePenaltyThreshold: 10,
            penaltyThreshold: 6,
          },
          gameType: {
            overtimeOptions: {
              overtimeLength: OvertimeLength.NBA,
              timeouts: 2,
              type: "time",
            },
            segment: GameTypeTimeSegments.Quarter,
            totalTime: GameTotalTime.NBA,
            type: "time",
          },
          id: game.id,
          numFoulsForPlayerFoulOut: 6,
          possessionTossupMethod: "JUMP_BALL",
          shotClock: ShotClockLength.NBA,
          socket,
          teams: [teams[0], teams[1]],
          timeoutOptions: {
            timeouts: 7,
            timeoutRules: "NBA",
          },
        });

        await gameSim.start();
      }

      return null;
      // const teams = await prisma.team.findMany({
      //   where: {
      //     leagueId: 1,
      //   },
      // });

      // console.log("teams", teams);

      // const schedule = generateSchedule({ scheduleType: "nba", teams });

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
      //         ),
      //         JSON.parse(
      //           fs.readFileSync(
      //             `./src/data/totals-player/${player.id}.json`,
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

      // // while (counter < 2) {
      // //   const gameSim = new GameSim({
      // //     foulPenaltySettings: {
      // //       doublePenaltyThreshold: 10,
      // //       penaltyThreshold: 6,
      // //     },
      // //     gameType: {
      // //       overtimeOptions: {
      // //         overtimeLength: OvertimeLength.NBA,
      // //         timeouts: 2,
      // //         type: "time",
      // //       },
      // //       segment: GameTypeTimeSegments.Quarter,
      // //       totalTime: GameTotalTime.NBA,
      // //       type: "time",
      // //     },
      // //     id: counter,
      // //     numFoulsForPlayerFoulOut: 6,
      // //     possessionTossupMethod: "JUMP_BALL",
      // //     shotClock: ShotClockLength.NBA,
      // //     socket,
      // //     teams: [teams[0], teams[1]],
      // //     timeoutOptions: {
      // //       timeouts: 7,
      // //       timeoutRules: "NBA",
      // //     },
      // //   });
      // //   gameSim.start();
      // //   counter++;
      // // }

      // const gameSim = new GameSim({
      //   foulPenaltySettings: {
      //     doublePenaltyThreshold: 10,
      //     penaltyThreshold: 6,
      //   },
      //   gameType: {
      //     overtimeOptions: {
      //       overtimeLength: OvertimeLength.NBA,
      //       timeouts: 2,
      //       type: "time",
      //     },
      //     segment: GameTypeTimeSegments.Quarter,
      //     totalTime: GameTotalTime.NBA,
      //     type: "time",
      //   },
      //   id: counter,
      //   numFoulsForPlayerFoulOut: 6,
      //   possessionTossupMethod: "JUMP_BALL",
      //   shotClock: ShotClockLength.NBA,
      //   socket,
      //   teams: [teams[0], teams[1]],
      //   timeoutOptions: {
      //     timeouts: 7,
      //     timeoutRules: "NBA",
      //   },
      // });

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

export const resetData = mutationField("resetData", {
  type: "Boolean",
  async resolve(_parent, _args) {
    try {
      console.log("Resetting data");
      emptyFolders();
      return true;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
});
