import { z } from "zod";

export const getOnePlayerArgs = z.object({
  id: z.number(),
  test: z.string(),
});
export type getOnePlayerArgs = z.infer<typeof getOnePlayerArgs>;
