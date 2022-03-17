// import { startTeamDetailsParse } from "./data-wrangle/teams";
import startServer from "./startServer";
import presto from "presto-client-ts";
const client = new presto.Client({
  host: "localhost",
  user: "root",
  catalog: "hive",
});

(async () => {
  try {
    await startServer();
  } catch (e) {
    console.error(e);
  }

  client.execute({
    query: "SELECT * FROM gameEvent where x=-45",
    catalog: "hive",
    schema: "default",
    state: function (error, query_id, stats) {
      // console.log({ message: "status changed", id: query_id, stats: stats });
    },
    columns: function (error, data) {
      // console.log({ resultColumns: data });
      // console.log(data);
    },
    data: function (error, data, columns, stats) {
      console.log("columns", columns);
      console.log("data", data);
    },
    success: function (error, stats) {},
    error: function (error) {},
  });
})();
