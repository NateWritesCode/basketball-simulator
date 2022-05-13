import { gql } from "@apollo/client";

export const playerFragment = gql`
  fragment playerFull on Player {
    familyName
    givenName
    id
  }
`;
