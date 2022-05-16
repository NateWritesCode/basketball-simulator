interface Conference {
  abbrev: string;
  divisions?: Division[];
  id: number;
  league: League;
  name: string;
}

interface Division {
  abbrev: string;
  conference?: Conference;
  id: number;
  league: League;
  name: string;
}

interface League {
  abbrev: string;
  id: number;
  conferences?: Conference[];
  divisions?: Division[];
  name: string;
}

export interface LeagueStandings {
  league: League;
  teams: StandingsTeam[];
}

interface StandingsTeam {
  abbrev: string;
  conferenceId?: number;
  divisionId?: number;
  homeName: string;
  id: number;
  leagueId: number;
  l: number;
  nickname: string;
  w: number;
}
