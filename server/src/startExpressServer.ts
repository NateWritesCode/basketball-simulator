import { PrismaClient } from "@prisma/client";
import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import { schema } from "./schema";
import { log } from "./utils";
import express from "express";
import * as http from "http";
import Socket from "./Socket";
import cors from "cors";
import PrestoClient from "./PrestoClient";
import CubeJsServer from "@cubejs-backend/server";
import PostgresDriver from "@cubejs-backend/postgres-driver";
import PrestoDriver from "@cubejs-backend/prestodb-driver";
import { csvDbClient } from "./csvDbClient";
import * as dataForge from "data-forge";
import "data-forge-fs";

export const prisma = new PrismaClient();
const presto = new PrestoClient();

export default async () => {
  log.info("Starting server");
  const app = express();
  const httpServer = http.createServer(app);
  const socket = new Socket(httpServer);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const corsOptions = {
    origin: "http://localhost:3000",
  };

  app.use(cors(corsOptions));

  const context = {
    csvDbClient,
    dataForge,
    presto,
    prisma,
    socket,
  };

  const apolloServerOptions: ApolloServerExpressConfig = {
    context,
    debug: true,
    introspection: true,
    schema: schema as unknown as GraphQLSchema,
    formatError: (err) => {
      console.log("err", err);
      // Don't give the specific errors to the client.
      if (err.message.startsWith("Database Error: ")) {
        return new Error("Internal server error");
      }
      // Otherwise return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return err;
    },
  };

  const apolloServer = new ApolloServer(apolloServerOptions);
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
  });

  const port = 8081;

  const cubeJsServer = new CubeJsServer({
    apiSecret: "fc2911c496191214d4fba81f32b1a4d9",
    dbType: ({ dataSource }) => {
      return "postgres";
      // if (dataSource === "analytics") {
      //   return "prestodb";
      // } else {
      //   return "postgres";
      // }
    },
    driverFactory: ({ dataSource }) => {
      return new PostgresDriver({
        database: "postgres",
        host: "localhost",
        user: "admin",
        password: "helloworld",
        port: 5432,
      });

      // if (dataSource === "analytics") {
      //   return new PrestoDriver({
      //     host: "localhost",
      //     port: 8080,
      //     catalog: "hive",
      //     user: "root",
      //     schema: "default",
      //   });
      // } else {
      //   return new PostgresDriver({
      //     database: "postgres",
      //     host: "localhost",
      //     user: "admin",
      //     password: "helloworld",
      //     port: 5432,
      //   });
      // }
    },
    scheduledRefreshTimer: false,
  });

  await cubeJsServer.listen();

  httpServer.listen(
    {
      port,
    },
    () =>
      log.info(
        `Server is ready at http://localhost:${port}${apolloServer.graphqlPath}`
      )
  );

  return prisma;
};
