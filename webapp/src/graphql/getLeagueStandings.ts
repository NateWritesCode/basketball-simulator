import { gql } from "@apollo/client";

export const getLeagueStandings = gql`
  query getLeagueStandings($leagueId: Int!, $gameGroupId: Int!) {
    getLeagueStandings(leagueId: $leagueId, gameGroupId: $gameGroupId) {
      league {
        abbrev
        conferences {
          abbrev
          divisions {
            abbrev
            id
            name
          }
          id
          name
        }
        divisions {
          abbrev
          id
          name
        }
        id
        name
      }
      teams {
        abbrev
        conferenceId
        divisionId
        homeName
        id
        l
        leagueId
        nickname
        w
      }
    }
  }
`;
