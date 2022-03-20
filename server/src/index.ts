import startExpressServer from "./startExpressServer";
import startHive from "./startHive";

(async () => {
  try {
    // await startHive();
    await startExpressServer();
  } catch (e) {
    console.error(e);
  }
})();
