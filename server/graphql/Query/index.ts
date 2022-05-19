import { Player } from "./Player";
import { Standings } from "./Standings";
import { Test } from "./Test";

export const Query = {
  ...Player,
  ...Standings,
  ...Test,
};
