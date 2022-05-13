import { nonNull, queryField, stringArg } from "nexus";

export const getOneTeam = queryField("getOneTeam", {
  type: "Team",
  args: {
    abbrev: nonNull(stringArg()),
  },
  async resolve(_parent, { abbrev }, { dataForge }) {
    try {
      const team = dataForge
        .readFileSync("./src/data/team/team.txt")
        .parseCSV()
        .where((team) => team.abbrev === abbrev)
        .parseDates(["yearFounded"])
        .parseFloats(["lat", "lng"])
        .toArray()[0];

        console.log('team.id', team.id);

      const teamGame = dataForge
        .readFileSync(`./src/data/team-game/${team.id}.txt`)
        .parseCSV({ dynamicTyping: true })
        .toArray();

      // console.log("teamGame", teamGame);

      const teamGameGroup = dataForge
        .readFileSync(`./src/data/team-game-group/${team.id}.txt`)
        .parseCSV({ dynamicTyping: true })
        .toArray();

      console.log("teamGameGroup", teamGameGroup);

      return null;
    } catch (error) {
      throw new Error(error);
    }
  },
});
