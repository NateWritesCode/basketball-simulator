import { idArg, nonNull, queryField } from "nexus";

export const getStandings = queryField("getStandings", {
  type: nonNull("Standings"),
  args: {
    gameGroupId: nonNull(idArg()),
  },
  async resolve(_parent, { gameGroupId }, { csvDbClient, dataForge }) {
    try {
      const teams = dataForge
        .readFileSync("./src/data/team/team.txt")
        .parseCSV()
        .parseDates(["yearFounded"])
        .parseFloats(["lat", "lng"]);

      const divisions = dataForge
        .readFileSync("./src/data/division/division.txt")
        .parseCSV({ dynamicTyping: true })
        // .transformSeries({
        //   conferences: (columnValue) =>
        //     columnValue &&
        //     columnValue.split("~").map((id: string) => conferences[id]),
        // })
        .toObject(
          (row) => row.id, // Specify the column to use for field names in the output object.
          (row) => ({ ...row })
        );

      const conferences = dataForge
        .readFileSync("./src/data/conference/conference.txt")
        .parseCSV({ dynamicTyping: true })
        .transformSeries({
          divisions: (columnValue) =>
            columnValue &&
            columnValue.split(",").map((id: string) => divisions[id]),
        })
        .toObject(
          (row) => row.id, // Specify the column to use for field names in the output object.
          (row) => ({ ...row })
        );

      console.log(JSON.stringify(conferences, null, 4));

      // console.log("conferences", conferences);
      // console.log("divisions", divisions);

      const league = dataForge
        .readFileSync("./src/data/league/league.txt")
        .parseCSV({ dynamicTyping: true })
        .transformSeries({
          conferences: (columnValue) =>
            columnValue.split("~").map((id: string) => conferences[id]),
          divisions: (columnValue) =>
            columnValue.split("~").map((id: string) => divisions[id]),
        })
        .toArray()[0];

      const standings = dataForge
        .readFileSync("./src/data/standings/1.txt")
        .parseCSV()
        .parseInts(["w", "l"]);

      console.log("teams.length", teams.count());

      const teamsJoined = teams
        .joinOuterRight(
          standings,
          (left) => left.id,
          (right) => right.teamId,
          (left, right) => {
            return {
              ...left,
              l: right.l,
              w: right.w,
            };
          }
        )
        .toArray();

      return {
        league,
        teams: teamsJoined,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
});
