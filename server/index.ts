import { api } from "@serverless/cloud";
import { ApolloServer } from "apollo-server-express";
import { createContext } from "./graphql/createContext";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";

class ServerlessCloudApollo extends ApolloServer {
  serverlessFramework() {
    return true;
  }

  async ensureStarted() {
    await super.ensureStarted();
  }
}

(async () => {
  try {
    const server = new ServerlessCloudApollo({
      typeDefs,
      resolvers,
      context: createContext(),
      csrfPrevention: true,
      debug: true,
      introspection: true,
      formatError: (error) => {
        console.log("Ut oh, we've got ourselves a GraphQL here");
        console.log(JSON.stringify(error, null, 4));

        // Don't give the specific errors to the client.
        if (error.message.startsWith("Database Error: ")) {
          return new Error("Internal server error");
        }
        // Otherwise return the original error. The error can also
        // be manipulated in other ways, as long as it's returned.
        return error;
      },
    });

    if (server) {
      await server.ensureStarted();
      api.use(server.getMiddleware({ path: "/graphql" }));
    } else {
      throw new Error("We don't have a server");
    }
  } catch (error: any) {
    throw new Error(error);
  }
})();
