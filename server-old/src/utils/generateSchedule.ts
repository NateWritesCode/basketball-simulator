import moment from "moment";
import { Team } from "@prisma/client";
import random from "random";

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
        const noGameDays = [
          "2021-12-24",
          "2022-2-18",
          "2022-2-19",
          "2022-2-20",
          "2022-4-15",
        ];
        const regularSeasonStart = "2021-10-19";
        const regularSeasonEnd = "2022-04-10";
        // A five-year rotation determines which out-of-division conference teams are played only 3 times. numAgainstOutDivisionInConferenceLess
        const numAgainstInDivisionInConference = 4;
        const numAgainstOutDivisionInConferenceMore = 4;
        const numAgainstOutDivisionInConferenceLess = 3; // 4 teams, in the NBA these rotate every 5 years, presumably it will always be 4 teams
        const numAgainstOutConference = 2;
        const maxBackToBacksPerTeam = 13;

        let currentDate = regularSeasonStart;

        const teamScheduleInfoHolder: any = {};

        teams.forEach((team) => {
          teamScheduleInfoHolder[team.abbrev] = {};

          teams.forEach((opponentTeam) => {
            if (team.id === opponentTeam.id) {
              return;
            } else {
              let opponentType = getOpponentType(team, opponentTeam);

              teamScheduleInfoHolder[team.abbrev][opponentTeam.abbrev] = {
                numGames: 0,
                opponentType,
              };
            }
          });
        });

        teams.forEach(({ abbrev: teamAbbrev }) => {
          const opponentKeys = Object.keys(teamScheduleInfoHolder[teamAbbrev]);

          opponentKeys.forEach((opponentAbbrev) => {
            if (!teamScheduleInfoHolder[teamAbbrev][opponentAbbrev].numGames) {
              const { numGames, opponentType } =
                teamScheduleInfoHolder[teamAbbrev][opponentAbbrev];

              if (numGames) {
                return;
              }
              if (opponentType === "outDivisionInConference") {
                const teamNumOf3Games = getNumOf3Games(
                  teamScheduleInfoHolder,
                  teamAbbrev
                );

                if (teamNumOf3Games < 4) {
                  teamScheduleInfoHolder[teamAbbrev][opponentAbbrev].numGames =
                    numAgainstOutDivisionInConferenceLess;
                } else {
                  teamScheduleInfoHolder[teamAbbrev][opponentAbbrev].numGames =
                    numAgainstOutDivisionInConferenceMore;
                }
              } else if (opponentType === "inDivisionInConference") {
                teamScheduleInfoHolder[teamAbbrev][opponentAbbrev].numGames =
                  numAgainstInDivisionInConference;
                teamScheduleInfoHolder[opponentAbbrev][teamAbbrev].numGames =
                  numAgainstInDivisionInConference;
              } else if (opponentType === "outDivisionOutConference") {
                teamScheduleInfoHolder[teamAbbrev][opponentAbbrev].numGames =
                  numAgainstOutConference;
                teamScheduleInfoHolder[opponentAbbrev][teamAbbrev].numGames =
                  numAgainstOutConference;
              } else {
                throw new Error(
                  `Don't know how to handle this ${opponentType}`
                );
              }
            }
          });
        });

        console.log("teamScheduleInfoHolder", teamScheduleInfoHolder);

        const teamAbbrevs = Object.keys(teamScheduleInfoHolder);

        teamAbbrevs.forEach((teamAbbrev) => {
          let numOfGames = 0;
          const oppAbbrevs = Object.keys(teamScheduleInfoHolder[teamAbbrev]);
          oppAbbrevs.forEach((oppAbbrev) => {
            numOfGames +=
              teamScheduleInfoHolder[teamAbbrev][oppAbbrev].numGames;
          });

          console.log(teamAbbrev, numOfGames);
        });

        let yesterday = [];
        let twoDaysAgo = [];

        while (currentDate <= regularSeasonEnd) {
          //West coast and east coast trip

          const numOfGames = random.integer(3, 12);
          const currentDateMoment = moment(currentDate).add(1, "day");
          currentDate = currentDateMoment.format("YYYY-MM-DD");
        }
        console.log("Finished");
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

const getNumOf3Games = (obj: any, teamAbbrev: string) => {
  const keys = Object.keys(obj[teamAbbrev]);
  let numOf3Games = 0;

  keys.forEach((key) => {
    if (obj[teamAbbrev][key].numGames === 3) {
      numOf3Games++;
    }
  });

  return numOf3Games;
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
