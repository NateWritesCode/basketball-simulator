import {} from "apollo-server-express";
import { Context } from "../../types/general";
import { QueryResolvers } from "../../types/resolverTypes";

type PlayerResolvers = {
  getOnePlayer: QueryResolvers["getOnePlayer"];
};

export const Player: PlayerResolvers = {
  getOnePlayer: (parent, { id }, { csvDb }) => {
    return null;
  },
};
