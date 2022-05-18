import {} from "apollo-server-express";
import { Context } from "../../types/general";
import { getOnePlayerArgs } from "../../types/resolverArgs";

export const Player = {
  getOnePlayer: (
    parent: undefined,
    args: getOnePlayerArgs,
    context: Context
  ) => {
    console.log("parent", parent);
    console.log("context", context);

    return { id: 1, familyName: "Tom", givenName: "Jones" };
  },
};
