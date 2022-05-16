import { gql } from "apollo-server-express";

const typeDefs = gql`
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

  type Query {
    getLeagueStandings(gameGroupId: Int!, leagueId: Int!): LeagueStandings
    getOnePlayer(id: Int!): Player
    getServerTime: String
  }

  type Mutation {
    createFoo: Boolean
    simulate: Boolean
    simulateCleanup: Boolean
    simulatePrep: Boolean
  }
`;

export { typeDefs };
