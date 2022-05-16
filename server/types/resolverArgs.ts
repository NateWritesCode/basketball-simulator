import { z } from "zod";

export const getOnePlayerArgs = z.object({
  id: z.number(),
});
export type getOnePlayerArgs = z.infer<typeof getOnePlayerArgs>;

export const getLeagueStandings = z.object({
  gameGroupId: z.number(),
  leagueId: z.number(),
});
export type getLeagueStandings = z.infer<typeof getLeagueStandings>;
