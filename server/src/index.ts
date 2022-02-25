import { startPlayByPlayParse } from "./data-wrangle/playByPlay";
// import { startTeamDetailsParse } from "./data-wrangle/teams";
import { startPlayersParse } from "./data-wrangle/players";
import { parseFgProbability } from "./data-wrangle/r";
import startServer from "./startServer";
import { getFgType, getPossessionOutcome } from "./utils/probabilities";

(async () => {
  try {
    // getFgType();
    // getPossessionOutcome();
    // parseFgProbability();
    await startServer();
    // startPlayByPlayParse();
    // startTeamDetailsParse();
    // startPlayersParse();
  } catch (e) {
    console.error(e);
  }
})();
