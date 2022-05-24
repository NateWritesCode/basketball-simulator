import { gql } from "@apollo/client";

export const getTeamInfo = gql`
  query getTeamInfo($abbrev: String!) {
    getTeamInfo(abbrev: $abbrev) {
      teamInfo {
        abbrev
        facebook
        homeName
        id
        nickname
        twitter
        venue
        venueCapacity
        yearFounded
      }
      teamGames {
        andOne
        ast
        blk
        foulsOffensive
        foulsOffensiveCharge
        foulsOffensiveOther
        foulsShooting
        foulsTechnical
        fta
        ftm
        heaves
        jumpBallsLost
        jumpBallsWon
        orb
        pf
        pts
        stl
        substitutions
        teamDrb
        teamOrb
        tov
        tpa
        tpm
      }
      teamGameGroups {
        andOne
        ast
        blk
        foulsOffensive
        foulsOffensiveCharge
        foulsOffensiveOther
        foulsShooting
        foulsTechnical
        fta
        ftm
        heaves
        jumpBallsLost
        jumpBallsWon
        orb
        pf
        pts
        stl
        substitutions
        teamDrb
        teamOrb
        tov
        tpa
        tpm
      }
    }
  }
`;
