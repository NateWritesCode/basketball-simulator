/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: startGameSim
// ====================================================

export interface startGameSim_startGameSim_playerStats {
  __typename: "SimResultPlayer";
  andOne: number;
  ast: number;
  blk: number;
  blkd: number;
  drb: number;
  dunks: number;
  fatigue: number;
  fga: number;
  fgm: number;
  fta: number;
  ftm: number;
  fouls: number;
  foulsOffensive: number;
  foulsShooting: number;
  heaves: number;
  id: number;
  name: string;
  inspiration: number;
  jumpBallsLost: number;
  jumpBallsWon: number;
  offensiveFoul: number;
  offensiveFoulCharge: number;
  offensiveFoulOther: number;
  orb: number;
  pga: number;
  plusMinus: number;
  position: string;
  pts: number;
  secondsPlayed: number;
  slug: string;
  starter: boolean;
  stl: number;
  timePlayed: number;
  tov: number;
  tpa: number;
  tpm: number;
}

export interface startGameSim_startGameSim_teams_players {
  __typename: "Player";
  id: number;
}

export interface startGameSim_startGameSim_teams {
  __typename: "Team";
  abbrev: string | null;
  facebook: string | null;
  homeName: string | null;
  id: number | null;
  instagram: string | null;
  nickname: string | null;
  players: startGameSim_startGameSim_teams_players[] | null;
  twitter: string | null;
  venue: string | null;
  venueCapacity: number | null;
  yearFounded: any | null;
}

export interface startGameSim_startGameSim_teamStats {
  __typename: "SimResultTeam";
  andOne: number;
  ast: number;
  blk: number;
  blkd: number;
  drb: number;
  dunks: number;
  fga: number;
  fgm: number;
  fouls: number;
  foulsOffensive: number;
  foulsShooting: number;
  fta: number;
  ftm: number;
  heaves: number;
  id: number;
  jumpBallsLost: number;
  jumpBallsWon: number;
  name: string;
  offensiveFoul: number;
  offensiveFoulCharge: number;
  offensiveFoulOther: number;
  orb: number;
  pf: number;
  pga: number;
  pts: number;
  stl: number;
  teamDrb: number;
  teamOrb: number;
  timeouts: number;
  tov: number;
  tpa: number;
  tpm: number;
}

export interface startGameSim_startGameSim {
  __typename: "SimResult";
  playerStats: ((startGameSim_startGameSim_playerStats | null)[] | null)[];
  teams: (startGameSim_startGameSim_teams | null)[];
  teamStats: startGameSim_startGameSim_teamStats[];
}

export interface startGameSim {
  startGameSim: startGameSim_startGameSim | null;
}
