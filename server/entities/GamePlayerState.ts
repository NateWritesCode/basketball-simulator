import { Player } from ".";
import {
  IObserver,
  GameSimStats,
  GameSimStatFields,
  GameEventEnum,
  GameEvent2FgAttempt,
  GameEvent3FgAttempt,
  GameEventReboundDefensive,
  GameEventJumpBall,
  GameEventStartingLineup,
  GameEventBlock,
  GameEvent2FgMade,
  GameEvent3FgMade,
  GameEventFreeThrow,
  GameEventReboundOffensive,
  GameEventFoulNonShootingDefensive,
  GameEvent3FgMadeFoul,
  GameEvent3FgMissFoul,
  GameEvent2FgMissFoul,
  GameEvent2FgMadeFoul,
  GameEventSteal,
  GameEventTurnover,
  GameEventFoulOffensive,
  GameEventViolation,
  GameEventSegment,
  GameEventSubstitution,
  GameEventFoulTechnical,
  GameEventEjection,
} from "../types";
import fs from "fs";
import { csvDb } from "../utils/csvDb";

class GamePlayerState implements IObserver {
  [index: string]: any;
  andOne: number;
  ast: number;
  blk: number;
  blkd: number; //num of times blocked
  drb: number;
  dunks: number;
  fatigue: number;
  fatigueFactor: number;
  fga: number;
  fgm: number;
  flagrant1: number;
  flagrant2: number;
  fouled: number;
  fouls: number;
  foulsOffensive: number;
  foulsOffensiveCharge: number;
  foulsOffensiveOther: number;
  foulsShooting: number;
  foulsTechnical: number;
  fta: number;
  ftm: number;
  gameId: number;
  gameGroupId: number;
  gameSimStats: GameSimStats | null;
  gameSimSegmentData: GameSimStats[];
  heaves: number; //shots in front of half court
  id: number;
  isEjected: boolean;
  isInjuredWithNoReturn: boolean;
  inspiration: number;
  isStarter: boolean;
  jumpBallsLost: number;
  jumpBallsWon: number;
  name: string;
  orb: number;
  ptsba: number; //pts generated by assist
  playerGameFilePath: string;
  playerGameGroupFilePath: string;
  plusMinus: number;
  position: string;
  pts: number;
  slug: string;
  statsToRecord: string[];
  stl: number;
  substitutionIn: number;
  substitutionOut: number;
  teamIndex: number;
  teamId: number;
  timePlayed: number;
  tov: number;
  tpa: number; //3 attempts
  tpm: number; //3 makes

  constructor(
    id: number,
    fatigueFactor: number,
    gameId: number,
    name: string,
    position: string,
    slug: string,
    teamId: number,
    teamIndex: number
  ) {
    this.andOne = 0;
    this.ast = 0;
    this.blk = 0;
    this.blkd = 0;
    this.drb = 0;
    this.dunks = 0;
    this.fatigue = 0;
    this.fatigueFactor = fatigueFactor;
    this.fga = 0;
    this.fgm = 0;
    this.flagrant1 = 0;
    this.flagrant2 = 0;
    this.fouls = 0;
    this.foulsOffensive = 0;
    this.foulsShooting = 0;
    this.foulsTechnical = 0;
    this.foulsOffensiveCharge = 0;
    this.foulsOffensiveOther = 0;
    this.fouled = 0;
    this.fta = 0;
    this.ftm = 0;
    this.gameGroupId = 1;
    this.gameId = gameId;
    this.gameSimSegmentData = [];
    this.gameSimStats = null;
    this.heaves = 0;
    this.id = id;
    this.isEjected = false;
    this.isInjuredWithNoReturn = false;
    this.isStarter = false;
    this.inspiration = 0;
    this.jumpBallsLost = 0;
    this.jumpBallsWon = 0;
    this.name = name;
    this.orb = 0;
    this.playerGameFilePath = `./src/data/player-game/${id}.txt`;
    this.playerGameGroupFilePath = `./src/data/player-game-group/${id}.txt`;
    this.plusMinus = 0;
    this.position = position;
    this.pts = 0;
    this.ptsba = 0;
    this.slug = slug;
    this.stl = 0;
    this.substitutionIn = 0;
    this.substitutionOut = 0;
    this.teamId = teamId;
    this.teamIndex = teamIndex;
    this.timePlayed = 0;
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
      "fga",
      "fgm",
      "flagrant1",
      "flagrant2",
      "fouls",
      "foulsOffensive",
      "foulsOffensiveCharge",
      "foulsOffensiveOther",
      "foulsShooting",
      "foulsTechnical",
      "fouled",
      "fta",
      "ftm",
      "heaves",
      "isEjected",
      "isInjuredWithNoReturn",
      "isStarter",
      "jumpBallsLost",
      "jumpBallsWon",
      "orb",
      "plusMinus",
      "pts",
      "ptsba",
      "stl",
      "substitutionIn",
      "substitutionOut",
      "timePlayed",
      "tov",
      "tpa",
      "tpm",
    ];
  }

  closePlayerState = () => {
    this.writeToPlayerGame();
    this.writeToPlayerGameGroup();
  };

  writeToPlayerGame = () => {
    // const data: any = {};
    // this.statsToRecord.forEach((statToRecord, i) => {
    //   let value = this[statToRecord];
    //   data[statToRecord] = value;
    // });
    // csvDb.add(this.id.toString(), "player-game", data);
  };

  writeToPlayerGameGroup = () => {
    // const data: any = {};
    // this.statsToRecord.forEach((statToRecord, i) => {
    //   if (statToRecord === "gameId") {
    //     data["gp"] = 1;
    //   } else {
    //     data[statToRecord] = this[statToRecord];
    //   }
    // });
    // csvDb.incrementOneRow(
    //   this.id.toString(),
    //   "player-game-group",
    //   { gameGroupId: this.gameGroupId },
    //   data
    // );
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

  getPlayerFromArrayById = (players: Player[]): Player | null => {
    const index = players.findIndex((player) => player.id === this.id);
    const player = players[index];
    if (player) return player;

    return null;
  };

  handleFatigue = (gameEventData: any, isRestEveryone: boolean) => {
    if (gameEventData.possessionLength) {
      if (
        gameEventData.offPlayersOnCourt &&
        gameEventData.defPlayersOnCourt &&
        gameEventData.offPlayersOnCourt.length > 0 &&
        gameEventData.defPlayersOnCourt.length > 0
      ) {
        const onCourtPlayerIds = [
          ...gameEventData.offPlayersOnCourt.map((player: Player) => player.id),
          ...gameEventData.defPlayersOnCourt.map((player: Player) => player.id),
        ];

        if (onCourtPlayerIds.includes(this.id) && !isRestEveryone) {
          const possessionLength: number = gameEventData.possessionLength;
          const fatigue = possessionLength * (this.fatigueFactor * 0.001);

          this.fatigue += fatigue;
        } else {
          const possessionLength: number = gameEventData.possessionLength;
          const rest = possessionLength * (this.fatigueFactor * 0.001);
          this.fatigue -= rest;
        }
      } else {
        throw new Error(
          "We don't have the required data to handle fatigue in player state"
        );
      }
    }
  };

  incrementFieldForOffAndDefPlayersOnCourt(
    offPlayersOnCourt: Player[],
    defPlayersOnCourt: Player[],
    field: string,
    value: number
  ) {
    [...offPlayersOnCourt, ...defPlayersOnCourt].forEach((player) => {
      if (this.id === player.id) {
        if (Number.isInteger(value)) {
          this[field] += value;
        } else {
          throw new Error("This has to be a number");
        }
      }
    });
  }

  notifyGameEvent(gameEvent: GameEventEnum, gameEventData: unknown): void {
    this.handleFatigue(gameEventData, gameEvent === "TIMEOUT");

    switch (gameEvent) {
      case "2FG_ATTEMPT": {
        const {
          offPlayer0,
          possessionLength,
          offPlayersOnCourt,
          defPlayersOnCourt,
        } = gameEventData as GameEvent2FgAttempt;
        if (offPlayer0.id === this.id) {
          this.fga += 1;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }
      case "2FG_BLOCK": {
        const { offPlayer0, defPlayer0 } = gameEventData as GameEventBlock;
        if (offPlayer0.id === this.id) {
          this.blkd += 1;
        }
        if (defPlayer0.id === this.id) {
          this.blk += 1;
        }
        break;
      }
      case "2FG_MADE": {
        const { offPlayer0, offPlayer1, offPlayersOnCourt, defPlayersOnCourt } =
          gameEventData as GameEvent2FgMade;
        if (offPlayer0.id === this.id) {
          this.fgm += 1;
          this.pts += 2;
        }

        if (offPlayer1 && offPlayer1.id === this.id) {
          this.ast += 1;
        }

        offPlayersOnCourt.forEach((player) => {
          if (player.id === this.id) {
            this.plusMinus += 2;
          }
        });

        defPlayersOnCourt.forEach((player) => {
          if (player.id === this.id) {
            this.plusMinus -= 2;
          }
        });

        break;
      }
      case "2FG_MADE_FOUL": {
        const {
          offPlayer0,
          offPlayer1,
          defPlayer0,
          offPlayersOnCourt,
          defPlayersOnCourt,
        } = gameEventData as GameEvent2FgMadeFoul;
        if (offPlayer0.id === this.id) {
          this.andOne += 1;
          this.fgm += 1;
          this.pts += 2;
        }

        if (defPlayer0.id === this.id) {
          this.fouls += 1;
          this.foulsShooting == 1;
        }

        if (offPlayer1 && offPlayer1.id === this.id) {
          this.ast += 1;
        }

        offPlayersOnCourt.forEach((player) => {
          if (player.id === this.id) {
            this.plusMinus += 2;
          }
        });

        defPlayersOnCourt.forEach((player) => {
          if (player.id === this.id) {
            this.plusMinus -= 2;
          }
        });

        break;
      }
      case "2FG_MISS": {
        break;
      }
      case "2FG_MISS_FOUL": {
        const { defPlayer0 } = gameEventData as GameEvent2FgMissFoul;
        if (defPlayer0.id === this.id) {
          this.fouls += 1;
          this.foulsShooting == 1;
        }
        break;
      }
      case "3FG_ATTEMPT": {
        const {
          offPlayer0,
          defPlayersOnCourt,
          offPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEvent3FgAttempt;
        if (offPlayer0.id === this.id) {
          this.fga += 1;
          this.tpa += 1;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }
      case "3FG_BLOCK": {
        const { offPlayer0, defPlayer0 } = gameEventData as GameEventBlock;
        if (offPlayer0.id === this.id) {
          this.blkd += 1;
        }
        if (defPlayer0.id === this.id) {
          this.blk += 1;
        }
        break;
      }
      case "3FG_MADE": {
        const { offPlayer0, offPlayer1, offPlayersOnCourt, defPlayersOnCourt } =
          gameEventData as GameEvent3FgMade;
        if (offPlayer0.id === this.id) {
          this.fgm += 1;
          this.pts += 3;
          this.tpm += 1;
        }

        if (offPlayer1 && offPlayer1.id === this.id) {
          this.ast += 1;
        }

        offPlayersOnCourt.forEach((player) => {
          if (player.id === this.id) {
            this.plusMinus += 3;
          }
        });

        defPlayersOnCourt.forEach((player) => {
          if (player.id === this.id) {
            this.plusMinus -= 3;
          }
        });

        break;
      }
      case "3FG_MADE_FOUL": {
        const {
          offPlayer0,
          offPlayer1,
          defPlayer0,
          offPlayersOnCourt,
          defPlayersOnCourt,
        } = gameEventData as GameEvent3FgMadeFoul;
        if (offPlayer0.id === this.id) {
          this.andOne += 1;
          this.fgm += 1;
          this.pts += 3;
          this.tpm += 1;
        }

        if (defPlayer0.id === this.id) {
          this.fouls += 1;
          this.foulsShooting == 1;
        }

        if (offPlayer1 && offPlayer1.id === this.id) {
          this.ast += 1;
        }

        offPlayersOnCourt.forEach((player) => {
          if (player.id === this.id) {
            this.plusMinus += 3;
          }
        });

        defPlayersOnCourt.forEach((player) => {
          if (player.id === this.id) {
            this.plusMinus -= 3;
          }
        });

        break;
      }
      case "3FG_MISS": {
        break;
      }
      case "3FG_MISS_FOUL": {
        const { defPlayer0 } = gameEventData as GameEvent3FgMissFoul;
        if (defPlayer0.id === this.id) {
          this.fouls += 1;
          this.foulsShooting == 1;
        }
        break;
      }
      case "DEFENSIVE_REBOUND": {
        const {
          defPlayer0,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventReboundDefensive;
        if (defPlayer0 && defPlayer0.id === this.id) {
          this.drb += 1;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }
      case "EJECTION": {
        const { player0 } = gameEventData as GameEventEjection;

        if (player0.id === this.id) {
          this.isEjected = true;
        }

        break;
      }
      case "FREE_THROW": {
        const { offPlayer0, isMade, offPlayersOnCourt, defPlayersOnCourt } =
          gameEventData as GameEventFreeThrow;

        if (offPlayer0.id === this.id) {
          this.fta += 1;
          if (isMade) {
            this.ftm += 1;
            this.pts += 1;
          }
        }

        if (isMade) {
          offPlayersOnCourt.forEach((player) => {
            if (player.id === this.id) {
              this.plusMinus += 1;
            }
          });

          defPlayersOnCourt.forEach((player) => {
            if (player.id === this.id) {
              this.plusMinus -= 1;
            }
          });
        }

        break;
      }

      case "GAME_END": {
        // this.gameSimStats = this.gatherGameSimStats([
        //   "jumpBallsLost",
        //   "jumpBallsWon",
        //   "pts",
        // ]);
        return;
      }
      case "GAME_START": {
        break;
      }
      case "JUMP_BALL": {
        const {
          offPlayer0,
          defPlayer0,
          isStartSegmentTip,
          possessionLength,
          offPlayersOnCourt,
          defPlayersOnCourt,
        } = gameEventData as GameEventJumpBall;

        if (offPlayer0.id === this.id) {
          this.jumpBallsWon++;
        }
        if (defPlayer0.id === this.id) {
          this.jumpBallsLost++;
        }

        if (!isStartSegmentTip) {
          this.incrementFieldForOffAndDefPlayersOnCourt(
            offPlayersOnCourt,
            defPlayersOnCourt,
            "timePlayed",
            possessionLength
          );
        }

        break;
      }

      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        const {
          defPlayer0,
          defPlayersOnCourt,
          foulType,
          offPlayersOnCourt,
          possessionLength,
          offPlayer0,
        } = gameEventData as GameEventFoulNonShootingDefensive;

        if (defPlayer0.id === this.id) {
          this.fouls += 1;
          if (foulType === "FLAGRANT_1") {
            this.flagrant1++;
          } else if (foulType === "FLAGRANT_2") {
            this.flagrant2++;
          } else if (foulType === "DOUBLE") {
            if (offPlayer0.id === this.id) {
              this.fouls += 1;
            }
          }
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }

      case "FOUL_OFFENSIVE": {
        const {
          defPlayersOnCourt,
          isCharge,
          offPlayer0,
          offPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventFoulOffensive;

        if (offPlayer0.id === this.id) {
          if (isCharge) {
            this.foulsOffensiveCharge++;
          } else {
            this.foulsOffensiveOther++;
          }
          this.foulsOffensive++;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }

      case "FOUL_TECHNICAL": {
        const { player0, player1 } = gameEventData as GameEventFoulTechnical;

        if (player0.id === this.id) {
          this.foulsTechnical++;
        }

        if (player1 && player1.id === this.id) {
          this.foulsTechnical++;
        }

        break;
      }

      case "OFFENSIVE_REBOUND": {
        const {
          offPlayer0,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventReboundOffensive;

        if (offPlayer0 && offPlayer0.id === this.id) {
          this.orb++;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }
      case "POSSESSION_ARROW": {
        break;
      }
      case "SEGMENT_START": {
        break;
      }
      case "SEGMENT_END": {
        const gameSimSegmentData = this.gatherGameSimSegmentData([
          "jumpBallsLost",
          "jumpBallsWon",
          "pts",
        ]);

        this.gameSimSegmentData.push(gameSimSegmentData);

        const { segment, timeSegmentIndex } = gameEventData as GameEventSegment;

        const isHalftimePossible = segment > 1;

        if (isHalftimePossible) {
          const isHalftime = segment / 2 === timeSegmentIndex + 1;
          if (isHalftime) {
            this.fatigue = 0;
            this.isStarter = true;
          }
        }

        break;
      }
      case "STARTING_LINEUP": {
        const { offPlayersOnCourt, defPlayersOnCourt, offTeam } =
          gameEventData as GameEventStartingLineup;

        if (offTeam.id === this.teamId) {
          offPlayersOnCourt.forEach((player) => {
            if (player.id === this.id) {
            }
          });
        } else {
          defPlayersOnCourt.forEach((player) => {
            if (player.id === this.id) {
            }
          });
        }

        break;
      }
      case "STEAL": {
        const {
          offPlayer0,
          defPlayer0,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventSteal;

        if (offPlayer0.id === this.id) {
          this.tov += 1;
        } else if (defPlayer0.id === this.id) {
          this.stl += 1;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }
      case "SUBSTITUTION": {
        const { incomingPlayer, outgoingPlayer } =
          gameEventData as GameEventSubstitution;
        if (incomingPlayer.id === this.id) {
          this.substitutionsIn++;
        }

        if (outgoingPlayer.id === this.id) {
          this.substitutionOut++;
        }

        break;
      }
      case "TURNOVER": {
        const {
          offPlayer0,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventTurnover;
        if (offPlayer0.id === this.id) {
          this.tov += 1;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }
      case "TIMEOUT": {
        break;
      }
      case "VIOLATION": {
        const { offPlayersOnCourt, defPlayersOnCourt, possessionLength } =
          gameEventData as GameEventViolation;

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }
      default: {
        const exhaustiveCheck: never = gameEvent;
        throw new Error(exhaustiveCheck);
      }
    }
  }
}

export default GamePlayerState;