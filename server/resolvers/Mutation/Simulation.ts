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

export const Simulation = {
  simulate: async (
    _parent: undefined,
    _args: undefined,
    { csvDb }: Context
  ): Promise<boolean> => {
    console.log("Simulate STARTING");
    const teamsDb = await csvDb.getMany("team", "team");

    const gamesDb: Game[] = (await csvDb.getMany("1", "schedule")).sort(
      (a, b) => a.date - b.date
    );

    const playersDb: any[] = await csvDb.getMany("player", "player");

    const gamesToSim = [];

    for (const game of gamesDb.slice(0, 10)) {
      const team0 = teamsDb.filter((team) => team.id === game.team0Id)[0];
      const team1 = teamsDb.filter((team) => team.id === game.team1Id)[0];
      if (!team0 || !team1) {
        throw new Error(
          `Don't have the required teams to simulate game id ${game.id}`
        );
      }

      const players = playersDb
        .filter(
          (player: any) =>
            player.teamId === team0.id || player.teamId === team1.id
        )
        .map((player: any) => {
          try {
            return new Player(
              player,
              JSON.parse(
                fs.readFileSync(
                  `/tmp/task/probabilities/player/${player.id}.json`,
                  "utf-8"
                )
              ),
              JSON.parse(
                fs.readFileSync(
                  `/tmp/task/probabilities/player-total/${player.id}.json`,
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
            players: players.filter((player: any) => player.teamId === team.id),
          })
      );

      const gameToSim = async () => {
        await simulateGame({ game, teams });
      };

      gamesToSim.push(gameToSim);
    }

    await Promise.all(gamesToSim.map(async (fn) => await fn()));

    console.log("Simulation is complete");

    return true;
  },
  simulateCleanup: (): boolean => {
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
    await Promise.all(asyncOperations.map((fn) => fn()));

    // const gameLog = await storage.read(`/data/game-logs/${game.id}.txt`);
    // const gameEvents = await storage.read(`/data/game-events/${game.id}.txt`);

    console.log(`Finished writing data for game ${game.id}`);
  } catch (error) {
    throw new Error(error);
  }
};
