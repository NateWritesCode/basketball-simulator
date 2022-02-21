import { startPlayByPlayParse } from "./data-manipulation/playByPlay";
import { startTeamDetailsParse } from "./data-manipulation/teams";
import startServer from "./startServer";

(async () => {
  try {
    await startServer();

    // startPlayByPlayParse();
    // startTeamDetailsParse();
  } catch (e) {
    console.error(e);
  }
})();
