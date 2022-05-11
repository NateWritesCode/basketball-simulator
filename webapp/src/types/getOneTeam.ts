/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOneTeam
// ====================================================

export interface getOneTeam_getOneTeam {
  __typename: "Team";
  id: number | null;
}

export interface getOneTeam {
  getOneTeam: getOneTeam_getOneTeam | null;
}

export interface getOneTeamVariables {
  abbrev: string;
}
