import { storage } from "@serverless/cloud";
import fs from "fs";
// import { GameSim, Player, Team } from "../../entities";
import { GameSim } from "../../entities/GameSim";
import { Player } from "../../entities/Player";
import { Team } from "../../entities/Team";
import { Context } from "../../types/general";
import { Game } from "../../types/resolvers";
import {
  OvertimeLength,
  GameTypeTimeSegments,
  GameTotalTime,
  ShotClockLength,
} from "../../types/enums";
import { writeFileToStorage } from "../../utils/writeFileToStorage";
import { Team as TeamType } from "../../types/resolvers";
import { dataClient } from "../../utils/dataClient";
import lodash from "lodash";
const { isEmpty } = lodash;

export const Simulation = {
  simulate: async (
    _parent: undefined,
    _args: undefined,
    { data }: Context
  ): Promise<boolean> => {
    console.log("Simulate STARTING");
    const gameGroupId = 1;
    const instanceId = 1;
    // await csvDb.deleteSimFiles();
    // await csvDb.listFiles();

    const dataTeams: any[] = (await data.get(`team-${instanceId}:*`)).items.map(
      (obj) => obj.value
    );

    const dataGames: any[] = (
      await data.get(`schedule-${instanceId}:<=1-1`)
    ).items.map((obj) => obj.value);
    // .slice(0, 5);

    const dataPlayers: any[] = (
      await data.get(`player-${instanceId}:*`, { limit: 1000 })
    ).items.map((obj) => obj.value);

    console.log("dataPlayers.length", dataPlayers.length);

    let gameNumber = 1;

    for await (const game of dataGames) {
      console.log(`Starting game number ${gameNumber}`);
      gameNumber++;
      const team0 = dataTeams.filter((team) => team.id === game.team0Id)[0];
      const team1 = dataTeams.filter((team) => team.id === game.team1Id)[0];
      if (!team0 || !team1) {
        throw new Error(
          `Don't have the required teams to simulate game id ${game.id}`
        );
      }

      const players = dataPlayers
        .filter(
          (player: any) =>
            player.teamId === team0.id || player.teamId === team1.id
          // !isEmpty(player.totals)
        )
        .map((player: any) => {
          try {
            return new Player(player);
          } catch (error) {
            return null;
          }
        })
        .filter((player: any) => player !== null);

      console.log("players", players.length);

      // const teams = [team0, team1].map(
      //   (team) =>
      //     new Team({
      //       ...team,
      //       players: players.filter((player: any) => player.teamId === team.id),
      //     })
      // );

      // await simulateGame({ game, teams });
    }

    console.log("Simulation is complete");

    return true;
  },
  simulateCleanup: async (): Promise<boolean> => {
    const pages = await storage.list("/", { recursive: true, pageSize: 100 });
    const files = [];
    for await (const page of pages) {
      files.push(...page);
    }

    for await (const file of files) {
      await storage.remove(`/${file}`);
    }

    console.log("SIMULATE CLEANUP IS COMPLETE");
    return true;
  },
  simulatePrep: async (): Promise<boolean> => {
    try {
      const files = [
        "/data/conference/conference.txt",
        "/data/division/division.txt",
        "/data/league/league.txt",
        "/data/player/player.txt",
        "/data/schedule/1.txt",
        "/data/team/team.txt",
      ];

      for await (const file of files) {
        await writeFileToStorage(file);
      }

      console.log("Simulate Prep COMPLETE");

      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};

const simulateGame = async ({ game, teams }: { game: Game; teams: Team[] }) => {
  const gameSim = new GameSim({
    asyncOperations: [],
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
    // socket: undefined,
    teams: [teams[0], teams[1]],
    timeoutOptions: {
      timeouts: 7,
      timeoutRules: "NBA",
    },
  });

  const asyncOperations = gameSim.start();

  try {
    // const results = await Promise.all(promises.map(p => p.catch(e => e)));
    const results = await Promise.all(
      asyncOperations.map((p) => p().catch((e: any) => e))
    );
    const validResults = results.filter((result) => !(result instanceof Error));
    console.log("validResults", validResults);
  } catch (error) {
    throw new Error(error);
  }
};
