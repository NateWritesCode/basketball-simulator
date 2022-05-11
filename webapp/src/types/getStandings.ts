/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getStandings
// ====================================================

export interface getStandings_getStandings_league_conferences_divisions {
  __typename: "Division";
  abbrev: string;
  id: number;
  name: string;
}

export interface getStandings_getStandings_league_conferences {
  __typename: "Conference";
  abbrev: string;
  divisions: getStandings_getStandings_league_conferences_divisions[] | null;
  id: number;
  name: string;
}

export interface getStandings_getStandings_league_divisions {
  __typename: "Division";
  abbrev: string;
  id: number;
  name: string;
}

export interface getStandings_getStandings_league {
  __typename: "League";
  abbrev: string;
  conferences: getStandings_getStandings_league_conferences[] | null;
  divisions: getStandings_getStandings_league_divisions[] | null;
  id: number;
  name: string;
}

export interface getStandings_getStandings_teams {
  __typename: "StandingsTeam";
  abbrev: string;
  conferenceId: number | null;
  divisionId: number | null;
  homeName: string;
  id: number;
  l: number;
  leagueId: number;
  nickname: string;
  w: number;
}

export interface getStandings_getStandings {
  __typename: "Standings";
  league: getStandings_getStandings_league;
  teams: getStandings_getStandings_teams[];
}

export interface getStandings {
  getStandings: getStandings_getStandings;
}

export interface getStandingsVariables {
  gameGroupId: string;
}
