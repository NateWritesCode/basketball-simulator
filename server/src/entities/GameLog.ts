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
  GameEventBlock,
  GameEventDefensiveRebound,
  GameEventEnum,
  GameEventFreeThrow,
  GameEventJumpBall,
  GameEventOffensiveRebound,
  GameEventSegment,
  GameEventStartingLineup,
  GameEvent3FgMissFoul,
  GameTypeTimeSegments,
  GameEventNonShootingDefensiveFoul,
  GameEventSteal,
  GameEventTurnover,
  IObserver,
  GameEventViolation,
  GameEventSubstitution,
} from "../types";
import { log } from "../utils";
import ordinal from "ordinal";
import fs from "fs";

class GameLog implements IObserver {
  gameId: number;
  gameLog: string[][];

  constructor(gameId: number) {
    this.gameId = gameId;
    this.gameLog = [];
  }

  getPrettyOvertime = (segment: number, timeSegmentIndex: number): string => {
    return `${ordinal(timeSegmentIndex - segment + 1)}`;
  };

  getPrettySegment = (
    segment: GameTypeTimeSegments,
    timeSegmentIndex: number
  ): string => {
    switch (segment) {
      case GameTypeTimeSegments.Full: {
        if (timeSegmentIndex === 0) {
          return "First and only period";
        } else {
          return this.getPrettyOvertime(segment, timeSegmentIndex);
        }
      }
      case GameTypeTimeSegments.Half: {
        if (timeSegmentIndex <= 1) {
          return `${ordinal(timeSegmentIndex + 1)} half`;
        } else {
          return this.getPrettyOvertime(segment, timeSegmentIndex);
        }
      }
      case GameTypeTimeSegments.Third: {
        if (timeSegmentIndex <= 2) {
          return `${ordinal(timeSegmentIndex + 1)} third`;
        } else {
          return this.getPrettyOvertime(segment, timeSegmentIndex);
        }
      }
      case GameTypeTimeSegments.Quarter: {
        if (timeSegmentIndex <= 3) {
          return `${ordinal(timeSegmentIndex + 1)} quarter`;
        } else {
          return this.getPrettyOvertime(segment, timeSegmentIndex);
        }
      }
      case GameTypeTimeSegments.Eighth: {
        if (timeSegmentIndex <= 7) {
          return `${ordinal(timeSegmentIndex + 1)} eighth`;
        } else {
          return this.getPrettyOvertime(segment, timeSegmentIndex);
        }
      }
      default:
        const exhaustiveCheck: never = segment;
        throw new Error(exhaustiveCheck);
    }
  };

  logDanger = (info: string[]) => {
    log.danger.apply(null, info);
    this.gameLog.push(info);
  };

  logInfo = (info: string[]) => {
    log.info.apply(null, info);
    this.gameLog.push(info);
  };

  notifyGameEvent(gameEvent: GameEventEnum, gameEventData: unknown): void {
    switch (gameEvent) {
      case "2FG_ATTEMPT": {
        const { offPlayer1, offTeam, shotType, x, y } =
          gameEventData as GameEvent2FgAttempt;
        this.logInfo([
          `${offPlayer1.getFullName()} is attempting a 2-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_BLOCK": {
        const { offPlayer1, defPlayer1 } = gameEventData as GameEventBlock;
        this.logInfo([
          `${offPlayer1.getFullName()} had a 2-point shot blocked by ${defPlayer1.getFullName()}`,
        ]);
        break;
      }
      case "2FG_MADE": {
        const { offPlayer1, offTeam, shotType, x, y } =
          gameEventData as GameEvent2FgMade;
        this.logInfo([
          `${offPlayer1.getFullName()} made a 2-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MADE_FOUL": {
        const { defPlayer1, offPlayer1, offTeam, shotType, x, y } =
          gameEventData as GameEvent2FgMadeFoul;
        this.logInfo([
          `${offPlayer1.getFullName()} made a 2-point shot for ${offTeam.getFullName()} and was fouled by ${defPlayer1.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MISS": {
        const { offPlayer1, offTeam, shotType, x, y } =
          gameEventData as GameEvent2FgMiss;
        this.logInfo([
          `${offPlayer1.getFullName()} missed a 2-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MISS_FOUL": {
        const { offPlayer1, offTeam, defPlayer1, shotType, x, y } =
          gameEventData as GameEvent2FgMissFoul;
        this.logInfo([
          `${offPlayer1.getFullName()} missed a 2-point shot for ${offTeam.getFullName()} and was fouled by ${defPlayer1.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_ATTEMPT": {
        const { offPlayer1, offTeam, shotType, x, y } =
          gameEventData as GameEvent3FgAttempt;
        this.logInfo([
          `${offPlayer1.getFullName()} is attempting a 3-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_BLOCK": {
        const { offPlayer1, defPlayer1 } = gameEventData as GameEventBlock;
        this.logInfo([
          `${offPlayer1.getFullName()} had a 3-point shot blocked by ${defPlayer1.getFullName()}`,
        ]);
        break;
      }
      case "3FG_MADE": {
        const { offPlayer1, offTeam, shotType, x, y } =
          gameEventData as GameEvent3FgMade;
        this.logInfo([
          `${offPlayer1.getFullName()} made a 3-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MADE_FOUL": {
        const { defPlayer1, offPlayer1, offTeam, shotType, x, y } =
          gameEventData as GameEvent3FgMadeFoul;
        this.logInfo([
          `${offPlayer1.getFullName()} made a 3-point shot for ${offTeam.getFullName()} and was fouled by ${defPlayer1.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MISS": {
        const { offPlayer1, offTeam, shotType, x, y } =
          gameEventData as GameEvent3FgMiss;
        this.logInfo([
          `${offPlayer1.getFullName()} missed a 3-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MISS_FOUL": {
        const { offPlayer1, offTeam, defPlayer1, shotType, x, y } =
          gameEventData as GameEvent3FgMissFoul;
        this.logInfo([
          `${offPlayer1.getFullName()} missed a 3-point shot for ${offTeam.getFullName()} and was fouled by ${defPlayer1.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "DEFENSIVE_REBOUND": {
        const { defPlayer1, defTeam } =
          gameEventData as GameEventDefensiveRebound;
        this.logInfo([
          `${defTeam.getFullName()} ${
            defPlayer1 ? defPlayer1.getFullName() : ""
          } has rebounded the ball for the defense`,
        ]);
        break;
      }

      case "FREE_THROW": {
        const { isBonus, offPlayer1, valueToAdd, shotNumber, totalShots } =
          gameEventData as GameEventFreeThrow;
        const shotResultText = valueToAdd ? "MADE" : "MISS";
        this.logInfo([
          `${
            isBonus ? "BONUS - " : ""
          }Free throw ${shotNumber} of ${totalShots} - ${offPlayer1.getFullName()} ${shotResultText}`,
        ]);
        break;
      }

      case "GAME_END": {
        this.logDanger(["Game has ended"]);
        const file = fs.createWriteStream(
          `./src/data/game-logs/${this.gameId}.txt`
        );
        this.gameLog.forEach((v) => file.write(`${v}\r\n`));
        file.end();
        break;
      }
      case "GAME_START": {
        this.logInfo(["Game has started"]);
        break;
      }
      case "JUMP_BALL": {
        const { offPlayer1, offTeam } = gameEventData as GameEventJumpBall;
        this.logInfo([
          `${offPlayer1.getFullName()} wins the tip for the ${offTeam.getFullName()}`,
        ]);

        break;
      }
      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        const { offPlayer1, defPlayer1 } =
          gameEventData as GameEventNonShootingDefensiveFoul;
        this.logInfo([
          `${offPlayer1.getFullName()} fouled by ${defPlayer1.getFullName()} - non-shooting defensive foul`,
        ]);

        break;
      }
      case "OFFENSIVE_FOUL": {
        break;
      }
      case "OFFENSIVE_REBOUND": {
        const { offPlayer1, offTeam } =
          gameEventData as GameEventOffensiveRebound;
        this.logInfo([
          `${offTeam.getFullName()} ${
            offPlayer1 ? offPlayer1.getFullName() : ""
          } has rebounded the ball for the offense`,
        ]);
        break;
      }
      case "POSSESSION_ARROW_WON": {
        break;
      }
      case "SEGMENT_END": {
        const { segment, timeSegmentIndex } = gameEventData as GameEventSegment;

        const prettySegment = this.getPrettySegment(segment, timeSegmentIndex);

        this.logDanger([`${prettySegment} has ended`]);

        const isHalftimePossible = segment > 1;

        if (isHalftimePossible) {
          const isHalftime = segment / 2 === timeSegmentIndex + 1;
          if (isHalftime) {
            this.logInfo([
              `HALFTIME SHOW has begun. Everyone say hello Three Dog Night!`,
            ]);
          }
        }

        break;
      }
      case "SEGMENT_START": {
        const { segment, timeSegmentIndex } = gameEventData as GameEventSegment;
        const prettySegment = this.getPrettySegment(segment, timeSegmentIndex);

        this.logDanger([`${prettySegment} has started`]);
        break;
      }

      case "STARTING_LINEUP": {
        const { defPlayersOnCourt, defTeam, offPlayersOnCourt, offTeam } =
          gameEventData as GameEventStartingLineup;

        this.logInfo([
          `STARTING LINEUP ${offTeam.getFullName()} - ${offPlayersOnCourt
            .map((player) => player.getFullName())
            .join(", ")}`,
        ]);

        this.logInfo([
          `STARTING LINEUP ${defTeam.getFullName()} - ${defPlayersOnCourt
            .map((player) => player.getFullName())
            .join(", ")}`,
        ]);

        break;
      }
      case "STEAL": {
        const { offPlayer1, defPlayer1 } = gameEventData as GameEventSteal;

        this.logInfo([
          `TURNOVER - ${offPlayer1.getFullName()} had the ball stolen by ${defPlayer1.getFullName()}`,
        ]);

        break;
      }
      case "SUBSTITUTION": {
        const { incomingPlayer, outgoingPlayer, isPlayerFouledOut } =
          gameEventData as GameEventSubstitution;

        this.logInfo([
          `SUBSTITUTION${
            isPlayerFouledOut ? " (PLAYER FOUL OUT)" : ""
          } - ${incomingPlayer.getFullName()} subbing in for ${outgoingPlayer.getFullName()}`,
        ]);

        break;
      }
      case "TURNOVER": {
        const { offPlayer1, turnoverType } = gameEventData as GameEventTurnover;

        this.logInfo([
          `TURNOVER - ${turnoverType} by ${offPlayer1.getFullName()} `,
        ]);

        break;
      }
      case "VIOLATION": {
        const { violationType } = gameEventData as GameEventViolation;
        this.logInfo([`VIOLATION - ${violationType}`]);

        break;
      }
      default:
        const exhaustiveCheck: never = gameEvent;
        throw new Error(exhaustiveCheck);
    }
  }
}

export default GameLog;
