import { nonNull, queryField, stringArg } from "nexus";

export const getOnePlayer = queryField("getOnePlayer", {
  type: "Player",
  args: {
    slug: nonNull(stringArg()),
  },
  async resolve(_parent, { slug }, { prisma }) {
    try {
      return await prisma.player.findUnique({
        where: {
          slug,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },
});
