import { nonNull, queryField, stringArg } from "nexus";

export const getOneTeam = queryField("getOneTeam", {
  type: "Team",
  args: {
    abbrev: nonNull(stringArg()),
  },
  async resolve(_parent, { abbrev }, { prisma }) {
    try {
      return await prisma.team.findUnique({
        where: {
          abbrev,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },
});
