import moment from "moment";
import { Team } from "@prisma/client";

export default ({
  scheduleType,
  teams,
}: {
  scheduleType: "nba";
  teams: Team[];
}) => {
  switch (scheduleType) {
    case "nba": {
      if (teams.length === 30) {
        const noGameDays = ["2021-12-24"];
        const regularSeasonStart = "2021-10-19";
        const regularSeasonEnd = "2022-04-10";
        // A five-year rotation determines which out-of-division conference teams are played only 3 times. numAgainstOutDivisionInConferenceLess
        const numAgainstInDivisionInConference = 4;
        const numAgainstOutDivisionInConferenceMore = 4;
        const numAgainstOutDivisionInConferenceLess = 3;
        const numAgainstOutConference = 2;
        const maxBackToBacksPerTeam = 13;

        let currentDate = regularSeasonStart;

        const teamObj: any = {};

        teams.forEach((team) => {
          teamObj[team.abbrev] = {};

          teams.forEach((opponentTeam) => {
            if (team.id === opponentTeam.id) {
              return;
            } else {
              let opponentType = getOpponentType(team, opponentTeam);

              teamObj[team.abbrev][opponentTeam.abbrev] = {
                opponentType,
              };
            }
          });
        });

        while (currentDate <= regularSeasonEnd) {
          console.log(currentDate);
          currentDate = moment(currentDate).add(1, "day").format("YYYY-MM-DD");
        }
        console.log("Finished");

        // const teamObj: any = {};

        // teams.forEach((team) => {
        //   teamObj[team.id];
        // });
      } else {
        throw new Error(
          "Don't know how to handle this amount of teams for NBA schedule"
        );
      }

      break;
    }
    default:
      const exhaustiveCheck: never = scheduleType;
      throw new Error(exhaustiveCheck);
  }
};

const getOpponentType = (
  team: Team,
  opponentTeam: Team
):
  | "inDivisionInConference"
  | "outDivisionInConference"
  | "outDivisionOutConference" => {
  let isInConference = false;
  let isInDivision = false;

  if (
    team.conferenceId &&
    opponentTeam.conferenceId &&
    team.conferenceId === opponentTeam.conferenceId
  ) {
    isInConference = true;
  }

  if (
    team.divisionId &&
    opponentTeam.divisionId &&
    team.divisionId === opponentTeam.divisionId
  ) {
    isInDivision = true;
  }

  if (isInConference && isInDivision) {
    return "inDivisionInConference";
  } else if (isInConference && !isInDivision) {
    return "outDivisionInConference";
  } else if (!isInConference) {
    return "outDivisionOutConference";
  } else {
    throw new Error("Problem getting opponent type");
  }
};
