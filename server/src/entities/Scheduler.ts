import { Conference, Division, Team } from "@prisma/client";
import { groupBy, set } from "lodash";
import commons from "../utils/commons";

// Translated from this Python project by humblehwang, publicly available here: https://github.com/humblehwang/nab_schedule/blob/master/Project
class Scheduler {
  commonNonDivisionOpponents: any;
  rareNonDivisionOpponents: any;
  conferences: any;
  divisions: any;
  homeTeam: any[];
  rareOpponents: any;
  schedule: any[];
  scheduleName: any[];
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

    console.log("schedulerTeamObj", this.schedulerTeamObj);

    // const teamsAbbrev: any = this.teams.reduce((prev, curr) => {
    //   return {
    //     ...prev,
    //     [curr.abbrev]: curr,
    //   };
    // }, {});

    // this.commonNonDivisionOpponents = this.teams.reduce((prev, curr) => {
    //   const commonTeams = commons[curr.abbrev].slice(4, 10);
    //   return {
    //     ...prev,
    //     [curr.abbrev]: commonTeams.map(
    //       (oppAbbrev: any) => teamsAbbrev[oppAbbrev]
    //     ),
    //   };
    // }, {});

    // this.rareNonDivisionOpponents = this.teams.reduce((prev, curr) => {
    //   return {
    //     ...prev,
    //     [curr.abbrev]: this.teams.filter((team) => {
    //       const commonTeamIds = this.commonNonDivisionOpponents[
    //         curr.abbrev
    //       ].map((team: Team) => team.id);

    //       if (
    //         team.conferenceId === curr.conferenceId &&
    //         team.divisionId !== curr.divisionId &&
    //         !commonTeamIds.includes(team.id)
    //       ) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     }),
    //   };
    // }, {});
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
    this.teams.forEach((team) => {
      let otherConference = 1;
      if (team.conferenceId === 1) {
        otherConference = 2;
      }
      const nonConferenceOpponents = this.conferences[otherConference];
      const divisionOpponents = this.divisions[team.divisionId];
      const commonNonDivisionOpponents =
        this.commonNonDivisionOpponents[team.abbrev];
      const rareNonDivisionOpponents =
        this.rareNonDivisionOpponents[team.abbrev];
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
      rareNonDivisionOpponents.forEach((rareNonDivisionOpp: Team) => {
        let i = 0;
        while (i < 1) {
          this.schedule.push([rareNonDivisionOpp, team]);
          this.scheduleName.push([rareNonDivisionOpp.abbrev, team.abbrev]);
          this.homeTeam.push(team);
          i++;
        }
      });
    });
  };
}

export default Scheduler;
