/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: startGameSim
// ====================================================

export interface startGameSim_startGameSim_team0_players {
  __typename: "Player";
  id: number;
}

export interface startGameSim_startGameSim_team0 {
  __typename: "Team";
  abbrev: string;
  facebook: string;
  homeName: string;
  id: number;
  instagram: string;
  nickname: string;
  players: startGameSim_startGameSim_team0_players[];
  twitter: string;
  venue: string;
  venueCapacity: number;
  yearFounded: any;
}

export interface startGameSim_startGameSim_team0PlayerStats {
  __typename: "SimResultPlayer";
  andOne: number | null;
  ast: number | null;
  blk: number | null;
  blkd: number | null;
  drb: number | null;
  dunks: number | null;
  fatigue: number | null;
  fga: number | null;
  fgm: number | null;
  fta: number | null;
  ftm: number | null;
  fouls: number | null;
  foulsOffensive: number | null;
  foulsShooting: number | null;
  heaves: number | null;
  id: number | null;
  name: string | null;
  inspiration: number | null;
  jumpBallsLost: number | null;
  jumpBallsWon: number | null;
  offensiveFoul: number | null;
  offensiveFoulCharge: number | null;
  offensiveFoulNonCharge: number | null;
  orb: number | null;
  pga: number | null;
  plusMinus: number | null;
  pts: number | null;
  secondsPlayed: number | null;
  starter: boolean | null;
  stl: number | null;
  tov: number | null;
  tpa: number | null;
  tpm: number | null;
}

export interface startGameSim_startGameSim_team0Stats {
  __typename: "SimResultTeam";
  andOne: number | null;
  ast: number | null;
  blk: number | null;
  blkd: number | null;
  drb: number | null;
  dunks: number | null;
  fga: number | null;
  fgm: number | null;
  fouls: number | null;
  foulsOffensive: number | null;
  foulsShooting: number | null;
  foulsBySegment: (number | null)[] | null;
  fta: number | null;
  ftm: number | null;
  heaves: number | null;
  id: number | null;
  jumpBallsLost: number | null;
  jumpBallsWon: number | null;
  name: string | null;
  offensiveFoul: number | null;
  offensiveFoulCharge: number | null;
  offensiveFoulNonCharge: number | null;
  orb: number | null;
  pf: number | null;
  pga: number | null;
  pts: number | null;
  stl: number | null;
  teamDrb: number | null;
  teamOrb: number | null;
  timeouts: number | null;
  tov: number | null;
  tpa: number | null;
  tpm: number | null;
}

export interface startGameSim_startGameSim_team1_players {
  __typename: "Player";
  id: number;
}

export interface startGameSim_startGameSim_team1 {
  __typename: "Team";
  abbrev: string;
  facebook: string;
  homeName: string;
  id: number;
  instagram: string;
  nickname: string;
  players: startGameSim_startGameSim_team1_players[];
  twitter: string;
  venue: string;
  venueCapacity: number;
  yearFounded: any;
}

export interface startGameSim_startGameSim_team1PlayerStats {
  __typename: "SimResultPlayer";
  andOne: number | null;
  ast: number | null;
  blk: number | null;
  blkd: number | null;
  drb: number | null;
  dunks: number | null;
  fatigue: number | null;
  fga: number | null;
  fgm: number | null;
  fta: number | null;
  ftm: number | null;
  fouls: number | null;
  foulsOffensive: number | null;
  foulsShooting: number | null;
  heaves: number | null;
  id: number | null;
  name: string | null;
  inspiration: number | null;
  jumpBallsLost: number | null;
  jumpBallsWon: number | null;
  offensiveFoul: number | null;
  offensiveFoulCharge: number | null;
  offensiveFoulNonCharge: number | null;
  orb: number | null;
  pga: number | null;
  plusMinus: number | null;
  pts: number | null;
  secondsPlayed: number | null;
  starter: boolean | null;
  stl: number | null;
  tov: number | null;
  tpa: number | null;
  tpm: number | null;
}

export interface startGameSim_startGameSim_team1Stats {
  __typename: "SimResultTeam";
  andOne: number | null;
  ast: number | null;
  blk: number | null;
  blkd: number | null;
  drb: number | null;
  dunks: number | null;
  fga: number | null;
  fgm: number | null;
  fouls: number | null;
  foulsOffensive: number | null;
  foulsShooting: number | null;
  foulsBySegment: (number | null)[] | null;
  fta: number | null;
  ftm: number | null;
  heaves: number | null;
  id: number | null;
  jumpBallsLost: number | null;
  jumpBallsWon: number | null;
  name: string | null;
  offensiveFoul: number | null;
  offensiveFoulCharge: number | null;
  offensiveFoulNonCharge: number | null;
  orb: number | null;
  pf: number | null;
  pga: number | null;
  pts: number | null;
  stl: number | null;
  teamDrb: number | null;
  teamOrb: number | null;
  timeouts: number | null;
  tov: number | null;
  tpa: number | null;
  tpm: number | null;
}

export interface startGameSim_startGameSim {
  __typename: "SimResult";
  team0: startGameSim_startGameSim_team0 | null;
  team0PlayerStats: (startGameSim_startGameSim_team0PlayerStats | null)[] | null;
  team0Stats: startGameSim_startGameSim_team0Stats | null;
  team1: startGameSim_startGameSim_team1 | null;
  team1PlayerStats: (startGameSim_startGameSim_team1PlayerStats | null)[] | null;
  team1Stats: startGameSim_startGameSim_team1Stats | null;
}

export interface startGameSim {
  startGameSim: startGameSim_startGameSim | null;
}
