// import { startTeamDetailsParse } from "./data-wrangle/teams";
import startServer from "./startServer";
import initBigData from "./initBigData";

(async () => {
  try {
    await initBigData();
    await startServer();
  } catch (e) {
    console.error(e);
  }
})();
