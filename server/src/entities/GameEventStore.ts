import {
  GameEvent2FgAttempt,
  GameEvent2FgMade,
  GameEvent2FgMadeFoul,
  GameEvent2FgMiss,
  GameEvent2FgMissFoul,
  GameEvent3FgAttempt,
  GameEvent3FgMade,
  GameEvent3FgMadeFoul,
  GameEvent3FgMiss,
  GameEvent3FgMissFoul,
  GameEventBlock,
  GameEventEjection,
  GameEventEnum,
  GameEventFoulNonShootingDefensive,
  GameEventFoulOffensive,
  GameEventFoulTechnical,
  GameEventFreeThrow,
  GameEventJumpBall,
  GameEventPossessionArrow,
  GameEventReboundDefensive,
  GameEventReboundOffensive,
  GameEventSegment,
  GameEventStartingLineup,
  GameEventSteal,
  GameEventSubstitution,
  GameEventTimeout,
  GameEventTurnover,
  GameEventViolation,
  IObserver,
} from "../types";
import fs from "fs";

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
      bool0: {},
      bool1: {},
      defPlayersOnCourt: {},
      defTeam: {},
      gameEvent: {},
      gameType: {},
      offPlayersOnCourt: {},
      offTeam: {},
      player0: {},
      player1: {},
      player2: {},
      possessionLength: {},
      segment: {},
      team0: {},
      team1: {},
      text0: {},
      value0: {},
      value1: {},
      value2: {},
      // defPlayer1: { getId: true },
      // defPlayer2: { getId: true },
      // defPlayersOnCourt: { getIdArray: true },
      // defTeam: { getId: true },
      // gameEvent: {},
      // gameId: { alwaysThis: true },
      // gameType: { alwaysThis: true },
      // id: { isId: true },
      // incomingPlayer: { getId: true },
      // isBonus: {},
      // isCharge: {},
      // isNeutralFloor: { alwaysThis: true },
      // isPlayerFouledOut: {},
      // offPlayer1: { getId: true },
      // offPlayer2: { getId: true },
      // offPlayersOnCourt: { getIdArray: true },
      // offTeam: { getId: true },
      // outgoingPlayer: { getId: true },
      // possessionLength: {},
      // segment: {},
      // shotType: {},
      // shotValue: {},
      // team0: { alwaysThis: true },
      // team1: { alwaysThis: true },
      // turnoverType: {},
      // violationType: {},
      // x: {},
      // y: {},
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

    // let insertString = "";

    // fs.appendFileSync(this.filePath, `${insertString}\n`);
    // this.eventIdIterator++;
  }

  appendToFile = (gameEvent: GameEventEnum, gameEventData: any) => {
    const pipeSettingsKeys = Object.keys(this.pipeSettings);
  };

  getAppendObj = (gameEvent: GameEventEnum, gameEventData: any) => {
    const appendObj: any = {
      //mandatory below
      defPlayersOnCourt: gameEventData["defPlayersOnCourt"],
      defTeam: gameEventData["defTeam"],
      gameEvent,
      gameType: gameEventData["gameType"],
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
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;
        break;
      }
      case "2FG_BLOCK": {
        const { offPlayer0, shotType, shotValue, defPlayer0, x, y } =
          gameEventData as GameEventBlock;
        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;
        break;
      }
      case "2FG_MADE": {
        const { offPlayer0, shotType, shotValue, offPlayer1, x, y } =
          gameEventData as GameEvent2FgMade;

        appendObj.player0 = offPlayer0;
        appendObj.player1 = offPlayer1;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;

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
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;

        break;
      }
      case "2FG_MISS": {
        const { offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent2FgMiss;

        appendObj.player0 = offPlayer0;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;

        break;
      }
      case "2FG_MISS_FOUL": {
        const { defPlayer0, offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent2FgMissFoul;

        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;

        break;
      }
      case "3FG_ATTEMPT": {
        const { offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent3FgAttempt;
        appendObj.player0 = offPlayer0;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;
        break;
      }
      case "3FG_BLOCK": {
        const { offPlayer0, shotType, shotValue, defPlayer0, x, y } =
          gameEventData as GameEventBlock;
        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;
        break;
      }
      case "3FG_MADE": {
        const { offPlayer0, shotType, shotValue, offPlayer1, x, y } =
          gameEventData as GameEvent3FgMade;

        appendObj.player0 = offPlayer0;
        appendObj.player1 = offPlayer1;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;
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
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;
        break;
      }
      case "3FG_MISS": {
        const { offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent3FgMiss;

        appendObj.player0 = offPlayer0;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;
        break;
      }
      case "3FG_MISS_FOUL": {
        const { defPlayer0, offPlayer0, shotType, shotValue, x, y } =
          gameEventData as GameEvent3FgMissFoul;

        appendObj.player0 = offPlayer0;
        appendObj.player1 = defPlayer0;
        appendObj.text0 = shotType;
        appendObj.value0 = shotValue;
        appendObj.value1 = x;
        appendObj.value2 = y;
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
        appendObj.value0 = shotValue;
        appendObj.value1 = shotNumber;
        appendObj.value2 = totalShots;

        break;
      }
      case "GAME_END": {
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
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "FOUL_TECHNICAL": {
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
        this.appendToFile(gameEvent, gameEventData);
        break;
      }
      case "TIMEOUT": {
        this.appendToFile(gameEvent, gameEventData);
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
