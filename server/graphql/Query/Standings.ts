import { Context } from "../../types/general";
import { getLeagueStandings } from "../../types/resolverArgs";
import {
  Conference,
  Division,
  LeagueStandings,
  Team,
  League,
} from "../../types/resolvers";
import lodashJoins from "lodash-joins";
import { QueryResolvers } from "../../types/resolverTypes";
const { hashRightOuterJoin } = lodashJoins;

type StandingsResolvers = {
  getLeagueStandings: QueryResolvers["getLeagueStandings"];
};

export const Standings: StandingsResolvers = {
  getLeagueStandings: async (
    _parent,
    _args,
    { csvDb }: Context
  ): Promise<LeagueStandings | null> => {
    const teams: Team[] = await csvDb.read("team", "team");
    const divisions: Division[] = await csvDb.read("division", "division");
    const conferences: Conference[] = await csvDb.read(
      "conference",
      "conference"
    );

    conferences.forEach((conference) => {
      if (conference.divisions) {
        conference.divisions = convertStringToArrayOfObj(
          conference.divisions as unknown as string,
          divisions
        );
      }
    });

    const standings: TeamsStandingsFile[] = await csvDb.read("1", "standings");
    const league: League = await csvDb.getOne("league", "league", { id: 1 });

    if (league.conferences) {
      league.conferences = convertStringToArrayOfObj(
        league.conferences as unknown as string,
        conferences
      );
    }

    if (league.divisions) {
      league.divisions = convertStringToArrayOfObj(
        league.divisions as unknown as string,
        divisions
      );
    }

    const teamsJoined = hashRightOuterJoin(
      teams,
      (left) => left.id,
      standings,
      (right) => right.teamId
    );

    return {
      league,
      teams: teamsJoined as any,
    };
  },
};

const convertStringToArrayOfObj = (idString: string, arrToMatch: any[]) => {
  return idString.split(",").map((id: string) => {
    return arrToMatch.find((obj) => obj.id === Number(id));
  });
};
