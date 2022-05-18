import { Player } from "./Player";
import random from "random";
import { sample } from "simple-statistics";

class Team {
  homeName: string;
  nickname: string;
  id: number;
  players: Player[];

  constructor({ homeName, nickname, id, players }: any) {
    this.homeName = homeName;
    this.nickname = nickname;
    this.id = id;
    this.players = players;
  }

  getFullName = (): string => {
    return `${this.homeName} ${this.nickname}`;
  };

  getRandomPlayers = (numOfPlayers: number): Player[] => {
    return sample(this.players, numOfPlayers, () => random.float(0, 1));
  };

  getStartingLineup = (numStarters: number): Player[] => {
    const guards: Player[] = [];
    const forwards: Player[] = [];
    const centers: Player[] = [];

    // POSSIBLE POSITIONS
    // Center
    // Center-Forward
    // Forward-Center
    // Forward
    // Forward-Guard
    // Guard-Forward
    // Guard

    if (numStarters === 5) {
      //2 guards
      //2 forwards
      //1 center
      this.players
        .sort((a, b) => {
          return b.fgTotalChance - a.fgTotalChance;
        })
        .forEach((player) => {
          if (player.position.includes("Center") && centers.length <= 0) {
            centers.push(player);
          } else if (
            player.position.includes("Forward") &&
            forwards.length <= 1
          ) {
            forwards.push(player);
          } else if (player.position.includes("Guard") && guards.length <= 1) {
            guards.push(player);
          }
        });
    } else {
      //TODO: Get starters for different number lineups
      throw new Error("Can only pick starters for 5 person lineups!");
    }

    return [...centers, ...forwards, ...guards];
  };
}

export { Team };
