import ordinal from "ordinal";
import fs from "fs";
import { GameTypeTimeSegments, GameEventEnum } from "../types/enums";
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
  GameEventFoulTechnical,
  GameEventFreeThrow,
  GameEventJumpBall,
  GameEventFoulNonShootingDefensive,
  GameEventFoulOffensive,
  GameEventReboundOffensive,
  GameEventSegment,
  GameEventStartingLineup,
  GameEventSteal,
  GameEventSubstitution,
  GameEventTimeout,
  GameEventTurnover,
  GameEventViolation,
} from "../types/gameEvents";
import { IObserver } from "../types/general";
import { log } from "../utils/log";
import { storage } from "@serverless/cloud";

class GameLog implements IObserver {
  asyncOperations: any[];
  gameId: number;
  gameLog: string[][];

  constructor(gameId: number, asyncOperations: any[]) {
    this.asyncOperations = asyncOperations;
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
        const { offPlayer0, offTeam, shotType, x, y } =
          gameEventData as GameEvent2FgAttempt;
        this.logInfo([
          `${offPlayer0.getFullName()} is attempting a 2-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_BLOCK": {
        const { offPlayer0, defPlayer0 } = gameEventData as GameEventBlock;
        this.logInfo([
          `${offPlayer0.getFullName()} had a 2-point shot blocked by ${defPlayer0.getFullName()}`,
        ]);
        break;
      }
      case "2FG_MADE": {
        const { offPlayer0, offTeam, shotType, x, y } =
          gameEventData as GameEvent2FgMade;
        this.logInfo([
          `${offPlayer0.getFullName()} made a 2-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MADE_FOUL": {
        const { defPlayer0, offPlayer0, offTeam, shotType, x, y } =
          gameEventData as GameEvent2FgMadeFoul;
        this.logInfo([
          `${offPlayer0.getFullName()} made a 2-point shot for ${offTeam.getFullName()} and was fouled by ${defPlayer0.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MISS": {
        const { offPlayer0, offTeam, shotType, x, y } =
          gameEventData as GameEvent2FgMiss;
        this.logInfo([
          `${offPlayer0.getFullName()} missed a 2-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MISS_FOUL": {
        const { offPlayer0, offTeam, defPlayer0, shotType, x, y } =
          gameEventData as GameEvent2FgMissFoul;
        this.logInfo([
          `${offPlayer0.getFullName()} missed a 2-point shot for ${offTeam.getFullName()} and was fouled by ${defPlayer0.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_ATTEMPT": {
        const { offPlayer0, offTeam, shotType, x, y } =
          gameEventData as GameEvent3FgAttempt;
        this.logInfo([
          `${offPlayer0.getFullName()} is attempting a 3-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_BLOCK": {
        const { offPlayer0, defPlayer0 } = gameEventData as GameEventBlock;
        this.logInfo([
          `${offPlayer0.getFullName()} had a 3-point shot blocked by ${defPlayer0.getFullName()}`,
        ]);
        break;
      }
      case "3FG_MADE": {
        const { offPlayer0, offTeam, shotType, x, y } =
          gameEventData as GameEvent3FgMade;
        this.logInfo([
          `${offPlayer0.getFullName()} made a 3-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MADE_FOUL": {
        const { defPlayer0, offPlayer0, offTeam, shotType, x, y } =
          gameEventData as GameEvent3FgMadeFoul;
        this.logInfo([
          `${offPlayer0.getFullName()} made a 3-point shot for ${offTeam.getFullName()} and was fouled by ${defPlayer0.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MISS": {
        const { offPlayer0, offTeam, shotType, x, y } =
          gameEventData as GameEvent3FgMiss;
        this.logInfo([
          `${offPlayer0.getFullName()} missed a 3-point shot for ${offTeam.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MISS_FOUL": {
        const { offPlayer0, offTeam, defPlayer0, shotType, x, y } =
          gameEventData as GameEvent3FgMissFoul;
        this.logInfo([
          `${offPlayer0.getFullName()} missed a 3-point shot for ${offTeam.getFullName()} and was fouled by ${defPlayer0.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "DEFENSIVE_REBOUND": {
        const { defPlayer0, defTeam } =
          gameEventData as GameEventReboundDefensive;
        this.logInfo([
          `${defTeam.getFullName()} ${
            defPlayer0 ? defPlayer0.getFullName() : ""
          } has rebounded the ball for the defense`,
        ]);
        break;
      }
      case "EJECTION": {
        const { player0, ejectionReason } = gameEventData as GameEventEjection;
        this.logInfo([`EJECTION - ${player0.getFullName()} ${ejectionReason}`]);
        break;
      }
      case "FOUL_TECHNICAL": {
        const { player0, player1, technicalReason } =
          gameEventData as GameEventFoulTechnical;
        this.logInfo([
          `${
            player0 && player1 ? "DOUBLE " : ""
          }TECHNICAL FOUL - ${player0.getFullName()}${
            player1 ? ` ${player1.getFullName()}` : ""
          } ${technicalReason}`,
        ]);

        break;
      }
      case "FREE_THROW": {
        const { isBonus, offPlayer0, isMade, shotNumber, totalShots } =
          gameEventData as GameEventFreeThrow;
        const shotResultText = isMade ? "MADE" : "MISS";
        this.logInfo([
          `${
            isBonus ? "BONUS - " : ""
          }Free throw ${shotNumber} of ${totalShots} - ${offPlayer0.getFullName()} ${shotResultText}`,
        ]);
        break;
      }

      case "GAME_END": {
        this.logDanger(["Game has ended"]);
        let dataString = "";
        this.gameLog.forEach((gameLogs) =>
          gameLogs.forEach((v) => (dataString += `${v}\r\n`))
        );

        this.asyncOperations.push(async () => {
          try {
            await storage.write(
              `/data/game-logs/${this.gameId}.txt`,
              dataString
            );
          } catch (error) {
            throw new Error(error);
          }
        });

        console.log("PUSHED GAME END!!!");

        break;
      }
      case "GAME_START": {
        this.logInfo(["Game has started"]);
        break;
      }
      case "JUMP_BALL": {
        const { offPlayer0, offTeam } = gameEventData as GameEventJumpBall;
        this.logInfo([
          `${offPlayer0.getFullName()} wins the tip for the ${offTeam.getFullName()}`,
        ]);

        break;
      }
      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        const { offPlayer0, defPlayer0, foulType } =
          gameEventData as GameEventFoulNonShootingDefensive;
        this.logInfo([
          `${offPlayer0.getFullName()} fouled by ${defPlayer0.getFullName()} - ${foulType} foul`,
        ]);

        break;
      }
      case "FOUL_OFFENSIVE": {
        const { defPlayer0, isCharge, offPlayer0 } =
          gameEventData as GameEventFoulOffensive;
        this.logInfo([
          `OFFENSIVE FOUL${
            isCharge ? " CHARGE " : ""
          }-${offPlayer0.getFullName()} fouled ${defPlayer0.getFullName()}`,
        ]);

        break;
      }
      case "OFFENSIVE_REBOUND": {
        const { offPlayer0, offTeam } =
          gameEventData as GameEventReboundOffensive;
        this.logInfo([
          `${offTeam.getFullName()} ${
            offPlayer0 ? offPlayer0.getFullName() : ""
          } has rebounded the ball for the offense`,
        ]);
        break;
      }
      case "POSSESSION_ARROW": {
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
        const { offPlayer0, defPlayer0 } = gameEventData as GameEventSteal;

        this.logInfo([
          `TURNOVER - ${offPlayer0.getFullName()} had the ball stolen by ${defPlayer0.getFullName()}`,
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
      case "TIMEOUT": {
        const { reason, team0 } = gameEventData as GameEventTimeout;

        this.logInfo([`TIMEOUT - ${team0.getFullName()} - ${reason}`]);

        break;
      }
      case "TURNOVER": {
        const { offPlayer0, turnoverType } = gameEventData as GameEventTurnover;

        this.logInfo([
          `TURNOVER - ${turnoverType} by ${offPlayer0.getFullName()} `,
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

export { GameLog };
