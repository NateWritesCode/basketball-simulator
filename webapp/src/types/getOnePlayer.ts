/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOnePlayer
// ====================================================

export interface getOnePlayer_getOnePlayer {
  __typename: "Player";
  familyName: string;
  givenName: string;
  id: number;
}

export interface getOnePlayer {
  getOnePlayer: getOnePlayer_getOnePlayer | null;
}

export interface getOnePlayerVariables {
  id: number;
}
