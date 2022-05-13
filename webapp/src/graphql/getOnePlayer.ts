import { gql } from "@apollo/client";
import { PLAYER_FRAGMENT } from "./fragments";

console.log("PLAYER_FRAGMENT", PLAYER_FRAGMENT);

export const getOnePlayer = gql`
  query getOnePlayer($id: Int!) {
    getOnePlayer(id: $id) {
      ...playerFull
    }
  }
  ${PLAYER_FRAGMENT}
`;
