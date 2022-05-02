import { Conference, Division, Game as DBGame, Team } from "@prisma/client";
import { keys, range, sample, set } from "lodash";
import commons from "../utils/commons";
import gameDates from "../data/gameDates.json";
import { log } from "../utils";
import { sample as simpleStatSample } from "simple-statistics";
import random from "random";

class Scheduler {
  commonNonDivisionOpponents: any;
  rareNonDivisionOpponents: any;
  conferences: Conference[];
  divisions: Division[];
  public homeTeam: any[];
  rareOpponents: any;
  public schedule: any[];
  public scheduleName: any[];
  public teamSchedulerObj: any;
  teams: Team[];
  constructor(conferences: Conference[], divisions: Division[], teams: Team[]) {
    this.conferences = conferences;
    this.divisions = divisions;
    this.homeTeam = [];
    this.schedule = [];
    this.scheduleName = [];
    this.teamSchedulerObj = {};
    this.teams = teams;

    const distances = this.getDistances(teams);

    teams.forEach((team) => {
      this.teamSchedulerObj[team.abbrev] = {
        commonNonDivisionOpponents: [],
        ha: [],
        rareNonDivisionOpponents: [],
        schedule: [],
        teamCalendar: {},
      };
    });

    // HA[0] is the group of rareNonDivOpps that a team should play 2 home games against
    // HA[1] is the group that a team should play 2 away games against, (and 1 home game)
  }

  getDistances = (teams: Team[]) => {
    const distances = {};

    teams.forEach((team1) => {
      teams.forEach((team2) => {
        let value = 0;

        if (team1.id != team2.id) {
          value = this.calculateLatLongDistance(team1, team2);
        }

        set(distances, `${team1.abbrev}.${team2.abbrev}`, value);
      });
    });

    return distances;
  };

  calculateLatLongDistance(team1: Team, team2: Team): number {
    const { lat: lat1, lng: lng1 } = team1;
    const { lat: lat2, lng: lng2 } = team2;
    if (lat1 == lat2 && lng1 == lng2) {
      return 0;
    } else {
      const radlat1 = (Math.PI * lat1) / 180;
      const radlat2 = (Math.PI * lat2) / 180;
      const theta = lng1 - lng2;
      const radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      const unit = "M"; // miles
      // if (unit == "K") {
      //   dist = dist * 1.609344;
      // }
      if (unit == "M") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  getNonDivisionOpponents = (team: Team) => {
    return this.teams.filter((oppTeam) => {
      return (
        team.conferenceId === oppTeam.conferenceId &&
        team.divisionId !== oppTeam.divisionId
      );
    });
  };

  getRandomDateAvailableForBothTeams = (homeTeam: Team, awayTeam: Team) => {
    let gameDate = "";

    while (!gameDate) {
      const randomDate = sample(gameDates)!;

      if (
        this.teamSchedulerObj[homeTeam.abbrev].teamCalendar[randomDate] ||
        this.teamSchedulerObj[awayTeam.abbrev].teamCalendar[randomDate]
      ) {
        continue;
      } else {
        gameDate = randomDate;
      }
    }

    return gameDate;
  };

  scheduleGame = ({
    homeTeam,
    awayTeam,
  }: {
    homeTeam: Team;
    awayTeam: Team;
  }) => {
    const gameDate = this.getRandomDateAvailableForBothTeams(
      homeTeam,
      awayTeam
    );
    if (gameDate) {
      this.teamSchedulerObj[homeTeam.abbrev].teamCalendar[gameDate] = true;
      this.teamSchedulerObj[awayTeam.abbrev].teamCalendar[gameDate] = true;

      this.schedule.push({
        date: new Date(gameDate),
        id: this.schedule.length + 1,
        team0Id: homeTeam.id,
        team1Id: awayTeam.id,
      });

      this.teamSchedulerObj[homeTeam.abbrev].schedule.push(
        new Game({
          gameDate,
          opponent: awayTeam,
          isHome: true,
        })
      );

      this.teamSchedulerObj[awayTeam.abbrev].schedule.push(
        new Game({
          gameDate,
          opponent: homeTeam,
          isHome: false,
        })
      );

      return true;
    }

    return false;
  };

  setCommonNonDivisionOpponents = (team: Team) => {
    const possibleCommonOpponents = this.getNonDivisionOpponents(team);
    const { rareNonDivisionOpponents } = this.teamSchedulerObj[team.abbrev];

    possibleCommonOpponents.forEach((oppTeam) => {
      if (!rareNonDivisionOpponents.includes(oppTeam.abbrev)) {
        this.teamSchedulerObj[team.abbrev].commonNonDivisionOpponents.push(
          oppTeam.abbrev
        );
      }
    });
  };

  getTeamByAbbrev = (abbrev: string): Team => {
    return this.teams.find((team) => team.abbrev === abbrev)!;
  };

  initializeHa = (team: Team) => {
    this.teamSchedulerObj[team.abbrev].ha[0] = simpleStatSample(
      this.teamSchedulerObj[team.abbrev].rareNonDivisionOpponents,
      2,
      () => random.float(0, 1)
    );
    this.teamSchedulerObj[team.abbrev].ha[1] = this.teamSchedulerObj[
      team.abbrev
    ].rareNonDivisionOpponents.filter((teamAbbrev: string) => {
      return !this.teamSchedulerObj[team.abbrev].ha[0].includes(teamAbbrev);
    });
  };

  makeHaConsistent = (team: Team) => {
    this.teamSchedulerObj[team.abbrev].ha[0].forEach((team2: string) => {
      this.swapHa(team, this.getTeamByAbbrev(team2));
    });
    this.teamSchedulerObj[team.abbrev].ha[1].forEach((team3: string) => {
      this.swapHa(team, this.getTeamByAbbrev(team3));
    });

    let i = 0;
    this.teams.forEach((team4: Team) => {
      if (this.teamSchedulerObj[team.abbrev].ha[0].includes(team4.abbrev)) {
        i++;
      }
    });

    if (i !== 2) {
      console.log("Make HA Consistent error", team.abbrev);
    }
  };

  swapHa = (team1: Team, team2: Team) => {
    while (
      this.teamSchedulerObj[team1.abbrev].ha[0].includes(team2.abbrev) &&
      !this.teamSchedulerObj[team2.abbrev].ha[1].includes(team1.abbrev)
    ) {
      this.teamSchedulerObj[team2.abbrev].ha[1].push(team1.abbrev);
      this.teamSchedulerObj[team2.abbrev].ha[0] = this.teamSchedulerObj[
        team2.abbrev
      ].ha[0].filter((teamAbbrev: string) => teamAbbrev !== team1.abbrev);

      const r = sample(this.teamSchedulerObj[team2.abbrev].ha[1]);
      this.teamSchedulerObj[team2.abbrev].ha[1] = this.teamSchedulerObj[
        team2.abbrev
      ].ha[1].filter((teamAbbrev: string) => teamAbbrev !== r);
      this.teamSchedulerObj[team2.abbrev].ha[0].push(r);
    }

    while (
      this.teamSchedulerObj[team1.abbrev].ha[1].includes(team2.abbrev) &&
      !this.teamSchedulerObj[team2.abbrev].ha[0].includes(team1.abbrev)
    ) {
      this.teamSchedulerObj[team2.abbrev].ha[0].push(team1.abbrev);
      this.teamSchedulerObj[team2.abbrev].ha[1] = this.teamSchedulerObj[
        team2.abbrev
      ].ha[1].filter((teamAbbrev: string) => teamAbbrev !== team1.abbrev);
      const r = sample(this.teamSchedulerObj[team2.abbrev].ha[0]);
      this.teamSchedulerObj[team2.abbrev].ha[0] = this.teamSchedulerObj[
        team2.abbrev
      ].ha[0].filter((teamAbbrev: string) => teamAbbrev !== r);
      this.teamSchedulerObj[team2.abbrev].ha[1].push(r);
    }
  };

  setRareNonDivisionOpponents = (team: Team) => {
    const { rareNonDivisionOpponents } = this.teamSchedulerObj[team.abbrev];
    const possibleRareOpponents = this.getNonDivisionOpponents(team);
    const numScheduledRareGames =
      this.teamSchedulerObj[team.abbrev].rareNonDivisionOpponents.length;

    if (numScheduledRareGames > 4) {
      const randAbbrev = sample(rareNonDivisionOpponents);
      this.teamSchedulerObj[team.abbrev].rareNonDivisionOpponents =
        this.teamSchedulerObj[team.abbrev].rareNonDivisionOpponents.filter(
          (team: string) => team !== randAbbrev
        );
      this.teamSchedulerObj[randAbbrev].rareNonDivisionOpponents =
        this.teamSchedulerObj[randAbbrev].rareNonDivisionOpponents.filter(
          (randTeam: string) => randTeam !== team.abbrev
        );
      this.setRareNonDivisionOpponents(team);
      this.setRareNonDivisionOpponents(this.getTeamByAbbrev(randAbbrev));
    } else if (numScheduledRareGames < 4) {
      let leastNumberOfRaresScheduled = 0;

      possibleRareOpponents
        .map((team) => team.abbrev)
        .forEach((randTeamAbbrev: string) => {
          const numOfRaresScheduled =
            4 -
            this.teamSchedulerObj[randTeamAbbrev].rareNonDivisionOpponents
              .length;

          if (numOfRaresScheduled > leastNumberOfRaresScheduled) {
            leastNumberOfRaresScheduled = numOfRaresScheduled;
          }
        });

      const possibleOpps = possibleRareOpponents.filter((opp) => {
        const numOfRaresScheduled =
          4 - this.teamSchedulerObj[opp.abbrev].rareNonDivisionOpponents.length;
        return numOfRaresScheduled === leastNumberOfRaresScheduled;
      });

      const opp = sample(possibleOpps);

      if (!opp) {
        throw new Error(
          "We need a random opponent to continue. If not, the team has no chance of completing"
        );
      }

      if (
        this.teamSchedulerObj[team.abbrev].rareNonDivisionOpponents.includes(
          opp.abbrev
        ) ||
        this.teamSchedulerObj[opp.abbrev].rareNonDivisionOpponents.includes(
          team.abbrev
        )
      ) {
        this.setRareNonDivisionOpponents(team);
        // this.setRareNonDivisionOpponents(opp);
        return;
      }

      this.teamSchedulerObj[team.abbrev].rareNonDivisionOpponents.push(
        opp.abbrev
      );
      this.teamSchedulerObj[opp.abbrev].rareNonDivisionOpponents.push(
        team.abbrev
      );
      this.setRareNonDivisionOpponents(team);
      this.setRareNonDivisionOpponents(opp);
    }
  };

  createNbaSchedule = () => {
    log.info("Creating NBA Schedule");

    this.teams.forEach((team) => {
      this.setRareNonDivisionOpponents(team);
      this.setCommonNonDivisionOpponents(team);
    });

    this.teams.forEach((team) => {
      const { schedule } = this.teamSchedulerObj[team.abbrev];
      const divisionOpponents = this.teams.filter(
        (oppTeam) =>
          oppTeam.divisionId === team.divisionId && team.id !== oppTeam.id
      );

      divisionOpponents.forEach((divisionOpponent: Team) => {
        if (team.id === divisionOpponent.id) return;
        let i = 0;
        while (i < 2) {
          const isGameScheduled = this.scheduleGame({
            homeTeam: team,
            awayTeam: divisionOpponent,
          });

          if (isGameScheduled) {
            i++;
          }
        }
      });

      const nonConferenceOpponents = this.teams.filter(
        (oppTeam) => oppTeam.conferenceId !== team.conferenceId
      );

      nonConferenceOpponents.forEach((nonConferenceOpponent: Team) => {
        let i = 0;
        while (i < 1) {
          const isGameScheduled = this.scheduleGame({
            homeTeam: team,
            awayTeam: nonConferenceOpponent,
          });

          if (isGameScheduled) {
            i++;
          }
        }
      });

      this.teamSchedulerObj[team.abbrev].rareNonDivisionOpponents.forEach(
        (rareNonDivisionOpponent: string) => {
          let i = 0;

          while (i < 1) {
            const awayTeam = this.teams.find(
              (oppTeam) => oppTeam.abbrev === rareNonDivisionOpponent
            );
            if (!awayTeam) {
              throw new Error(
                "Can't make non conference opponent without away team"
              );
            }

            const isGameScheduled = this.scheduleGame({
              homeTeam: team,
              awayTeam,
            });

            if (isGameScheduled) {
              i++;
            }
          }
        }
      );

      this.teamSchedulerObj[team.abbrev].commonNonDivisionOpponents.forEach(
        (commonNonDivisionOpponent: string) => {
          let i = 0;

          while (i < 2) {
            const awayTeam = this.teams.find(
              (oppTeam) => oppTeam.abbrev === commonNonDivisionOpponent
            );
            if (!awayTeam) {
              throw new Error(
                "Can't make non conference opponent without away team"
              );
            }

            const isGameScheduled = this.scheduleGame({
              homeTeam: team,
              awayTeam,
            });

            if (isGameScheduled) {
              i++;
            }
          }
        }
      );
    });

    this.teams.forEach((team) => {
      this.initializeHa(team);
    });

    this.teams.forEach((team) => {
      this.makeHaConsistent(team);
    });

    let isHaListsConsistent = false;

    while (!isHaListsConsistent) {
      let j = 0;

      this.teams.forEach((team) => {
        let i = 0;

        this.teams.forEach((team2) => {
          if (this.teamSchedulerObj[team2.abbrev].ha[1].includes(team.abbrev)) {
            i += 1;
          }
        });

        if (i !== 2) {
          this.makeHaConsistent(team);
          j += 1;
        }
      });

      if (j === 0) {
        isHaListsConsistent = true;
      }
    }

    this.teams.forEach((team) => {
      this.teamSchedulerObj[team.abbrev].ha[0].forEach((h: string) => {
        let i = 0;

        while (i < 1) {
          const homeTeam = this.teams.find((oppTeam) => oppTeam.abbrev === h);
          if (!homeTeam) {
            throw new Error(
              "Can't make non conference opponent without away team"
            );
          }

          const isGameScheduled = this.scheduleGame({
            homeTeam,
            awayTeam: team,
          });

          if (isGameScheduled) {
            i++;
          }
        }
      });
    });
  };
}

export default Scheduler;

class Game {
  gameDate: string;
  opponent: Team;
  isHome: boolean;
  constructor({
    gameDate,
    opponent,
    isHome,
  }: {
    gameDate: string;
    opponent: Team;
    isHome: boolean;
  }) {
    this.gameDate = gameDate;
    this.opponent = opponent;
    this.isHome = isHome;
  }
}
