import { PrismaClient } from "@prisma/client";
import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import { schema } from "./schema";
import { log } from "./utils";
import express from "express";

const prisma = new PrismaClient();

export default async () => {
  log.info("Starting server");

  const apolloServerOptions: ApolloServerExpressConfig = {
    context: {
      prisma,
    },
    debug: true,
    introspection: true,
    schema: schema as unknown as GraphQLSchema,
  };

  const apolloServer = new ApolloServer(apolloServerOptions);
  await apolloServer.start();

  const app = express();

  apolloServer.applyMiddleware({
    app,
  });

  const port = 4000;

  await new Promise((resolve: any) => app.listen({ port }, resolve));

  log.info(`Server is ready at http://localhost:${port}`);
};
