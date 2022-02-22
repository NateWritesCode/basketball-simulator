import { GameEvent2FgAttempt, GameEventEnum, IObserver } from "../types";
import fs from "fs";

class GameEventStore implements IObserver {
  filePath: string;
  gameId: number;
  gameType: string;
  neutralFloor: boolean;
  pipeSettings: { [key: string]: any };
  team0: number;
  team1: number;

  constructor({
    gameId,
    gameType,
    neutralFloor,
    team0,
    team1,
  }: {
    gameId: number;
    gameType: string;
    neutralFloor: boolean;
    team0: number;
    team1: number;
  }) {
    this.gameId = gameId;
    this.gameType = gameType;
    this.neutralFloor = neutralFloor;
    this.team0 = team0; //home team if not neutral floor
    this.team1 = team1;
    this.filePath = `./src/data/game-event-store/${gameId}.txt`;
    this.pipeSettings = {
      bonus: {},
      defPlayer1: { getId: true },
      defPlayersOnCourt: { getIdArray: true },
      defTeam: { getId: true },
      gameEvent: {},
      gameId: { alwaysThis: true },
      gameType: { alwaysThis: true },
      neutralFloor: { alwaysThis: true },
      offPlayer1: { getId: true },
      offPlayersOnCourt: { getIdArray: true },
      offTeam: { getId: true },
      segment: {},
      shotType: {},
      shotValue: {},
      team0: { alwaysThis: true },
      team1: { alwaysThis: true },
      turnoverType: {},
      valueToAdd: {},
      x: {},
      y: {},
    };

    //create file
    fs.writeFileSync(this.filePath, "");

    //add headers
    let headerString = "";
    const pipeSettingsKeys = Object.keys(this.pipeSettings);
    pipeSettingsKeys.forEach((pipeSettingKey, i) => {
      let value = "";
      const isLastKey = i + 1 === pipeSettingsKeys.length;

      headerString += `${pipeSettingKey}${isLastKey ? "" : "|"}`;
    });

    fs.appendFileSync(this.filePath, `${headerString}\n`);
  }

  appendToFile = (gameEvent: string, gameEventData: any) => {
    let insertString = "";

    const pipeSettingsKeys = Object.keys(this.pipeSettings);

    pipeSettingsKeys.forEach((pipeSettingKey, i) => {
      let value = "";
      const isLastKey = i + 1 === pipeSettingsKeys.length;
      const { alwaysThis, getId, getIdArray } =
        this.pipeSettings[pipeSettingKey];

      if (alwaysThis) {
        //means this value will always be in the this object
        const self: any = this;
        value = self[pipeSettingKey];
      } else if (pipeSettingKey === "gameEvent") {
        value = gameEvent;
      } else if (gameEventData[pipeSettingKey] !== undefined) {
        if (getId) {
          value = gameEventData[pipeSettingKey]["id"];
        } else if (getIdArray) {
          value = gameEventData[pipeSettingKey].map((v: any) => v.id).join(",");
        } else {
          value = gameEventData[pipeSettingKey];
        }
      }

      insertString += `${value}${isLastKey ? "" : "|"}`;
    });

    fs.appendFileSync(this.filePath, `${insertString}\n`);
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
      case "NON_SHOOTING_DEFENSIVE_FOUL": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "OFFENSIVE_REBOUND": {
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "POSSESSION_ARROW_WON": {
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
      case "TURNOVER": {
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
