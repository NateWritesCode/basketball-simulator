import { mutationField } from "nexus";

export const createOneTest = mutationField("createOneTest", {
  type: "Boolean",
  async resolve(_parent, _args, { prisma }) {
    return true;
  },
});
