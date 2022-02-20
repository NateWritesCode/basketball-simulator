import { startPlayByPlayParse } from "./data-manipulation/playByPlay";
import startServer from "./startServer";

(async () => {
  try {
    // await startServer();

    startPlayByPlayParse();
  } catch (e) {
    console.error(e);
  }
})();
