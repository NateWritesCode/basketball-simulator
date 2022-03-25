/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOnePlayer
// ====================================================

export interface getOnePlayer_getOnePlayer_team {
  __typename: "Team";
  abbrev: string;
  homeName: string;
  id: number;
  nickname: string;
}

export interface getOnePlayer_getOnePlayer {
  __typename: "Player";
  active: boolean;
  birthdate: any;
  country: string | null;
  draftNumber: number | null;
  draftRound: number | null;
  draftYear: any | null;
  familyName: string;
  fromYear: any | null;
  givenName: string;
  greatest75: boolean;
  hasPlayedDLeague: boolean;
  hasPlayedGames: boolean;
  hasPlayedNba: boolean;
  height: number;
  id: number;
  jerseyNumber: number | null;
  playerCode: string | null;
  position: string;
  rebounding: number;
  school: string | null;
  seasonsExperience: number;
  slug: string;
  team: getOnePlayer_getOnePlayer_team;
  toYear: any | null;
  weight: number;
}

export interface getOnePlayer {
  getOnePlayer: getOnePlayer_getOnePlayer | null;
}

export interface getOnePlayerVariables {
  slug: string;
}
