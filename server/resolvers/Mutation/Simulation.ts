import {
  Context,
  Game as GameType,
  // GameTotalTime,
  // GameTypeTimeSegments,
  // OvertimeLength,
  // ShotClockLength,
  Team as TeamType,
} from "../../types";
import { storage } from "@serverless/cloud";
import fs from "fs";
import { writeFileToStorage } from "../../utils";
import { csvDb } from "../../utils/csvDb";
// import { GameSim, Player, Team } from "../../entities";
import { Player } from "../../entities/Player";

export const Simulation = {
  simulate: async (
    _parent: undefined,
    _args: undefined,
    context: Context
  ): Promise<boolean> => {
    console.log("Simulate STARTING");
    // console.log("csvDb", csvDb);
    const teamsDb = await csvDb.getMany("team", "team");
    // console.log("teamsDb", teamsDb);
    const gamesDb: GameType[] = (await csvDb.getMany("1", "schedule")).sort(
      (a, b) => a.date - b.date
    );

    const playersDb: any[] = await csvDb.getMany("player", "player");

    for await (const game of gamesDb.slice(0, 1)) {
      const team0 = teamsDb.filter((team) => team.id === game.team0Id)[0];
      const team1 = teamsDb.filter((team) => team.id === game.team1Id)[0];

      if (!team0 || !team1) {
        throw new Error(
          `Don't have the required teams to simulate game id ${game.id}`
        );
      }

      // console.log("team0", team0);
      // console.log("team1", team1);

      console.log("__dirname", process.cwd());

      console.log(fs.readdirSync(process.cwd()));

      // const id = 2544;

      // const playerProb = JSON.parse(
      //   fs.readFileSync(`/tmp/task/probabilities/player/${id}.json`, "utf-8")
      // );

      // const playerTotalProb = JSON.parse(
      //   fs.readFileSync(`/tmp/task/probabilities/player/${id}.json`, "utf-8")
      // );

      // console.log("playersDb", playersDb);

      // const player = playersDb.filter(
      //   (player: any) => player.id === id
      //   // player.teamId === team0.id || player.teamId === team1.id
      // )[0];

      // console.log("playerProb", playerProb);
      // console.log("playerTotalProb", playerTotalProb);
      // console.log("player", player);

      // const test = new Player(player, playerProb, playerTotalProb);
      // console.log("test", test);

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

      // console.log("players", players);

      // const teams = [team0, team1].map(
      //   (team) =>
      //     new Team({
      //       ...team,
      //       players: players.filter((player: any) => player.teamId === team.id),
      //     })
      // );

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
      //   id: game.id,
      //   numFoulsForPlayerFoulOut: 6,
      //   possessionTossupMethod: "JUMP_BALL",
      //   shotClock: ShotClockLength.NBA,
      //   socket: undefined,
      //   teams: [teams[0], teams[1]],
      //   timeoutOptions: {
      //     timeouts: 7,
      //     timeoutRules: "NBA",
      //   },
      // });

      // await gameSim.start();
    }

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
