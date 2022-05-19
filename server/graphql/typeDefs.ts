import { gql } from "apollo-server-express";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";

const typeDefs = gql`
  ${scalarTypeDefs}
  type Conference {
    abbrev: String!
    divisions: [Division!]
    id: Int!
    league: League!
    name: String!
  }

  type Division {
    abbrev: String!
    conference: Conference
    id: Int!
    league: League!
    name: String!
  }

  type League {
    abbrev: String!
    conferences: [Conference!]
    divisions: [Division!]
    id: Int!
    name: String!
  }

  type Player {
    familyName: String!
    givenName: String!
    id: Int!
  }

  type LeagueStandings {
    league: League!
    teams: [StandingsTeam!]!
  }

  type StandingsTeam {
    abbrev: String!
    conferenceId: Int
    divisionId: Int
    homeName: String!
    id: Int!
    leagueId: Int!
    l: Int!
    nickname: String!
    w: Int!
  }

  type Team {
    abbrev: String!
    conferenceId: Int
    divisionId: Int
    facebook: String
    homeName: String!
    id: Int!
    instagram: String
    lat: Float!
    leagueId: Int
    lng: Float!
    nickname: String!
    twitter: String
    venue: String!
    venueCapacity: Int!
    yearFounded: DateTime!
  }

  type Query {
    getLeagueStandings(gameGroupId: Int!, leagueId: Int!): LeagueStandings
    getOnePlayer(id: Int!): Player
    getServerTime: String
  }

  type Mutation {
    createFoo: Boolean
    sandbox: Boolean
    simulate: Boolean
    simulateCleanup: Boolean
    simulatePrep: Boolean
  }
`;

export { typeDefs };
