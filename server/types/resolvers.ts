import { z } from "zod";

export interface Conference {
  abbrev: string;
  divisions?: Division[];
  id: number;
  league: League;
  name: string;
}

export interface Division {
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

export const Team = z.object({
  abbrev: z.string(),
  conferenceId: z.number().optional(),
  divisionId: z.number().optional(),
  facebook: z.string().optional(),
  homeName: z.string(),
  id: z.number(),
  instagram: z.string().optional(),
  lat: z.number(),
  leagueId: z.number().optional(),
  lng: z.number(),
  nickname: z.string(),
  twitter: z.string().optional(),
  venue: z.string(),
  venueCapacity: z.number(),
  yearFounded: z.date(),
});
export type Team = z.infer<typeof Team>;

export const Game = z.object({
  date: z.date(),
  id: z.number(),
  team0Id: z.number(),
  team1Id: z.number(),
});
export type Game = z.infer<typeof Game>;
