import { Conference, Division, Team } from "@prisma/client";
import { groupBy, set } from "lodash";
import commons from "../utils/commons";

// Translated from this Python project by humblehwang, publicly available here: https://github.com/humblehwang/nab_schedule/blob/master/Project
class Scheduler {
  commonNonDivisionOpponents: any;
  rareNonDivisionOpponents: any;
  conferences: any;
  divisions: any;
  public homeTeam: any[];
  rareOpponents: any;
  public schedule: any[];
  public scheduleName: any[];
  schedulerTeamObj: any;
  teams: Team[];
  constructor(conferences: Conference[], divisions: Division[], teams: Team[]) {
    this.conferences = groupBy(teams, "conferenceId");
    this.divisions = groupBy(teams, "divisionId");
    this.homeTeam = [];
    this.schedule = [];
    this.scheduleName = [];
    this.schedulerTeamObj = {};
    this.teams = teams;

    const distances = this.getDistances(teams);

    teams.forEach((team) => {
      this.schedulerTeamObj[team.abbrev] = {
        common: commons[team.abbrev].slice(4),
        ha0: commons[team.abbrev].slice(0, 2),
        ha1: commons[team.abbrev].slice(2, 4),
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
          this.schedulerTeamObj[team.abbrev].common.includes(oppTeam.abbrev)
        ) {
          return true;
        } else {
          return false;
        }
      });
      const rareNonDivisionOpponents = this.teams.filter((oppTeam) => {
        if (this.schedulerTeamObj[team.abbrev].ha0.includes(oppTeam.abbrev)) {
          return true;
        } else {
          return false;
        }
      });

      divisionOpponents.forEach((divisionOpponent: Team) => {
        if (team.id === divisionOpponent.id) return;
        let i = 0;
        while (i < 2) {
          this.schedule.push([divisionOpponent, team]);
          this.scheduleName.push([divisionOpponent.abbrev, team.abbrev]);
          this.homeTeam.push(team);
          i++;
        }
      });
      nonConferenceOpponents.forEach((nonConferenceOpponent: Team) => {
        let i = 0;
        while (i < 1) {
          this.schedule.push([nonConferenceOpponent, team]);
          this.scheduleName.push([nonConferenceOpponent.abbrev, team.abbrev]);
          this.homeTeam.push(team);
          i++;
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
