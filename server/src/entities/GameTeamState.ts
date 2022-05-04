import {
  GameEvent2FgAttempt,
  GameEvent2FgMade,
  GameEvent2FgMadeFoul,
  GameEvent3FgAttempt,
  GameEventBlock,
  GameEventEnum,
  GameEventFreeThrow,
  GameEventJumpBall,
  GameEventFoulNonShootingDefensive,
  GameEventReboundDefensive,
  GameEventReboundOffensive,
  GameEventSteal,
  GameEventTurnover,
  GameSimStatFields,
  GameSimStats,
  GameEventFoulOffensive,
  GameEventSubstitution,
  GameEventTimeout,
  GameEventViolation,
  IObserver,
} from "../types";
import fs from "fs";

class GameTeamState implements IObserver {
  [index: string]: any;
  andOne: number;
  ast: number;
  blk: number;
  blkd: number;
  drb: number;
  dunks: number;
  ejections: number;
  fga: number;
  fgm: number;
  fouls: number;
  foulsOffensive: number;
  foulsOffensiveCharge: number;
  foulsOffensiveOther: number;
  foulsShooting: number;
  foulsBySegment: number[];
  foulsTechnical: number;
  fta: number;
  ftm: number;
  gameGroupId: number;
  gameId: number;
  gameSimStats: GameSimStats | null;
  gameSimSegmentData: GameSimStats[];
  heaves: number;
  id: number;
  jumpBallsLost: number;
  jumpBallsWon: number;
  momentum: number;
  name: string;
  orb: number;
  penalty: boolean;
  pf: number;
  pga: number;
  pts: number;
  statsToRecord: string[];
  stl: number;
  substitutions: number;
  teamGameFilePath: string;
  teamGameGroupFilePath: string;
  teamDrb: number;
  teamOrb: number;
  timeouts: number;
  tov: number;
  tpa: number;
  tpm: number;

  constructor(id: number, gameId: number, name: string, timeouts: number) {
    this.andOne = 0;
    this.ast = 0;
    this.blk = 0;
    this.blkd = 0;
    this.dunks = 0;
    this.drb = 0;
    this.ejections = 0;
    this.fga = 0;
    this.fgm = 0;
    this.fouls = 0;
    this.foulsOffensive = 0;
    this.foulsOffensiveCharge = 0;
    this.foulsOffensiveOther = 0;
    this.foulsShooting = 0;
    this.foulsBySegment = [];
    this.foulsTechnical = 0;
    this.fta = 0;
    this.ftm = 0;
    this.gameGroupId = 1;
    this.gameId = gameId;
    this.gameSimSegmentData = [];
    this.gameSimStats = null;
    this.heaves = 0;
    this.id = id;
    this.jumpBallsLost = 0;
    this.jumpBallsWon = 0;
    this.momentum = 0;
    this.name = name;
    this.orb = 0;
    this.penalty = false;
    this.pf = 0;
    this.pga = 0;
    this.pts = 0;
    this.stl = 0;
    this.substitutions = 0;
    this.teamDrb = 0;
    this.teamGameFilePath = `./src/data/team-game/${id}.txt`;
    this.teamGameGroupFilePath = `./src/data/team-game-group/${id}.txt`;
    this.teamOrb = 0;
    this.timeouts = timeouts;
    this.tov = 0;
    this.tpa = 0;
    this.tpm = 0;
    this.statsToRecord = [
      "gameId",
      "gameGroupId",
      "andOne",
      "ast",
      "blk",
      "blkd",
      "drb",
      "dunks",
      "ejections",
      "fga",
      "fgm",
      "fouls",
      "foulsOffensive",
      "foulsOffensiveCharge",
      "foulsOffensiveOther",
      "foulsShooting",
      "foulsTechnical",
      "fta",
      "ftm",
      "heaves",
      "jumpBallsLost",
      "jumpBallsWon",
      "orb",
      "pf",
      "pts",
      "stl",
      "substitutions",
      "teamDrb",
      "teamOrb",
      "tov",
      "tpa",
      "tpm",
    ];
  }

  closeTeamState = () => {
    this.writeToTeamGame();
    this.writeToTeamGameGroup();
  };

  writeToTeamGame = () => {
    try {
      if (fs.existsSync(this.teamGameFilePath)) {
      }
    } catch (err) {
      fs.writeFileSync(this.teamGameFilePath, "");
      let headerString = "";
      this.statsToRecord.forEach((statToRecord, i) => {
        const isLastKey = i + 1 === this.statsToRecord.length;
        const value = statToRecord;
        headerString += `${value}${isLastKey ? "" : "|"}`;
      });
      fs.appendFileSync(this.teamGameFilePath, `${headerString}\n`);
    }

    let rowString = "";
    this.statsToRecord.forEach((statToRecord, i) => {
      const isLastKey = i + 1 === this.statsToRecord.length;
      let value = this[statToRecord];

      if (typeof value === "boolean") {
        value = Number(value);
      }

      rowString += `${value}${isLastKey ? "" : "|"}`;
    });
    fs.appendFileSync(this.teamGameFilePath, `${rowString}\n`);
  };

  writeToTeamGameGroup = () => {
    let fileExists = true;
    if (fs.existsSync(this.teamGameGroupFilePath)) {
    } else {
      fileExists = false;
      fs.writeFileSync(this.teamGameGroupFilePath, "");
      let headerString = "";
      this.statsToRecord.forEach((statToRecord, i) => {
        const isLastKey = i + 1 === this.statsToRecord.length;
        let value = statToRecord;

        if (statToRecord === "gameId") {
          value = "gp"; //change gameId to gamesPlayed
        }

        headerString += `${value}${isLastKey ? "" : "|"}`;
      });
      fs.appendFileSync(this.teamGameGroupFilePath, `${headerString}\n`);
    }

    if (fileExists) {
      const data = fs
        .readFileSync(this.teamGameGroupFilePath, {
          encoding: "utf8",
          flag: "r",
        })
        .trim()
        .split("\n");

      let lineToOverwrite = data.length - 1;
      let rowString = "";

      for (let i = data.length - 1; i >= 0; i--) {
        const line = data[i].split("|");
        const [_, gameGroupId] = line;

        if (Number(gameGroupId) === this.gameGroupId) {
          this.statsToRecord.forEach((statToRecord, i) => {
            const isLastKey = i + 1 === this.statsToRecord.length;
            let value = Number(line[i]);
            if (statToRecord === "gameId") {
              value = value + 1;
            } else if (statToRecord === "gameGroupId") {
            } else {
              value += Number(this[statToRecord]);
            }

            rowString += `${value}${isLastKey ? "" : "|"}`;
          });

          lineToOverwrite = i;

          break;
        }
      }

      data[lineToOverwrite] = rowString;

      fs.writeFileSync(this.teamGameGroupFilePath, data.join("\n"));
    } else {
      let rowString = "";
      this.statsToRecord.forEach((statToRecord, i) => {
        const isLastKey = i + 1 === this.statsToRecord.length;
        let value = this[statToRecord];

        if (statToRecord === "gameId") {
          value = 1;
        }

        if (typeof value === "boolean") {
          value = Number(value);
        }

        rowString += `${value}${isLastKey ? "" : "|"}`;
      });
      fs.appendFileSync(this.teamGameGroupFilePath, `${rowString}\n`);
    }
  };

  gatherGameSimSegmentData = (
    statFields: GameSimStatFields[]
  ): GameSimStats => {
    const gameSimStats = this.gatherGameSimStats(statFields);

    if (this.gameSimSegmentData.length === 0) {
      return gameSimStats;
    } else {
      const previousSegmentsGameStatsSummed = this.gameSimSegmentData.reduce(
        (a, b) => {
          const keys = Object.keys(b) as GameSimStatFields[];
          keys.forEach((key) => {
            a[key] += b[key];
          });

          return a;
        },
        statFields.reduce<GameSimStats>(
          (a, v) => ({ ...a, [v]: 0 }),
          {} as GameSimStats
        )
      );

      statFields.forEach((statField) => {
        gameSimStats[statField] -= previousSegmentsGameStatsSummed[statField];
      });

      return gameSimStats;
    }
  };

  gatherGameSimStats = (statFields: GameSimStatFields[]): GameSimStats => {
    const gameSimStats = statFields.reduce<GameSimStats>(
      (a, v) => ({ ...a, [v]: 0 }),
      {} as GameSimStats
    );

    statFields.forEach((statField) => {
      gameSimStats[statField] = this[statField];
    });

    return gameSimStats;
  };

  notifyGameEvent(gameEvent: GameEventEnum, gameEventData: unknown): void {
    switch (gameEvent) {
      case "2FG_ATTEMPT": {
        const { offTeam } = gameEventData as GameEvent2FgAttempt;
        if (offTeam.id === this.id) {
          this.fga += 1;
        }

        break;
      }
      case "2FG_BLOCK": {
        const { offTeam } = gameEventData as GameEventBlock;
        if (offTeam.id === this.id) {
          this.blkd += 1;
        } else {
          this.momentum += 1;
          this.blk += 1;
        }

        break;
      }
      case "2FG_MADE": {
        const { offTeam } = gameEventData as GameEvent2FgMade;
        if (offTeam.id === this.id) {
          this.fgm += 1;
          this.momentum += 2;
          this.pts += 2;
        }
        break;
      }
      case "2FG_MADE_FOUL": {
        const {
          offTeam,
          segment: gameEventDataSegment,
          foulPenaltySettings,
        } = gameEventData as GameEvent2FgMadeFoul;
        if (offTeam.id === this.id) {
          this.fgm += 1;
          this.momentum += 2;
          this.pts += 2;
        } else {
          const segment = gameEventDataSegment ? gameEventDataSegment : 0;
          this.foulsBySegment[segment] += 1;
          this.pf += 1;
          if (
            this.foulsBySegment[segment] >= foulPenaltySettings.penaltyThreshold
          ) {
            this.penalty = true;
          }
        }
        break;
      }
      case "2FG_MISS": {
        this.momentum -= 1;
        break;
      }
      case "2FG_MISS_FOUL": {
        const {
          offTeam,
          segment: gameEventDataSegment,
          foulPenaltySettings,
        } = gameEventData as GameEvent2FgMadeFoul;
        if (offTeam.id === this.id) {
        } else {
          const segment = gameEventDataSegment ? gameEventDataSegment : 0;
          this.foulsBySegment[segment] += 1;
          this.pf += 1;
          if (
            this.foulsBySegment[segment] >= foulPenaltySettings.penaltyThreshold
          ) {
            this.penalty = true;
          }
        }
        break;
      }
      case "3FG_ATTEMPT": {
        const { offTeam } = gameEventData as GameEvent3FgAttempt;
        if (offTeam.id === this.id) {
          this.fga += 1;
          this.tpa += 1;
        }

        break;
      }
      case "3FG_BLOCK": {
        const { offTeam } = gameEventData as GameEventBlock;
        if (offTeam.id === this.id) {
          this.blkd += 1;
        } else {
          this.momentum += 1;
          this.blk += 1;
        }

        break;
      }
      case "3FG_MADE": {
        const { offTeam, offPlayer0 } = gameEventData as GameEvent2FgMade;
        if (offTeam.id === this.id) {
          this.fgm += 1;
          this.momentum += 3;
          this.pts += 3;
          this.tpm += 1;
        }

        if (offPlayer0) {
          this.ast += 1;
        }

        break;
      }
      case "3FG_MADE_FOUL": {
        const {
          foulPenaltySettings,
          offPlayer0,
          offTeam,
          segment: gameEventDataSegment,
        } = gameEventData as GameEvent2FgMadeFoul;
        if (offTeam.id === this.id) {
          this.fgm += 1;
          this.momentum += 3;
          this.pts += 3;
          this.tpm += 1;

          if (offPlayer0) {
            this.ast += 1;
          }
        } else {
          const segment = gameEventDataSegment ? gameEventDataSegment : 0;
          this.foulsBySegment[segment] += 1;
          this.pf += 1;

          if (
            this.foulsBySegment[segment] >= foulPenaltySettings.penaltyThreshold
          ) {
            this.penalty = true;
          }
        }
        break;
      }
      case "3FG_MISS": {
        this.momentum -= 1;
        break;
      }
      case "3FG_MISS_FOUL": {
        const {
          offTeam,
          segment: gameEventDataSegment,
          foulPenaltySettings,
        } = gameEventData as GameEvent2FgMadeFoul;
        if (offTeam.id === this.id) {
        } else {
          const segment = gameEventDataSegment ? gameEventDataSegment : 0;
          this.foulsBySegment[segment] += 1;
          this.pf += 1;
          if (
            this.foulsBySegment[segment] >= foulPenaltySettings.penaltyThreshold
          ) {
            this.penalty = true;
          }
        }
        break;
      }
      case "DEFENSIVE_REBOUND": {
        const { defPlayer0, defTeam } =
          gameEventData as GameEventReboundDefensive;
        if (defTeam.id === this.id) {
          if (defPlayer0) {
            this.drb += 1;
          } else {
            this.teamDrb += 1;
          }
        }

        break;
      }
      case "EJECTION": {
        break;
      }
      case "FOUL_TECHNICAL": {
        break;
      }
      case "FREE_THROW": {
        const { isMade, offTeam } = gameEventData as GameEventFreeThrow;

        if (offTeam.id === this.id) {
          this.fta += 1;
          if (isMade) {
            this.ftm += 1;
            this.momentum += 1;
            this.pts += 1;
          }
        }

        break;
      }
      case "GAME_END": {
        // this.gameSimStats = this.gatherGameSimStats([
        //   "jumpBallsLost",
        //   "jumpBallsWon",
        //   "pts",
        // ]);
        this.closeTeamState();
        break;
      }
      case "GAME_START": {
        break;
      }
      case "JUMP_BALL": {
        const { offTeam } = gameEventData as GameEventJumpBall;
        if (offTeam.id === this.id) {
          this.momentum += 1;
          this.jumpBallsWon++;
        } else {
          this.momentum -= 1;
          this.jumpBallsLost++;
        }

        break;
      }

      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        const {
          offTeam,
          segment: gameEventDataSegment,
          foulPenaltySettings,
        } = gameEventData as GameEventFoulNonShootingDefensive;
        if (offTeam.id === this.id) {
        } else {
          const segment = gameEventDataSegment ? gameEventDataSegment : 0;
          this.foulsBySegment[segment] += 1;
          this.pf += 1;
          if (
            this.foulsBySegment[segment] >= foulPenaltySettings.penaltyThreshold
          ) {
            this.penalty = true;
          }
        }

        break;
      }

      case "FOUL_OFFENSIVE": {
        const { isCharge, offTeam } = gameEventData as GameEventFoulOffensive;

        if (offTeam.id === this.id) {
          if (isCharge) {
            this.foulsOffensiveCharge++;
          } else {
            this.foulsOffensiveOther++;
          }
          this.foulsOffensive++;
        } else {
          this.momentum += 1;
        }

        break;
      }

      case "OFFENSIVE_REBOUND": {
        const { offPlayer0, offTeam } =
          gameEventData as GameEventReboundOffensive;
        if (offTeam.id === this.id) {
          if (offPlayer0) {
            this.orb += 1;
          } else {
            this.teamOrb += 1;
          }

          this.momentum += 1;
        }

        break;
      }
      case "POSSESSION_ARROW": {
        break;
      }
      case "SEGMENT_START": {
        this.foulsBySegment.push(0);
        if (this.penalty) {
          this.penalty = false;
        }
        break;
      }
      case "SEGMENT_END": {
        const gameSimSegmentData = this.gatherGameSimSegmentData([
          "jumpBallsLost",
          "jumpBallsWon",
          "pts",
        ]);
        this.momentum = 0;

        this.gameSimSegmentData.push(gameSimSegmentData);
        break;
      }
      case "STARTING_LINEUP": {
        break;
      }
      case "STEAL": {
        const { offTeam } = gameEventData as GameEventSteal;

        if (offTeam.id === this.id) {
          this.tov += 1;
        } else {
          this.momentum += 1;
          this.stl += 1;
        }
        break;
      }
      case "SUBSTITUTION": {
        const { incomingPlayer } = gameEventData as GameEventSubstitution;
        if (incomingPlayer.teamId === this.id) {
          this.substitutions++;
        }
        break;
      }
      case "TIMEOUT": {
        const { team0 } = gameEventData as GameEventTimeout;

        if (team0.id === this.id) {
          this.timeouts -= 1;
        }

        this.momentum = 0;

        break;
      }
      case "TURNOVER": {
        const { offTeam } = gameEventData as GameEventTurnover;
        if (offTeam.id === this.id) {
          this.tov += 1;
        } else {
          this.momentum += 1;
        }
        break;
      }

      case "VIOLATION": {
        const { offTeam } = gameEventData as GameEventViolation;
        if (offTeam.id === this.id) {
        } else {
          this.momentum += 1;
        }
        break;
      }

      default: {
        const exhaustiveCheck: never = gameEvent;
        throw new Error(exhaustiveCheck);
      }
    }
  }

  public setTimeouts = (timeouts: number) => {
    this.timeouts = timeouts;
  };
}

export default GameTeamState;
