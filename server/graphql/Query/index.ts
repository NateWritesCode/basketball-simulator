import { Player } from "./Player";
import { Standings } from "./Standings";
import { Team } from "./Team";
import { Test } from "./Test";

export const Query = {
  ...Player,
  ...Standings,
  ...Team,
  ...Test,
};
