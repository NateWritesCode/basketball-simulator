import * as Game from "./Game";
import * as Player from "./Player";
import * as Sql from "./Sql";
import * as Standings from "./Standings";
import * as Team from "./Team";
import * as Test from "./Test";

export const Query = {
  ...Game,
  ...Player,
  ...Sql,
  ...Standings,
  ...Team,
  ...Test,
};
