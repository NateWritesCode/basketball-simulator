import { GameEventEnum, IObserver } from "../types";
import fs from "fs";
import { getMappedKey } from "../utils";

class GameEventStore implements IObserver {
  eventIdIterator: number;
  filePath: string;
  gameId: number;
  gameType: string;
  isNeutralFloor: boolean;
  pipeSettings: { [key: string]: any };
  team0: number;
  team1: number;

  constructor({
    gameId,
    gameType,
    isNeutralFloor,
    team0,
    team1,
  }: {
    gameId: number;
    gameType: string;
    isNeutralFloor: boolean;
    team0: number;
    team1: number;
  }) {
    // always this means the field will always be there
    this.eventIdIterator = 1;
    this.gameId = gameId;
    this.gameType = gameType;
    this.isNeutralFloor = isNeutralFloor;
    this.team0 = team0; //home team if not neutral floor
    this.team1 = team1;
    this.filePath = `./src/data/game-events/${gameId}.txt`;
    this.pipeSettings = {
      defPlayer1: { getId: true },
      defPlayer2: { getId: true },
      defPlayersOnCourt: { getIdArray: true },
      defTeam: { getId: true },
      gameEvent: {},
      gameId: { alwaysThis: true },
      gameType: { alwaysThis: true },
      id: { isId: true },
      incomingPlayer: { getId: true },
      isBonus: {},
      isCharge: {},
      isNeutralFloor: { alwaysThis: true },
      isPlayerFouledOut: {},
      offPlayer1: { getId: true },
      offPlayer2: { getId: true },
      offPlayersOnCourt: { getIdArray: true },
      offTeam: { getId: true },
      outgoingPlayer: { getId: true },
      possessionLength: {},
      segment: {},
      shotType: {},
      shotValue: {},
      team0: { alwaysThis: true },
      team1: { alwaysThis: true },
      turnoverType: {},
      valueToAdd: {},
      violationType: {},
      x: {},
      y: {},
    };

    //create file
    fs.writeFileSync(this.filePath, "");

    //add headers
    let headerString = "";
    const pipeSettingsKeys = Object.keys(this.pipeSettings);
    pipeSettingsKeys.forEach((pipeSettingKey, i) => {
      const isLastKey = i + 1 === pipeSettingsKeys.length;

      const value = pipeSettingKey;

      // const value = getMappedKey({
      //   mappedKeyType: "gameEvent",
      //   textTypeToGet: "snake",
      //   value: pipeSettingKey,
      // });

      headerString += `${value}${isLastKey ? "" : "|"}`;
    });

    fs.appendFileSync(this.filePath, `${headerString}\n`);
  }

  appendToFile = (gameEvent: string, gameEventData: any) => {
    let insertString = "";

    const pipeSettingsKeys = Object.keys(this.pipeSettings);

    pipeSettingsKeys.forEach((pipeSettingKey, i) => {
      let value = "";
      const isLastKey = i + 1 === pipeSettingsKeys.length;
      const { alwaysThis, getId, getIdArray, isId } =
        this.pipeSettings[pipeSettingKey];

      if (alwaysThis) {
        //means this value will always be in the this object
        const self: any = this;
        value = self[pipeSettingKey];
      } else if (pipeSettingKey === "gameEvent") {
        value = gameEvent;
      } else if (isId) {
        value = `${this.gameId}-${this.eventIdIterator}`;
      } else if (gameEventData[pipeSettingKey] !== undefined) {
        if (getId) {
          if (gameEventData[pipeSettingKey]) {
            value = gameEventData[pipeSettingKey]["id"];
          }
        } else if (getIdArray) {
          value = gameEventData[pipeSettingKey].map((v: any) => v.id).join(",");
        } else {
          value = gameEventData[pipeSettingKey];
        }
      }

      insertString += `${value}${isLastKey ? "" : "|"}`;
    });

    fs.appendFileSync(this.filePath, `${insertString}\n`);
    this.eventIdIterator++;
  };

  notifyGameEvent(gameEvent: GameEventEnum, gameEventData: object): void {
    switch (gameEvent) {
      case "2FG_ATTEMPT": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "2FG_BLOCK": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "2FG_MADE": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "2FG_MADE_FOUL": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "2FG_MISS": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "2FG_MISS_FOUL": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "3FG_ATTEMPT": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "3FG_BLOCK": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "3FG_MADE": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "3FG_MADE_FOUL": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "3FG_MISS": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "3FG_MISS_FOUL": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "DEFENSIVE_REBOUND": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "EJECTION": {
        break;
      }
      case "FOUL_TECHNICAL": {
        break;
      }
      case "FREE_THROW": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "GAME_END": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "GAME_START": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "JUMP_BALL": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "FOUL_OFFENSIVE": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "OFFENSIVE_REBOUND": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "POSSESSION_ARROW": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "SEGMENT_START": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "SEGMENT_END": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "STARTING_LINEUP": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "STEAL": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "SUBSTITUTION": {
        break;
      }
      case "TIMEOUT": {
        break;
      }
      case "TURNOVER": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "VIOLATION": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      default:
        const exhaustiveCheck: never = gameEvent;
        throw new Error(exhaustiveCheck);
    }
  }
}

export default GameEventStore;
