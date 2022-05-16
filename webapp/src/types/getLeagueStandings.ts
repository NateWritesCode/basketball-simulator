/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLeagueStandings
// ====================================================

export interface getLeagueStandings_getLeagueStandings_league {
  __typename: "League";
  id: number;
}

export interface getLeagueStandings_getLeagueStandings_teams {
  __typename: "StandingsTeam";
  id: number;
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
