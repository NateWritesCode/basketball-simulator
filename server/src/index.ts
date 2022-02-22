import { startPlayByPlayParse } from "./data-wrangle/playByPlay";
// import { startTeamDetailsParse } from "./data-wrangle/teams";
import { startPlayersParse } from "./data-wrangle/players";
import startServer from "./startServer";

(async () => {
  try {
    await startServer();
    // startPlayByPlayParse();
    // startTeamDetailsParse();
    // startPlayersParse();
  } catch (e) {
    console.error(e);
  }
})();
