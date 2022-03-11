import { Player } from ".";
import {
  IObserver,
  GameSimStats,
  GameSimStatFields,
  GameEventEnum,
  GameEvent2FgAttempt,
  GameEvent3FgAttempt,
  GameEventDefensiveRebound,
  GameEventJumpBall,
  GameEventStartingLineup,
  GameEventBlock,
  GameEvent2FgMade,
  GameEvent3FgMade,
  GameEventFreeThrow,
  GameEventOffensiveRebound,
  GameEventNonShootingDefensiveFoul,
  GameEvent3FgMadeFoul,
  GameEvent3FgMissFoul,
  GameEvent2FgMissFoul,
  GameEvent2FgMadeFoul,
  GameEventSteal,
  GameEventTurnover,
  GameEventOffensiveFoul,
  GameEventViolation,
} from "../types";

class GamePlayerState implements IObserver {
  [index: string]: any;
  andOne: number;
  ast: number;
  blk: number;
  blkd: number; //num of times blocked
  drb: number;
  dunks: number;
  fatigue: number;
  fga: number;
  fgm: number;
  fta: number;
  ftm: number;
  fouls: number;
  foulsOffensive: number;
  foulsShooting: number;
  gameSimStats: GameSimStats | null;
  gameSimSegmentData: GameSimStats[];
  heaves: number; //shots in front of half court
  id: number;
  inspiration: number;
  jumpBallsLost: number;
  jumpBallsWon: number;
  name: string;
  offensiveFoul: number;
  offensiveFoulCharge: number;
  offensiveFoulOther: number;
  orb: number;
  pga: number; //pts generated by assist
  plusMinus: number;
  position: string;
  pts: number;
  secondsPlayed: number;
  slug: string;
  starter: boolean;
  stl: number;
  teamIndex: number;
  teamId: number;
  timePlayed: number;
  tov: number;
  tpa: number; //3 attempts
  tpm: number; //3 makes

  constructor(
    id: number,
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
    this.fga = 0;
    this.fgm = 0;
    this.fouls = 0;
    this.foulsShooting = 0;
    this.foulsOffensive = 0;
    this.fta = 0;
    this.ftm = 0;
    this.gameSimSegmentData = [];
    this.gameSimStats = null;
    this.heaves = 0;
    this.id = id;
    this.inspiration = 0;
    this.jumpBallsLost = 0;
    this.jumpBallsWon = 0;
    this.name = name;
    this.offensiveFoul = 0;
    this.offensiveFoulCharge = 0;
    this.offensiveFoulOther = 0;
    this.orb = 0;
    this.pga = 0;
    this.plusMinus = 0;
    this.position = position;
    this.pts = 0;
    this.secondsPlayed = 0;
    this.slug = slug;
    this.starter = false;
    this.stl = 0;
    this.teamId = teamId;
    this.teamIndex = teamIndex;
    this.timePlayed = 0;
    this.tov = 0;
    this.tpa = 0;
    this.tpm = 0;
  }

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
          debugger;
          throw new Error("This has to be a number");
        }
      }
    });
  }

  notifyGameEvent(gameEvent: GameEventEnum, gameEventData: unknown): void {
    switch (gameEvent) {
      case "2FG_ATTEMPT": {
        const {
          offPlayer1,
          possessionLength,
          offPlayersOnCourt,
          defPlayersOnCourt,
        } = gameEventData as GameEvent2FgAttempt;
        if (offPlayer1.id === this.id) {
          this.fga += 1;
        }

        if (this.id === 201942) {
          console.log("possessionLength 2fg Attempt", possessionLength);
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
        const { offPlayer1, defPlayer1 } = gameEventData as GameEventBlock;
        if (offPlayer1.id === this.id) {
          this.blkd += 1;
        }
        if (defPlayer1.id === this.id) {
          this.blk += 1;
        }
        break;
      }
      case "2FG_MADE": {
        const { offPlayer1, offPlayer2, offPlayersOnCourt, defPlayersOnCourt } =
          gameEventData as GameEvent2FgMade;
        if (offPlayer1.id === this.id) {
          this.fgm += 1;
          this.pts += 2;
        }

        if (offPlayer2 && offPlayer2.id === this.id) {
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
          offPlayer1,
          offPlayer2,
          defPlayer1,
          offPlayersOnCourt,
          defPlayersOnCourt,
        } = gameEventData as GameEvent2FgMadeFoul;
        if (offPlayer1.id === this.id) {
          this.andOne += 1;
          this.fgm += 1;
          this.pts += 2;
        }

        if (defPlayer1.id === this.id) {
          this.fouls += 1;
          this.foulsShooting == 1;
        }

        if (offPlayer2 && offPlayer2.id === this.id) {
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
        const { defPlayer1 } = gameEventData as GameEvent2FgMissFoul;
        if (defPlayer1.id === this.id) {
          this.fouls += 1;
          this.foulsShooting == 1;
        }
        break;
      }
      case "3FG_ATTEMPT": {
        const {
          offPlayer1,
          defPlayersOnCourt,
          offPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEvent3FgAttempt;
        if (offPlayer1.id === this.id) {
          this.fga += 1;
          this.tpa += 1;
        }

        if (this.id === 201942) {
          console.log("possessionLength 3fg Attempt", possessionLength);
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
        const { offPlayer1, defPlayer1 } = gameEventData as GameEventBlock;
        if (offPlayer1.id === this.id) {
          this.blkd += 1;
        }
        if (defPlayer1.id === this.id) {
          this.blk += 1;
        }
        break;
      }
      case "3FG_MADE": {
        const { offPlayer1, offPlayer2, offPlayersOnCourt, defPlayersOnCourt } =
          gameEventData as GameEvent3FgMade;
        if (offPlayer1.id === this.id) {
          this.fgm += 1;
          this.pts += 3;
          this.tpm += 1;
        }

        if (offPlayer2 && offPlayer2.id === this.id) {
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
          offPlayer1,
          offPlayer2,
          defPlayer1,
          offPlayersOnCourt,
          defPlayersOnCourt,
        } = gameEventData as GameEvent3FgMadeFoul;
        if (offPlayer1.id === this.id) {
          this.andOne += 1;
          this.fgm += 1;
          this.pts += 3;
          this.tpm += 1;
        }

        if (defPlayer1.id === this.id) {
          this.fouls += 1;
          this.foulsShooting == 1;
        }

        if (offPlayer2 && offPlayer2.id === this.id) {
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
        const { defPlayer1 } = gameEventData as GameEvent3FgMissFoul;
        if (defPlayer1.id === this.id) {
          this.fouls += 1;
          this.foulsShooting == 1;
        }
        break;
      }
      case "DEFENSIVE_REBOUND": {
        const {
          defPlayer1,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventDefensiveRebound;
        if (defPlayer1 && defPlayer1.id === this.id) {
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

      case "FREE_THROW": {
        const { offPlayer1, valueToAdd, offPlayersOnCourt, defPlayersOnCourt } =
          gameEventData as GameEventFreeThrow;

        if (offPlayer1.id === this.id) {
          this.fta += 1;
          if (valueToAdd) {
            this.ftm += 1;
            this.pts += 1;
          }
        }

        if (valueToAdd) {
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
        this.gameSimStats = this.gatherGameSimStats([
          "jumpBallsLost",
          "jumpBallsWon",
          "pts",
        ]);
        break;
      }
      case "GAME_START": {
        break;
      }
      case "JUMP_BALL": {
        const {
          offPlayer1,
          defPlayer1,
          isStartSegmentTip,
          possessionLength,
          offPlayersOnCourt,
          defPlayersOnCourt,
        } = gameEventData as GameEventJumpBall;

        if (offPlayer1.id === this.id) {
          this.jumpBallsWon++;
        }
        if (defPlayer1.id === this.id) {
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
          defPlayer1,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventNonShootingDefensiveFoul;

        if (defPlayer1.id === this.id) {
          this.fouls += 1;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }

      case "OFFENSIVE_FOUL": {
        const {
          isCharge,
          offPlayer1,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventOffensiveFoul;

        if (offPlayer1.id === this.id) {
          if (isCharge) {
            this.offensiveFoulCharge++;
          } else {
            this.offensiveFoulOther++;
          }
          this.offensiveFoul++;
        }

        this.incrementFieldForOffAndDefPlayersOnCourt(
          offPlayersOnCourt,
          defPlayersOnCourt,
          "timePlayed",
          possessionLength
        );

        break;
      }

      case "OFFENSIVE_REBOUND": {
        const {
          offPlayer1,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventOffensiveRebound;

        if (offPlayer1 && offPlayer1.id === this.id) {
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
      case "POSSESSION_ARROW_WON": {
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

        break;
      }
      case "STARTING_LINEUP": {
        const { offPlayersOnCourt, defPlayersOnCourt, offTeam } =
          gameEventData as GameEventStartingLineup;

        if (offTeam.id === this.teamId) {
          offPlayersOnCourt.forEach((player) => {
            if (player.id === this.id) {
              this.starter = true;
            }
          });
        } else {
          defPlayersOnCourt.forEach((player) => {
            if (player.id === this.id) {
              this.starter = true;
            }
          });
        }

        break;
      }
      case "STEAL": {
        const {
          offPlayer1,
          defPlayer1,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventSteal;

        if (offPlayer1.id === this.id) {
          this.tov += 1;
        } else if (defPlayer1.id === this.id) {
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
      case "TURNOVER": {
        const {
          offPlayer1,
          offPlayersOnCourt,
          defPlayersOnCourt,
          possessionLength,
        } = gameEventData as GameEventTurnover;
        if (offPlayer1.id === this.id) {
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
      case "VIOLATION": {
        const { offPlayersOnCourt, defPlayersOnCourt, possessionLength } =
          gameEventData as GameEventViolation;

        if (this.id === 201942) {
          console.log("violation", possessionLength);
        }
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
