import fs from "fs";
import { GameEventEnum } from "../types/enums";
import {
  GameEvent2FgAttempt,
  GameEventBlock,
  GameEvent2FgMade,
  GameEvent2FgMadeFoul,
  GameEvent2FgMiss,
  GameEvent2FgMissFoul,
  GameEvent3FgAttempt,
  GameEvent3FgMade,
  GameEvent3FgMadeFoul,
  GameEvent3FgMiss,
  GameEvent3FgMissFoul,
  GameEventReboundDefensive,
  GameEventEjection,
  GameEventFoulNonShootingDefensive,
  GameEventFoulOffensive,
  GameEventFoulTechnical,
  GameEventFreeThrow,
  GameEventJumpBall,
  GameEventReboundOffensive,
  GameEventPossessionArrow,
  GameEventSegment,
  GameEventStartingLineup,
  GameEventSteal,
  GameEventSubstitution,
  GameEventTimeout,
  GameEventTurnover,
  GameEventViolation,
} from "../types/gameEvents";
import { IObserver } from "../types/general";
import { storage } from "@serverless/cloud";

class GameEventStore implements IObserver {
  [key: string]: any;
  appendString: string;
  asyncOperations: any[];
  awayTeam: number | string;
  eventIdIterator: number;
  gameId: number;
  gameType: string;
  homeTeam: number | string;
  pipeSettings: { [key: string]: any };
  team0: number;
  team1: number;

  constructor({
    asyncOperations,
    gameId,
    gameType,
    isNeutralFloor,
    team0,
    team1,
  }: {
    asyncOperations: any[];
    gameId: number;
    gameType: string;
    isNeutralFloor: boolean;
    team0: number;
    team1: number;
  }) {
    // always this means the field will always be there
    this.appendString = "";
    this.asyncOperations = asyncOperations;
    this.awayTeam = isNeutralFloor ? "" : team1;
    this.eventIdIterator = 1;
    this.gameId = gameId;
    this.gameType = gameType;
    this.homeTeam = isNeutralFloor ? "" : team0;
    this.team0 = team0; //home team if not neutral floor
    this.team1 = team1;
    this.pipeSettings = {
      awayTeam: {},
      bool0: { getBool: true },
      bool1: { getBool: true },
      defPlayersOnCourt: { getIdArray: true },
      defTeam: { getId: true },
      float0: {},
      gameEvent: {},
      gameId: {},
      gameType: {},
      homeTeam: {},
      id: { isId: true },
      int0: {},
      int1: {},
      int2: {},
      offPlayersOnCourt: { getIdArray: true },
      offTeam: { getId: true },
      player0: { getId: true },
      player1: { getId: true },
      player2: { getId: true },
      possessionLength: {},
      segment: {},
      team0: { getId: true },
      team1: { getId: true },
      text0: {},
    };

    //add headers
    // let headerString = "";
    const pipeSettingsKeys = Object.keys(this.pipeSettings);
    pipeSettingsKeys.forEach((pipeSettingKey, i) => {
      const isLastKey = i + 1 === pipeSettingsKeys.length;

      const value = pipeSettingKey;

      this.appendString += `${value}${isLastKey ? "" : "|"}`;
    });
  }

  appendToString = (gameEvent: GameEventEnum, gameEventData: any) => {
    const appendObj = this.getAppendObj(gameEvent, gameEventData);
    const pipeSettingsKeys = Object.keys(this.pipeSettings);
    // let appendString = "";
    pipeSettingsKeys.forEach((pipeSettingKey, i) => {
      let value = "";
      const isLastKey = i + 1 === pipeSettingsKeys.length;

      const { getBool, getId, getIdArray, isId } =
        this.pipeSettings[pipeSettingKey];

      if (isId) {
        value = `${this.gameId}-${this.eventIdIterator}`;
      } else if (appendObj[pipeSettingKey] !== undefined) {
        if (getId) {
          if (appendObj[pipeSettingKey]) {
            value = appendObj[pipeSettingKey]["id"];
          }
        } else if (getIdArray) {
          value = appendObj[pipeSettingKey].map((v: any) => v.id).join(",");
        } else if (getBool) {
          value = appendObj[pipeSettingKey];
        } else {
          value = appendObj[pipeSettingKey];
        }
      }

      this.appendString += `${value}${isLastKey ? "" : "|"}`;
    });

    // fs.appendFileSync(this.filePath, `${appendString}\n`);
    this.eventIdIterator++;
  };

  getAppendObj = (gameEvent: GameEventEnum, gameEventData: any) => {
    const appendObj: any = {
      //mandatory below
      awayTeam: this["awayTeam"],
      defPlayersOnCourt: gameEventData["defPlayersOnCourt"],
      defTeam: gameEventData["defTeam"],
      gameEvent,
      gameId: this["gameId"],
      gameType: this["gameType"],
      homeTeam: this["homeTeam"],
      offPlayersOnCourt: gameEventData["offPlayersOnCourt"],
      offTeam: gameEventData["offTeam"],
      segment: gameEventData["segment"],
      //optional below
      possessionLength: gameEventData["possessionLength"]
        ? gameEventData["possessionLength"]
        : "",
    };

    switch (gameEvent) {
      case "2FG_ATTEMPT": {
        const { offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent2FgAttempt;
        appendObj.player0 = offPlayer0;
        appendObj.text1 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;
        break;
      }
      case "2FG_BLOCK": {
        const { offPlayer0, shotType, shotValue, defPlayer0, x, y } =
          gameEventData as GameEventBlock;
        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;
        break;
      }
      case "2FG_MADE": {
        const { offPlayer0, shotType, shotValue, offPlayer1, x, y } =
          gameEventData as GameEvent2FgMade;

        appendObj.player0 = offPlayer0;
        appendObj.player1 = offPlayer1;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;

        break;
      }
      case "2FG_MADE_FOUL": {
        const {
          defPlayer0,
          offPlayer0,
          shotType,
          shotValue,
          offPlayer1,
          x,
          y,
        } = gameEventData as GameEvent2FgMadeFoul;

        appendObj.player0 = offPlayer0; //shooter
        appendObj.player1 = defPlayer0; //fouler
        appendObj.player2 = offPlayer1; //assister
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;

        break;
      }
      case "2FG_MISS": {
        const { offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent2FgMiss;

        appendObj.player0 = offPlayer0;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;

        break;
      }
      case "2FG_MISS_FOUL": {
        const { defPlayer0, offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent2FgMissFoul;

        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;

        break;
      }
      case "3FG_ATTEMPT": {
        const { offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent3FgAttempt;
        appendObj.player0 = offPlayer0;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;
        break;
      }
      case "3FG_BLOCK": {
        const { offPlayer0, shotType, shotValue, defPlayer0, x, y } =
          gameEventData as GameEventBlock;
        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;
        break;
      }
      case "3FG_MADE": {
        const { offPlayer0, shotType, shotValue, offPlayer1, x, y } =
          gameEventData as GameEvent3FgMade;

        appendObj.player0 = offPlayer0;
        appendObj.player1 = offPlayer1;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;
        break;
      }
      case "3FG_MADE_FOUL": {
        const {
          defPlayer0,
          offPlayer0,
          shotType,
          shotValue,
          offPlayer1,
          x,
          y,
        } = gameEventData as GameEvent3FgMadeFoul;

        appendObj.player0 = offPlayer0; //shooter
        appendObj.player1 = defPlayer0; //fouler
        appendObj.player2 = offPlayer1; //assister
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;
        break;
      }
      case "3FG_MISS": {
        const { offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent3FgMiss;

        appendObj.player0 = offPlayer0;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;
        break;
      }
      case "3FG_MISS_FOUL": {
        const { defPlayer0, offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent3FgMissFoul;

        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;
        appendObj.text0 = shotType;
        appendObj.int0 = shotValue;
        appendObj.int1 = x;
        appendObj.int2 = y;
        break;
      }
      case "DEFENSIVE_REBOUND": {
        const { defPlayer0 } = gameEventData as GameEventReboundDefensive;
        if (defPlayer0) {
          appendObj.player0 = defPlayer0;
        }

        break;
      }
      case "EJECTION": {
        const { ejectionReason, player0 } = gameEventData as GameEventEjection;

        appendObj.player0 = player0;
        appendObj.text0 = ejectionReason;

        break;
      }
      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        const { foulType, offPlayer0, defPlayer0 } =
          gameEventData as GameEventFoulNonShootingDefensive;

        appendObj.text0 = foulType;
        appendObj.player0 = defPlayer0;
        appendObj.player1 = offPlayer0;

        break;
      }
      case "FOUL_OFFENSIVE": {
        const { offPlayer0, defPlayer0, isCharge } =
          gameEventData as GameEventFoulOffensive;

        appendObj.bool0 = isCharge;
        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;

        break;
      }
      case "FOUL_TECHNICAL": {
        const { player0, player1, technicalReason } =
          gameEventData as GameEventFoulTechnical;

        appendObj.player0 = player0;
        appendObj.text0 = technicalReason;

        if (player1) {
          appendObj.player1 = player1;
        }

        break;
      }
      case "FREE_THROW": {
        const {
          isBonus,
          isMade,
          offPlayer0,
          shotNumber,
          shotValue,
          totalShots,
        } = gameEventData as GameEventFreeThrow;

        appendObj.bool0 = isBonus;
        appendObj.bool1 = isMade;
        appendObj.player0 = offPlayer0;
        appendObj.int0 = shotValue;
        appendObj.int1 = shotNumber;
        appendObj.int2 = totalShots;

        break;
      }
      case "GAME_END": {
        this.asyncOperations.push(async () => {
          try {
            await storage.write(
              `/data/game-events/${this.gameId}.txt`,
              this.appendString
            );
          } catch (error) {
            throw new Error(error);
          }
        });
        break;
      }
      case "GAME_START": {
        break;
      }
      case "JUMP_BALL": {
        const { defPlayer0, offPlayer0, isStartSegmentTip } =
          gameEventData as GameEventJumpBall;

        appendObj.bool0 = isStartSegmentTip;
        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;

        break;
      }
      case "OFFENSIVE_REBOUND": {
        const { offPlayer0 } = gameEventData as GameEventReboundOffensive;

        if (offPlayer0) {
          appendObj.player0 = offPlayer0;
        }

        break;
      }
      case "POSSESSION_ARROW": {
        const {} = gameEventData as GameEventPossessionArrow;

        break;
      }
      case "SEGMENT_START": {
        const {} = gameEventData as GameEventSegment;
        break;
      }
      case "SEGMENT_END": {
        const {} = gameEventData as GameEventSegment;
        break;
      }
      case "STARTING_LINEUP": {
        const {} = gameEventData as GameEventStartingLineup;
        break;
      }
      case "STEAL": {
        const { defPlayer0, offPlayer0 } = gameEventData as GameEventSteal;

        appendObj.player0 = defPlayer0;
        appendObj.player1 = offPlayer0;

        break;
      }
      case "SUBSTITUTION": {
        const { incomingPlayer, outgoingPlayer, isPlayerFouledOut } =
          gameEventData as GameEventSubstitution;

        appendObj.player0 = incomingPlayer;
        appendObj.player1 = outgoingPlayer;
        appendObj.bool0 = isPlayerFouledOut;

        break;
      }
      case "TIMEOUT": {
        const { reason, team0 } = gameEventData as GameEventTimeout;

        appendObj.team0 = team0;
        appendObj.text0 = reason;

        break;
      }
      case "TURNOVER": {
        const { offPlayer0, turnoverType } = gameEventData as GameEventTurnover;

        appendObj.player0 = offPlayer0;
        appendObj.text0 = turnoverType;

        break;
      }
      case "VIOLATION": {
        const { violationType } = gameEventData as GameEventViolation;

        appendObj.text0 = violationType;

        break;
      }
      default:
        const exhaustiveCheck: never = gameEvent;
        throw new Error(exhaustiveCheck);
    }

    return appendObj;
  };

  notifyGameEvent(gameEvent: GameEventEnum, gameEventData: object): void {
    switch (gameEvent) {
      case "2FG_ATTEMPT": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "2FG_BLOCK": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "2FG_MADE": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "2FG_MADE_FOUL": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "2FG_MISS": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "2FG_MISS_FOUL": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "3FG_ATTEMPT": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "3FG_BLOCK": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "3FG_MADE": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "3FG_MADE_FOUL": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "3FG_MISS": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "3FG_MISS_FOUL": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "DEFENSIVE_REBOUND": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "EJECTION": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "FOUL_TECHNICAL": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "FREE_THROW": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "GAME_END": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "GAME_START": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "JUMP_BALL": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "FOUL_OFFENSIVE": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "OFFENSIVE_REBOUND": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "POSSESSION_ARROW": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "SEGMENT_START": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "SEGMENT_END": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "STARTING_LINEUP": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "STEAL": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "SUBSTITUTION": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "TIMEOUT": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "TURNOVER": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      case "VIOLATION": {
        this.appendToString(gameEvent, gameEventData);
        break;
      }
      default:
        const exhaustiveCheck: never = gameEvent;
        throw new Error(exhaustiveCheck);
    }
  }
}

export { GameEventStore };
