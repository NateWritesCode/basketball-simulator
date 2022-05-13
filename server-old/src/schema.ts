import { makeSchema } from "nexus";
import NexusPrismaScalars from "nexus-prisma/scalars";
import * as allTypes from "./resolvers";

export const schema = makeSchema({
  types: [allTypes, NexusPrismaScalars],
  outputs: {
    schema: __dirname + "/../graphql/schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  contextType: {
    module: require.resolve("./types"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
