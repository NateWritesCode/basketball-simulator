import Player from "./Player";
import random from "random";
import { sample } from "simple-statistics";
import { TeamInit } from "../types";

class Team {
  homeName: string;
  nickname: string;
  id: number;
  players: Player[];

  constructor({ homeName, nickname, id, players }: TeamInit) {
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
}

export default Team;
