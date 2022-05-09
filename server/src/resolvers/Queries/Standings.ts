import { DataFrame, Series } from "data-forge";
import { idArg, nonNull, queryField } from "nexus";

export const getStandings = queryField("getStandings", {
  type: "Standings",
  args: {
    gameGroupId: nonNull(idArg()),
  },
  async resolve(_parent, { gameGroupId }, { csvDbClient, dataForge }) {
    try {
      const conferences = dataForge
        .readFileSync("./src/data/conference/conference.txt")
        .parseCSV()
        .toArray();
      const divisions = dataForge
        .readFileSync("./src/data/division/division.txt")
        .parseCSV()
        .toArray();
      const league = dataForge
        .readFileSync("./src/data/league/league.txt")
        .parseCSV()
        .toArray();
      const standings = dataForge
        .readFileSync("./src/data/standings/1.txt")
        .parseCSV()
        .setIndex("teamId")
        .parseInts(["w", "l"]);
      const teams = dataForge
        .readFileSync("./src/data/team/team.txt")
        .parseCSV()
        .setIndex("id")
        .parseDates(["yearFounded"])
        .parseInts(["lat", "lng"]);

      console.log("teams.toArray()", teams.toArray());

      const joined = standings.join(
        teams,
        (left) => left.teamId,
        (right) => right.id,
        (left, right) => {
          return {
            l: left.l,
            w: left.w,
            team: right,
          };
        }
      );

      // console.log("joined", joined.toArray());

      return null;
    } catch (error) {
      throw new Error(error);
    }
  },
});
