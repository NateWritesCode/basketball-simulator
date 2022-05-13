import { gql } from "@apollo/client";

export const getServerTime = gql`
  query getServerTime {
    getServerTime
  }
`;
