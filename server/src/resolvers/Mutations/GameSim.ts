import { mutationField } from "nexus";
import random from "random";
import { sample } from "simple-statistics";
import { GameSim, Player, Team } from "../../entities";
import {
  OvertimeLength,
  GameTypeTimeSegments,
  GameTotalTime,
  ShotClockLength,
} from "../../types";

export const startGameSim = mutationField("startGameSim", {
  type: "Boolean",
  async resolve(_parent, _args, { prisma, socket }) {
    try {
      const teamsFetch = await prisma.team.findMany({});
      const [team0, team1] = sample(teamsFetch, 2, () => random.float(0, 1));
      const playersFetch = await prisma.player.findMany({
        where: {
          OR: [{ teamId: team0.id }, { teamId: team1.id }],
        },
      });

      const players = playersFetch.map((player) => new Player(player));

      const teams = [team0, team1].map(
        (team) =>
          new Team({
            ...team,
            players: players.filter((player) => player.teamId === team.id),
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
            type: "time",
          },
          segment: GameTypeTimeSegments.Quarter,
          totalTime: GameTotalTime.NBA,
          type: "time",
        },
        id: 1,
        possessionTossupMethod: "jumpBall",
        shotClock: ShotClockLength.NBA,
        socket,
        teams: [teams[0], teams[1]],
        timeouts: 7,
      });

      console.log("Starting the game");

      await gameSim.start();

      return true;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
});
