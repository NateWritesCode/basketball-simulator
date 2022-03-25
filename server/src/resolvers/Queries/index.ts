import * as Game from "./Game";
import * as Player from "./Player";
import * as Sql from "./Sql";
import * as Team from "./Team";
import * as Test from "./Test";

export const Query = {
  ...Game,
  ...Player,
  ...Sql,
  ...Team,
  ...Test,
};
