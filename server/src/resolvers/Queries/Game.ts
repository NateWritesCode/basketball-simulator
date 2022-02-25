import { queryField } from "nexus";

export const getOneGame = queryField("getOneGame", {
  type: "Game",
  async resolve(_parent, _args, { prisma }) {
    return null;
  },
});
