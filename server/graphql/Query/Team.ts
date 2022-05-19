import { Context } from "../../types/general";
import { getOneTeamArgs } from "../../types/resolverArgs";

export const Test = {
  getOneTeamInfo: (
    _parent: undefined,
    { abbrev }: getOneTeamArgs,
    { csvDb }: Context
  ): string | null => {
    return new Date().toISOString();
  },
};
