import { invertObj } from "ramda";

export default ({
  mappedKeyType,
  textTypeToGet,
  value,
}: {
  mappedKeyType: "gameEvent";
  textTypeToGet: "camelCase" | "snake";
  value: string;
}): string => {
  switch (mappedKeyType) {
    case "gameEvent": {
      let keyObj: any = {
        defPlayer1: "def_player_1",
        defPlayer2: "def_player2",
        defPlayersOnCourt: "def_players_on_court",
        defTeam: "def_team",
        gameEvent: "game_event",
        gameId: "game_id",
        gameType: "game_type",
        incomingPlayer: "incoming_player",
        isCharge: "is_charge",
        isNeutralFloor: "is_neutral_floor",
        isPlayerFouledOut: "is_player_fouled_out",
        offPlayer1: "off_player_1",
        offPlayer2: "off_player2",
        offPlayersOnCourt: "off_players_on_court",
        offTeam: "off_team",
        outgoingPlayer: "outgoing_player",
        possessionLength: "possession_length",
        shotType: "shot_type",
        shotValue: "shot_value",
        team0: "team_0",
        team1: "team_1",
        turnoverType: "turnover_type",
        violationType: "violation_type",
      };

      if (textTypeToGet === "camelCase") {
        keyObj = invertObj(keyObj);
      }

      if (keyObj[value]) {
        return keyObj[value];
      } else {
        return value;
      }
    }
    default:
      const exhaustiveCheck: never = mappedKeyType;
      throw new Error(exhaustiveCheck);
  }
};
