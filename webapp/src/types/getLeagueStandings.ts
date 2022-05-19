/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLeagueStandings
// ====================================================

export interface getLeagueStandings_getLeagueStandings_league_conferences_divisions {
  __typename: "Division";
  abbrev: string;
  id: number;
  name: string;
}

export interface getLeagueStandings_getLeagueStandings_league_conferences {
  __typename: "Conference";
  abbrev: string;
  divisions: getLeagueStandings_getLeagueStandings_league_conferences_divisions[] | null;
  id: number;
  name: string;
}

export interface getLeagueStandings_getLeagueStandings_league_divisions {
  __typename: "Division";
  abbrev: string;
  id: number;
  name: string;
}

export interface getLeagueStandings_getLeagueStandings_league {
  __typename: "League";
  abbrev: string;
  conferences: getLeagueStandings_getLeagueStandings_league_conferences[] | null;
  divisions: getLeagueStandings_getLeagueStandings_league_divisions[] | null;
  id: number;
  name: string;
}

export interface getLeagueStandings_getLeagueStandings_teams {
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

export interface getLeagueStandings_getLeagueStandings {
  __typename: "LeagueStandings";
  league: getLeagueStandings_getLeagueStandings_league;
  teams: getLeagueStandings_getLeagueStandings_teams[];
}

export interface getLeagueStandings {
  getLeagueStandings: getLeagueStandings_getLeagueStandings | null;
}

export interface getLeagueStandingsVariables {
  leagueId: number;
  gameGroupId: number;
}
