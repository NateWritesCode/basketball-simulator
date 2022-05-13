import { api } from "@serverless/cloud";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./graphql/resolvers/resolvers";
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
      context: {
        tacos: 1,
      },
      csrfPrevention: true,
      debug: true,
      introspection: true,
      formatError: (err) => {
        console.log("Ut oh, we've got ourselves a GraphQL here: ", err);
        // Don't give the specific errors to the client.
        if (err.message.startsWith("Database Error: ")) {
          return new Error("Internal server error");
        }
        // Otherwise return the original error. The error can also
        // be manipulated in other ways, as long as it's returned.
        return err;
      },
    });
    await server.ensureStarted();

    api.use(server.getMiddleware({ path: "/graphql" }));
  } catch (error) {
    throw new Error(error);
  }
})();
