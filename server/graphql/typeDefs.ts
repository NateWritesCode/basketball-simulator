import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Player {
    familyName: String!
    id: Int!
    givenName: String!
  }

  type Query {
    getOnePlayer(id: Int!): Player
    getServerTime: String
  }

  type Mutation {
    createFoo: Boolean
  }
`;

export { typeDefs };
