import { Conference, Division, Team } from "@prisma/client";
import { range, sample, set } from "lodash";
import commons from "../utils/commons";
import gameDates from "../data/gameDates.json";

class Scheduler {
  commonNonDivisionOpponents: any;
  rareNonDivisionOpponents: any;
  conferences: Conference[];
  divisions: Division[];
  public homeTeam: any[];
  rareOpponents: any;
  public schedule: any[];
  public scheduleName: any[];
  teamSchedulerObj: any;
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
        rareNonDivisionOpponents: [],
        common: commons[team.abbrev].slice(4),
        ha0: commons[team.abbrev].slice(0, 2),
        ha1: commons[team.abbrev].slice(2, 4),
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
      team.conferenceId === oppTeam.conferenceId &&
        team.divisionId !== oppTeam.divisionId;
    });
  };

  scheduleGame = ({
    homeTeam,
    awayTeam,
  }: {
    homeTeam: Team;
    awayTeam: Team;
  }) => {
    const randomDate = sample(gameDates);

    if (randomDate) {
      if (
        !this.teamSchedulerObj[homeTeam.abbrev].teamCalendar[randomDate] &&
        !this.teamSchedulerObj[awayTeam.abbrev].teamCalendar[randomDate]
      ) {
        this.teamSchedulerObj[homeTeam.abbrev].teamCalendar[randomDate] = true;
        this.teamSchedulerObj[awayTeam.abbrev].teamCalendar[randomDate] = true;

        this.teamSchedulerObj[homeTeam.abbrev].schedule.push(
          new Game({
            randomDate,
            opponent: awayTeam,
            isHome: true,
          })
        );

        this.teamSchedulerObj[awayTeam.abbrev].schedule.push(
          new Game({
            randomDate,
            opponent: homeTeam,
            isHome: false,
          })
        );

        return true;
      }
    }

    return false;
  };

  setCommonNonDivisionOpponents = (team: Team) => {
    const commonNonDivisionOpponents: Team[] =
      this.teamSchedulerObj[team.abbrev].commonNonDivisionOpponents;
    const nonDivisionOpponents = this.getNonDivisionOpponents(team);

    if (commonNonDivisionOpponents.length > 6) {
      const randomCommonOpponent = sample(commonNonDivisionOpponents)!;
      this.teamSchedulerObj[team.abbrev].commonNonDivisionOpponents.filter(
        (oppTeam: any) => oppTeam.id !== randomCommonOpponent.id
      );

      this.teamSchedulerObj[
        randomCommonOpponent.abbrev
      ].commonNonDivisionOpponents.filter(
        (oppTeam: any) => oppTeam.id !== team.id
      );

      this.setCommonNonDivisionOpponents(team);
      this.setCommonNonDivisionOpponents(randomCommonOpponent);
    } else if (commonNonDivisionOpponents.length < 6) {
      const frontier: any[] = [];

      nonDivisionOpponents.forEach((nonDivisionOpponent) => {
        if (
          !commonNonDivisionOpponents
            .map((t) => t.id)
            .includes(nonDivisionOpponent.id)
        ) {
          frontier.push([
            nonDivisionOpponent,
            this.teamSchedulerObj[nonDivisionOpponent.abbrev]
              .commonNonDivisionOpponents,
          ]);
        }

        let minLen = 100;
        let minIndex = -1;

        range(frontier.length).forEach((f, i) => {
          if (frontier[f][1] <= minLen) {
            minLen = frontier[f][1];
            minIndex = f;
          }
        });
        let rand1 = frontier[minIndex][0];
        this.teamSchedulerObj[team.abbrev].commonNonDivisionOpponents.push(
          rand1
        );
        this.setCommonNonDivisionOpponents(team);
        this.setCommonNonDivisionOpponents(rand1);
      });
    }
  };

  setRareNonDivisionOpponents = () => {};

  createNbaSchedule = () => {
    this.teams.forEach((team, i) => {
      let otherConference = 1;
      if (team.conferenceId === 1) {
        otherConference = 2;
      }
      const nonConferenceOpponents = this.conferences[otherConference];
      const divisionOpponents = this.divisions[team.divisionId];
      const commonNonDivisionOpponents = this.teams.filter((oppTeam) => {
        if (
          this.teamSchedulerObj[team.abbrev].common.includes(oppTeam.abbrev)
        ) {
          return true;
        } else {
          return false;
        }
      });
      const rareNonDivisionOpponents = this.teams.filter((oppTeam) => {
        if (this.teamSchedulerObj[team.abbrev].ha0.includes(oppTeam.abbrev)) {
          return true;
        } else {
          return false;
        }
      });

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

      commonNonDivisionOpponents.forEach((commonNonDivOpp: Team) => {
        let i = 0;
        while (i < 2) {
          this.schedule.push([commonNonDivOpp, team]);
          this.scheduleName.push([commonNonDivOpp.abbrev, team.abbrev]);
          this.homeTeam.push(team);
          i++;
        }
      });

      rareNonDivisionOpponents.forEach((rareNonDivOpp: Team) => {
        let i = 0;
        while (i < 1) {
          this.schedule.push([rareNonDivOpp, team]);
          this.scheduleName.push([rareNonDivOpp.abbrev, team.abbrev]);
          this.homeTeam.push(team);
          i++;
        }
      });
    });
  };
}

export default Scheduler;

class Game {
  randomDate: string;
  opponent: Team;
  isHome: boolean;
  constructor({
    randomDate,
    opponent,
    isHome,
  }: {
    randomDate: string;
    opponent: Team;
    isHome: boolean;
  }) {
    this.randomDate = randomDate;
    this.opponent = opponent;
    this.isHome = isHome;
  }
}
