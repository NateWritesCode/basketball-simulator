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
  GameEventEnum,
  GameEventFreeThrow,
  GameEventJumpBallWon,
  GameEventSegment,
  GameEventStartingLineup,
  IObserver,
  GameEvent3FgMissFoul,
  GameEventRebound,
  GameTypeTimeSegments,
  GameEventNonShootingDefensiveFoul,
  GameEventSteal,
  GameEventTurnover,
} from "../types";
import { log } from "../utils";
import ordinal from "ordinal";
import fs from "fs";
import Socket from "../Socket";

class GameLog implements IObserver {
  gameLog: string[][];

  constructor(socket: Socket) {
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
        const { player, team, shotType, x, y } =
          gameEventData as GameEvent2FgAttempt;
        this.logInfo([
          `${player.getFullName()} is attempting a 2-point shot for ${team.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_BLOCK": {
        const { player, blockingPlayer } = gameEventData as GameEventBlock;
        this.logInfo([
          `${player.getFullName()} had a 2-point shot blocked by ${blockingPlayer.getFullName()}`,
        ]);
        break;
      }
      case "2FG_MADE": {
        const { player, team, shotType, x, y } =
          gameEventData as GameEvent2FgMade;
        this.logInfo([
          `${player.getFullName()} made a 2-point shot for ${team.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MADE_FOUL": {
        const { foulingPlayer, player, team, shotType, x, y } =
          gameEventData as GameEvent2FgMadeFoul;
        this.logInfo([
          `${player.getFullName()} made a 2-point shot for ${team.getFullName()} and was fouled by ${foulingPlayer.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MISS": {
        const { player, team, shotType, x, y } =
          gameEventData as GameEvent2FgMiss;
        this.logInfo([
          `${player.getFullName()} missed a 2-point shot for ${team.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "2FG_MISS_FOUL": {
        const { player, team, foulingPlayer, shotType, x, y } =
          gameEventData as GameEvent2FgMissFoul;
        this.logInfo([
          `${player.getFullName()} missed a 2-point shot for ${team.getFullName()} and was fouled by ${foulingPlayer.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_ATTEMPT": {
        const { player, team, shotType, x, y } =
          gameEventData as GameEvent3FgAttempt;
        this.logInfo([
          `${player.getFullName()} is attempting a 3-point shot for ${team.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_BLOCK": {
        const { player, blockingPlayer } = gameEventData as GameEventBlock;
        this.logInfo([
          `${player.getFullName()} had a 3-point shot blocked by ${blockingPlayer.getFullName()}`,
        ]);
        break;
      }
      case "3FG_MADE": {
        const { player, team, shotType, x, y } =
          gameEventData as GameEvent3FgMade;
        this.logInfo([
          `${player.getFullName()} made a 3-point shot for ${team.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MADE_FOUL": {
        const { foulingPlayer, player, team, shotType, x, y } =
          gameEventData as GameEvent3FgMadeFoul;
        this.logInfo([
          `${player.getFullName()} made a 3-point shot for ${team.getFullName()} and was fouled by ${foulingPlayer.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MISS": {
        const { player, team, shotType, x, y } =
          gameEventData as GameEvent3FgMiss;
        this.logInfo([
          `${player.getFullName()} missed a 3-point shot for ${team.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "3FG_MISS_FOUL": {
        const { player, team, foulingPlayer, shotType, x, y } =
          gameEventData as GameEvent3FgMissFoul;
        this.logInfo([
          `${player.getFullName()} missed a 3-point shot for ${team.getFullName()} and was fouled by ${foulingPlayer.getFullName()} ${shotType} x:${x} y:${y}`,
        ]);
        break;
      }
      case "DEFENSIVE_REBOUND": {
        const { player, team } = gameEventData as GameEventRebound;
        this.logInfo([
          `${team.getFullName()} ${
            player ? player.getFullName() : ""
          } has rebounded the ball for the defense`,
        ]);
        break;
      }

      case "FREE_THROW": {
        const { bonus, player, shotMade, shotNumber, totalShots } =
          gameEventData as GameEventFreeThrow;
        const shotResultText = shotMade ? "MADE" : "MISS";
        this.logInfo([
          `${
            bonus ? "BONUS - " : ""
          }Free throw ${shotNumber} of ${totalShots} - ${player.getFullName()} ${shotResultText}`,
        ]);
        break;
      }

      case "GAME_END": {
        this.logDanger(["Game has ended"]);
        const file = fs.createWriteStream("./src/data/gameLog.txt");
        this.gameLog.forEach((v) => file.write(`${v}\r\n`));
        file.end();
        break;
      }
      case "GAME_START": {
        this.logInfo(["Game has started"]);
        break;
      }
      case "JUMP_BALL_WON": {
        const { isInitialTip, winningPlayer, team } =
          gameEventData as GameEventJumpBallWon;
        this.logInfo([
          `${winningPlayer.getFullName()} ${
            isInitialTip
              ? "wins the initial tip"
              : "wins a possession toss-up jump ball"
          } for the ${team.getFullName()}`,
        ]);

        break;
      }
      case "NON_SHOOTING_DEFENSIVE_FOUL": {
        const { player, foulingPlayer } =
          gameEventData as GameEventNonShootingDefensiveFoul;
        this.logInfo([
          `${player.getFullName()} fouled by ${foulingPlayer.getFullName()} - non-shooting defensive foul`,
        ]);

        break;
      }
      case "OFFENSIVE_REBOUND": {
        const { player, team } = gameEventData as GameEventRebound;
        this.logInfo([
          `${team.getFullName()} ${
            player ? player.getFullName() : ""
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
        break;
      }
      case "SEGMENT_START": {
        const { segment, timeSegmentIndex } = gameEventData as GameEventSegment;
        const prettySegment = this.getPrettySegment(segment, timeSegmentIndex);

        this.logDanger([`${prettySegment} has started`]);
        break;
      }

      case "STARTING_LINEUP": {
        const { playersOnCourt, teams } =
          gameEventData as GameEventStartingLineup;

        teams.forEach((team, teamIndex) => {
          this.logInfo([
            `STARTING LINEUP ${team.getFullName()} - `,
            ...playersOnCourt[teamIndex].map((player) => player.getFullName()),
          ]);
        });

        break;
      }
      case "STEAL": {
        const { player, stealingPlayer } = gameEventData as GameEventSteal;

        this.logInfo([
          `TURNOVER - ${player.getFullName()} had the ball stolen by ${stealingPlayer.getFullName()}`,
        ]);

        break;
      }
      case "TURNOVER": {
        const { player, turnoverType } = gameEventData as GameEventTurnover;

        this.logInfo([
          `TURNOVER - ${turnoverType} by ${player.getFullName()} `,
        ]);

        break;
      }
      default:
        const exhaustiveCheck: never = gameEvent;
        throw new Error(exhaustiveCheck);
    }
  }
}

export default GameLog;
