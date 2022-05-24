import {
  QueryResolvers,
  Team as TeamType,
  TeamStats,
} from "../../types/resolverTypes";
import { to } from "await-to-js";

type TeamResolvers = {
  getTeamInfo: QueryResolvers["getTeamInfo"];
};

export const Team: TeamResolvers = {
  getTeamInfo: async (_parent, { abbrev }, { csvDb }) => {
    let error, teamGames, teamGameGroups, teamInfo;

    [error, teamInfo] = await to<TeamType>(
      csvDb.getOne("team", "team", { abbrev })
    );

    console.log("teamInfo", teamInfo);

    if (!teamInfo) {
      throw new Error("Team does not exist");
    }

    if (error) {
      throw new Error(error?.message);
    }

    [error, teamGames] = await to<TeamStats[]>(
      csvDb.getAll(teamInfo.id, "team-game")
    );

    if (error) {
      throw new Error(error.message);
    }

    [error, teamGameGroups] = await to<TeamStats[]>(
      csvDb.getAll(teamInfo.id, "team-game-group")
    );

    return {
      teamGames,
      teamGameGroups,
      teamInfo,
    };
  },
};
