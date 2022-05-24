/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTeamInfo
// ====================================================

export interface getTeamInfo_getTeamInfo_teamInfo {
  __typename: "Team";
  abbrev: string;
  facebook: string | null;
  homeName: string;
  id: number;
  nickname: string;
  twitter: string | null;
  venue: string;
  venueCapacity: number;
  yearFounded: any;
}

export interface getTeamInfo_getTeamInfo_teamGames {
  __typename: "TeamStats";
  andOne: number;
  ast: number;
  blk: number;
  foulsOffensive: number;
  foulsOffensiveCharge: number;
  foulsOffensiveOther: number;
  foulsShooting: number;
  foulsTechnical: number;
  fta: number;
  ftm: number;
  heaves: number;
  jumpBallsLost: number;
  jumpBallsWon: number;
  orb: number;
  pf: number;
  pts: number;
  stl: number;
  substitutions: number;
  teamDrb: number;
  teamOrb: number;
  tov: number;
  tpa: number;
  tpm: number;
}

export interface getTeamInfo_getTeamInfo_teamGameGroups {
  __typename: "TeamStats";
  andOne: number;
  ast: number;
  blk: number;
  foulsOffensive: number;
  foulsOffensiveCharge: number;
  foulsOffensiveOther: number;
  foulsShooting: number;
  foulsTechnical: number;
  fta: number;
  ftm: number;
  heaves: number;
  jumpBallsLost: number;
  jumpBallsWon: number;
  orb: number;
  pf: number;
  pts: number;
  stl: number;
  substitutions: number;
  teamDrb: number;
  teamOrb: number;
  tov: number;
  tpa: number;
  tpm: number;
}

export interface getTeamInfo_getTeamInfo {
  __typename: "TeamInfo";
  teamInfo: getTeamInfo_getTeamInfo_teamInfo;
  teamGames: getTeamInfo_getTeamInfo_teamGames[] | null;
  teamGameGroups: getTeamInfo_getTeamInfo_teamGameGroups[] | null;
}

export interface getTeamInfo {
  getTeamInfo: getTeamInfo_getTeamInfo | null;
}

export interface getTeamInfoVariables {
  abbrev: string;
}
