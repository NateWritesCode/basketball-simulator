import {} from "apollo-server-express";
import { Context, getOnePlayerArgs } from "../../../types";

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
