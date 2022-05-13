import { queryField } from "nexus";

export const getOneTest = queryField("getOneTest", {
  type: "Boolean",
  async resolve(_parent, _args, { prisma }) {
    return true;
  },
});
