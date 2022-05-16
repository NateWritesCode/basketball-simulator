import { gql } from "@apollo/client";

export const getLeagueStandings = gql`
  query getLeagueStandings($leagueId: Int!, $gameGroupId: Int!) {
    getLeagueStandings(leagueId: $leagueId, gameGroupId: $gameGroupId) {
      league {
        id
      }
      teams {
        id
      }
    }
  }
`;
