import { errors, getTypeGuardSafeData, isTypeGuardSafeObj } from "../utils";
import { GameLog, GameTeamState, GamePlayerState, Player } from ".";
import random from "random";
import { sample } from "simple-statistics";
import {
  FoulPenaltySettings,
  GameEventData,
  GameEventEnum,
  GameEventPossessionOutcomes,
  GameSimInit,
  GameSimPlayerFields,
  GameSimPlayerStat,
  GameSimTeams,
  GameSimTeamStat,
  GameType,
  GameTypePoints,
  GameTypeTime,
  IObserver,
  OvertimeTypeTime,
  PlayersOnCourt,
  PossessionTossupMethodEnum,
  ShotTypes,
  TeamIndex,
  TurnoverTypes,
  TwoPlayers,
} from "../types";
import {
  get2or3Pointer,
  get2PointShotType,
  get3PointShotType,
  getFgType,
  getPossessionLength,
  getPossessionOutcome,
  getShotXByShotType,
  getShotYByShotType,
  getTurnoverType,
  getViolationType,
} from "../utils/probabilities";
import Socket from "../Socket";
import GameEventStore from "./GameEventStore";

class GameSim {
  private d: TeamIndex;
  private foulPenaltySettings: FoulPenaltySettings;
  private fullSegmentTime: number | undefined;
  private gameType: GameType;
  private id: number;
  private isGameTied: boolean;
  private isOvertime: boolean;
  private isShootout: boolean;
  private neutralFloor: boolean;
  private o: TeamIndex;
  private observers: IObserver[];
  private playersOnCourt: PlayersOnCourt;
  private possessionArrow: TeamIndex;
  private possessionTossupMethod: PossessionTossupMethodEnum;
  private playerStates: GameSimPlayerStat;
  private socket: Socket;
  private teams: GameSimTeams;
  private teamStates: GameSimTeamStat;
  private timeSegmentIndex: number | undefined;
  private timeSegments: number[] | undefined;

  constructor({
    foulPenaltySettings,
    gameType,
    id,
    neutralFloor = false,
    possessionTossupMethod,
    socket,
    teams,
    timeouts,
  }: GameSimInit) {
    // INIT GAME STATE

    this.d = 1;
    this.foulPenaltySettings = foulPenaltySettings;
    this.id = id;
    this.isGameTied = false;
    this.isOvertime = false;
    this.isShootout = false;
    this.neutralFloor = neutralFloor;
    this.o = 0;
    this.observers = [];
    this.teams = teams;
    this.possessionArrow = 0;
    this.possessionTossupMethod = possessionTossupMethod;
    this.gameType = gameType;
    this.teamStates = {};
    this.playerStates = {};
    this.socket = socket;
    this.teams.forEach((team, teamIndex) => {
      const teamState = new GameTeamState(team.id, timeouts);
      this.teamStates[team.id] = teamState;
      this.observers.push(teamState);

      team.players.forEach((player) => {
        player.normalizePlayerData();

        const playerState = new GamePlayerState(player.id, team.id, teamIndex);
        this.playerStates[player.id] = playerState;
        this.observers.push(playerState);
      });
    });

    // INIT OTHER OBSERVERS
    this.observers.push(new GameLog(socket));
    this.observers.push(
      new GameEventStore({
        gameId: id,
        gameType: gameType.type,
        neutralFloor,
        team0: teams[0].id,
        team1: teams[1].id,
      })
    );

    //START MANIPULATING GAME STATE

    //STARTERS
    this.playersOnCourt = [
      [...teams[0].getRandomPlayers(5)],
      [...teams[1].getRandomPlayers(5)],
    ];

    this.notifyObservers("STARTING_LINEUP", {});

    if (isTypeGuardSafeObj(GameTypeTime, gameType)) {
      this.gameType = getTypeGuardSafeData(GameTypeTime, gameType);
    } else if (isTypeGuardSafeObj(GameTypePoints, gameType)) {
      this.gameType = getTypeGuardSafeData(GameTypePoints, gameType);
    } else {
      throw new Error("Invalid gameType object");
    }

    if (this.gameType.type === "time") {
      const gameType = this.gameType as GameTypeTime;
      this.timeSegments = [];
      this.timeSegmentIndex = 0;
      let counter = gameType.segment;

      this.fullSegmentTime = gameType.totalTime / gameType.segment;

      while (counter > 0) {
        this.timeSegments.push(this.fullSegmentTime);
        counter--;
      }
    }
  }

  checkIfSimPossessionIsOver = (): boolean => {
    if (this.isGameTied) {
      return true;
    } else if (this.isShootout) {
      return true;
    } else if (this.gameType.type === "points") {
      const team0Pts = this.teamStates[this.teams[0].id].pts;
      const team1Pts = this.teamStates[this.teams[1].id].pts;

      const gameType = this.gameType as GameTypePoints;

      if (team0Pts >= gameType.totalPts || team1Pts >= gameType.totalPts) {
        if (gameType.winBy) {
          const ptDifferential = Math.abs(team0Pts - team1Pts);
          if (ptDifferential >= gameType.winBy) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    } else if (this.gameType.type === "time") {
      if (this.timeSegments && this.timeSegments.length > 0) {
        if (this.timeSegments.some((el) => el !== 0)) {
          return false;
        }
      } else {
        throw new Error(errors.noTimeSegments);
      }
    }

    return true;
  };

  checkIfGameTied = (): boolean => {
    const team0Pts = this.teamStates[this.teams[0].id].pts;
    const team1Pts = this.teamStates[this.teams[1].id].pts;
    return team0Pts === team1Pts;
  };

  checkIfSimShootoutIsOver = (): boolean => {
    return true;
  };

  getGameTeamStates = (): [GameTeamState, GameTeamState] => {
    return [
      this.teamStates[this.teams[0].id],
      this.teamStates[this.teams[1].id],
    ];
  };

  getPlayerTotal = ({
    player,
    fields,
  }: {
    fields?: GameSimPlayerFields;
    player: Player;
  }): number => {
    //TODO: Handle the case where numbers are negative
    let total = 0;

    fields?.positivePlayerRatingFields?.forEach((field) => {
      let fieldValue = player[field];
      total += fieldValue;
    });

    fields?.positivePlayerStateFields?.forEach((field) => {
      total += this.playerStates[player.id][field];
    });

    fields?.negativePlayerRatingFields?.forEach((field) => {
      let fieldValue = player[field];
      total += fieldValue;
    });

    fields?.negativePlayerStateFields?.forEach((field) => {
      total += this.playerStates[player.id][field];
    });

    return total;
  };

  headToHead = ({
    players,
    fields,
  }: {
    players: TwoPlayers;
    fields: GameSimPlayerFields;
  }): boolean => {
    const [team0Player, team1Player] = players;

    let team0PlayerTotal = this.getPlayerTotal({
      player: team0Player,
      fields,
    });

    let team1PlayerTotal = this.getPlayerTotal({
      player: team1Player,
      fields,
    });

    let probability = 0.5;
    if (team0PlayerTotal > team1PlayerTotal) {
      probability -= 1 - team1PlayerTotal / team0PlayerTotal;
    } else if (team0PlayerTotal < team1PlayerTotal) {
      probability += 1 - team0PlayerTotal / team1PlayerTotal;
    }

    //lower probability goes to team 0, higher probablity goes to team 1
    const pickWinner = random.bernoulli(probability);

    //did team 0 win?
    return pickWinner() === 0;
  };

  isSegmentStart = (): boolean => {
    if (this.timeSegments && this.fullSegmentTime !== undefined) {
      const firstFullSegmentTimeIndex = this.timeSegments.findIndex(
        (ts) => ts === this.fullSegmentTime
      );

      if (
        firstFullSegmentTimeIndex === 0 ||
        this.timeSegments[firstFullSegmentTimeIndex - 1] === 0
      ) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  };

  jumpBall = ({ players }: { players: TwoPlayers }) => {
    //TODO: violation when a player steals the tip, rejumps
    //TODO: who does ball go to?

    const isTeam0Winner = this.headToHead({
      players,
      fields: {
        positivePlayerRatingFields: ["height"],
      },
    });

    return isTeam0Winner;
  };

  notifyObservers = (gameEvent: GameEventEnum, data?: GameEventData) => {
    const defTeam = this.teams[this.d];
    const offTeam = this.teams[this.o];
    const offPlayersOnCourt = this.playersOnCourt[this.o];
    const defPlayersOnCourt = this.playersOnCourt[this.d];

    this.observers.forEach((observer) =>
      observer.notifyGameEvent(gameEvent, {
        defPlayersOnCourt,
        defTeam,
        offPlayersOnCourt,
        offTeam,
        ...data,
      })
    );
  };

  pickRandomPlayerOnCourt = (): Player => {
    const [randomPlayer] = sample(
      [...this.playersOnCourt[0], ...this.playersOnCourt[1]],
      1,
      () => random.float(0, 1)
    );

    return randomPlayer;
  };

  pickRandomPlayerOnCourtByTeam = (teamIndex: TeamIndex): Player => {
    const [randomPlayer] = sample(this.playersOnCourt[teamIndex], 1, () =>
      random.float(0, 1)
    );

    return randomPlayer;
  };

  pickRandomPlayerOnCourtByTeamExcludeOne = (
    teamIndex: TeamIndex,
    excludePlayer: Player
  ): Player => {
    const [randomPlayer] = sample(
      this.playersOnCourt[teamIndex].filter(
        (player) => excludePlayer.id !== player.id
      ),
      1,
      () => random.float(0, 1)
    );

    return randomPlayer;
  };

  pickPlayerOnCourtByTeamAndFields = (
    teamIndex: TeamIndex,
    fields: GameSimPlayerFields
  ): Player => {
    const playerTotals: number[] = [];

    this.playersOnCourt[teamIndex].forEach((player, i) => {
      const total = this.getPlayerTotal({
        player,
        fields,
      });
      playerTotals.push(total);
    });

    const max = playerTotals.reduce((m, n) => Math.max(m, n));
    const maxIndexes = [...playerTotals.keys()].filter(
      (i) => playerTotals[i] === max
    );

    if (maxIndexes.length === 1) {
      return this.playersOnCourt[teamIndex][maxIndexes[0]];
    } else {
      const tiedTotalPlayers: Player[] = [];

      maxIndexes.forEach((maxIndex) => {
        tiedTotalPlayers.push(this.playersOnCourt[teamIndex][maxIndex]);
      });

      const [randomPlayer] = sample(tiedTotalPlayers, 1, () =>
        random.float(0, 1)
      );

      return randomPlayer;
    }
  };

  simFreeThrows = ({
    bonus,
    offPlayer1,
    totalShots,
  }: {
    bonus?: boolean;
    totalShots: 1 | 2 | 3;
    offPlayer1: Player;
  }): boolean => {
    let isPossessionEventsComplete = true;
    let i = 0;
    do {
      const isLastShot = totalShots === i + 1;
      const shotMade = random.bool();
      const shotNumber = i + 1;
      const valueToAdd = shotMade ? 1 : 0;

      this.notifyObservers("FREE_THROW", {
        bonus,
        offPlayer1,
        shotNumber,
        totalShots,
        valueToAdd,
      });

      if (isLastShot && !shotMade) {
        const isReboundedByOffense = random.bool();
        if (isReboundedByOffense) {
          const offPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.o);
          this.notifyObservers("OFFENSIVE_REBOUND", {
            offPlayer1,
          });
          isPossessionEventsComplete = false;
        } else {
          //isReboundedByDefense
          const defPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers("DEFENSIVE_REBOUND", {
            defPlayer1,
          });
        }
      }

      i++;
    } while (i !== totalShots);

    return isPossessionEventsComplete;
  };

  simPossession = () => {
    console.log("----------------------------");
    const isSegmentStart = this.isSegmentStart();

    if (
      isSegmentStart &&
      this.gameType &&
      this.timeSegmentIndex !== undefined
    ) {
      const gameType = this.gameType as GameTypeTime;
      this.notifyObservers("SEGMENT_START", {
        segment: gameType.segment,
        timeSegmentIndex: this.timeSegmentIndex,
      });
      const isFirstSegment = this.timeSegmentIndex === 0;
      if (isFirstSegment || this.isOvertime) {
        const players: [Player, Player] = [
          this.pickPlayerOnCourtByTeamAndFields(0, {
            positivePlayerRatingFields: ["height"],
          }),
          this.pickPlayerOnCourtByTeamAndFields(1, {
            positivePlayerRatingFields: ["height"],
          }),
        ];

        const isTeam0Winner = this.jumpBall({
          players,
        });

        this.o = isTeam0Winner ? 0 : 1;
        this.d = isTeam0Winner ? 1 : 0;

        this.possessionArrow = this.d;

        const losingPlayer = players[this.d];
        const winningPlayer = players[this.o];

        this.notifyObservers("JUMP_BALL", {
          defPlayer1: losingPlayer,
          offPlayer1: winningPlayer,
        });
      }
    }

    let isPossessionEventsComplete = false;
    let isEndOfSegment = false;

    while (!isPossessionEventsComplete) {
      const simPossessionEventsData = this.simPossessionEvents();
      isPossessionEventsComplete =
        simPossessionEventsData.isPossessionEventsComplete;
      isEndOfSegment = simPossessionEventsData.isEndOfSegment;
    }

    if (
      this.gameType.type === "time" &&
      this.timeSegments &&
      this.timeSegmentIndex !== undefined
    ) {
      const gameType = this.gameType as GameTypeTime;

      if (isEndOfSegment) {
        const isLastSegment =
          this.timeSegments[this.timeSegments.length - 1] === 0;

        if (isLastSegment) {
          if (this.checkIfGameTied()) {
            if (gameType.overtimeOptions) {
              if (gameType.overtimeOptions.type === "time") {
                const overtimeOptions =
                  gameType.overtimeOptions as OvertimeTypeTime;

                if (!this.isOvertime) {
                  this.isOvertime = true;
                }

                this.timeSegments.push(overtimeOptions.overtimeLength);
                this.timeSegmentIndex++;
              } else if (gameType.overtimeOptions.type === "shootout") {
                this.isShootout = true;
              } else {
                throw new Error(
                  "This is a type of overtime we don't know how to deal with!"
                );
              }
            } else {
              this.isGameTied = true;
            }
          }
        } else {
          this.notifyObservers("SEGMENT_END", {
            segment: gameType.segment,
            timeSegmentIndex: this.timeSegmentIndex,
          });
          this.timeSegmentIndex++;
        }
      }
    } else if (this.gameType.type === "points") {
    } else {
      throw new Error("Ut oh! Don't know what to do");
    }

    if (!this.isGameTied && !this.isShootout) {
      //Swap offense/defense team with the Bitwise XOR Operator: https://dmitripavlutin.com/swap-variables-javascript/#4-bitwise-xor-operator
      this.o = this.o ^ this.d;
      this.d = this.o ^ this.d;
      this.o = this.o ^ this.d;
    }
  };

  simPossessionEvents = (): {
    isEndOfSegment: boolean;
    isPossessionEventsComplete: boolean;
  } => {
    const outcome = getPossessionOutcome();
    let isEndOfSegment = false;
    let isPossessionEventsComplete = true;
    let lengthOfPossession =
      outcome === "FIELD_GOAL"
        ? getPossessionLength("fg")
        : outcome === "JUMP_BALL"
        ? getPossessionLength("general")
        : outcome === "FOUL_DEFENSIVE_NON_SHOOTING"
        ? getPossessionLength("general")
        : outcome === "OFFENSIVE_FOUL"
        ? getPossessionLength("foul")
        : outcome === "TURNOVER"
        ? getPossessionLength("turnover")
        : getPossessionLength("violation");

    if (
      this.gameType.type === "time" &&
      this.timeSegments &&
      this.timeSegmentIndex !== undefined
    ) {
      const timeRemaining = this.timeSegments[this.timeSegmentIndex];

      if (timeRemaining <= 30) {
        lengthOfPossession = timeRemaining;
        isEndOfSegment = true;
      }

      this.timeSegments[this.timeSegmentIndex] -= lengthOfPossession;
    }

    switch (outcome) {
      case "FIELD_GOAL": {
        //average across all offensive players
        //figure out shot type
        //p1 ar 0.25 c3 0.35
        //p2 ar 0.27 c3 0.37
        //p3 ar 0.11 c3 0.31
        //p4 ar 0.31 c3 0.31
        //p5 ar 0.41 c3 0.31

        //      0.27    0.33

        //defense

        //p1 ar 0.25 c3 0.35
        //p2 ar 0.27 c3 0.37
        //p3 ar 0.11 c3 0.31
        //p4 ar 0.31 c3 0.31
        //p5 ar 0.41 c3 0.31

        //      0.21    0.39

        //0.23  0.36 select shot type using these probabilities, could build in a weights here

        //have my shot type
        // pick a player
        // sum the percent, then divide by the sum
        // sum array of values and then divide by the sum
        // otherwise rely on general data, if i have a large enough sample go player xy
        // 40 observations

        //is made on shot type player

        const { isAnd1, isAssist, isBlock, isMade, isPutback, shotType } =
          getFgType();
        console.log("shotType", shotType);
        const offPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.o);
        const pts = get2or3Pointer(shotType);
        const x = getShotXByShotType(shotType);
        const y = getShotYByShotType(shotType);
        this.notifyObservers(`${pts}FG_ATTEMPT`, {
          isPutback,
          offPlayer1,
          shotType,
          shotValue: pts,
          x,
          y,
        });

        const isFouled = isAnd1;

        if (isMade && isFouled) {
          const assistingPlayer = isAssist
            ? this.pickRandomPlayerOnCourtByTeamExcludeOne(this.o, offPlayer1)
            : null;
          const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers(`${pts}FG_MADE_FOUL`, {
            defPlayer1: foulingPlayer,
            foulPenaltySettings: this.foulPenaltySettings,
            isPutback,
            offPlayer1,
            offPlayer2: assistingPlayer,
            segment:
              this.timeSegmentIndex !== undefined
                ? this.timeSegmentIndex
                : undefined,
            shotValue: pts,
            shotType,
            valueToAdd: pts,
            x,
            y,
          });

          isPossessionEventsComplete = this.simFreeThrows({
            offPlayer1,
            totalShots: 1,
          });
        } else if (!isMade && isFouled) {
          const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers(`${pts}FG_MISS_FOUL`, {
            defPlayer1: foulingPlayer,
            foulPenaltySettings: this.foulPenaltySettings,
            offPlayer1,
            segment:
              this.timeSegmentIndex !== undefined
                ? this.timeSegmentIndex
                : undefined,
            shotType,
            shotValue: pts,
            x,
            y,
          });
          isPossessionEventsComplete = this.simFreeThrows({
            totalShots: pts,
            offPlayer1,
          });
        } else if (isMade && !isFouled) {
          const assistingPlayer = isAssist
            ? this.pickRandomPlayerOnCourtByTeamExcludeOne(this.o, offPlayer1)
            : null;
          this.notifyObservers(`${pts}FG_MADE`, {
            isPutback,
            offPlayer1,
            offPlayer2: assistingPlayer,
            shotType,
            shotValue: pts,
            valueToAdd: pts,
            x,
            y,
          });
        } else {
          this.notifyObservers(`${pts}FG_MISS`, {
            offPlayer1,
            shotType,
            shotValue: pts,
            x,
            y,
          });

          const isOffensiveRebound = random.bool();
          let reboundingPlayer: Player | undefined;
          const isTeamRebound = random.bool();

          if (isBlock) {
            const blockingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
            this.notifyObservers(`${pts}FG_BLOCK`, {
              defPlayer1: blockingPlayer,
              offPlayer1,
              shotValue: pts,
              valueToAdd: 1,
            });
          }

          if (isOffensiveRebound) {
            if (!isTeamRebound) {
              reboundingPlayer = this.pickRandomPlayerOnCourtByTeam(this.o);
            }

            this.notifyObservers(`OFFENSIVE_REBOUND`, {
              offensivePlayer1: reboundingPlayer,
              valueToAdd: 1,
            });

            isPossessionEventsComplete = false;
          } else {
            //isDefensiveRebound
            if (!isTeamRebound) {
              reboundingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
            }

            this.notifyObservers(`DEFENSIVE_REBOUND`, {
              defPlayer1: reboundingPlayer,
              valueToAdd: 1,
            });
          }
        }
        break;
      }
      case "JUMP_BALL": {
        switch (this.possessionTossupMethod) {
          case "jumpBall": {
            const offensePlayer = this.pickRandomPlayerOnCourtByTeam(this.o);
            const defensePlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
            const players: [Player, Player] = [offensePlayer, defensePlayer];

            const isOffenseWinner = this.jumpBall({
              players,
            });

            //initialize winners as offense
            let losingPlayer = defensePlayer;
            let losingTeam = this.teams[this.d];
            let winningPlayer = offensePlayer;
            let winningTeam = this.teams[this.o];

            if (isOffenseWinner) {
              isPossessionEventsComplete = false;
            } else {
              //isDefenseWinner
              losingPlayer = offensePlayer;
              losingTeam = this.teams[this.o];
              winningPlayer = defensePlayer;
              winningTeam = this.teams[this.d];
            }

            this.notifyObservers("JUMP_BALL", {
              defTeam: losingTeam,
              defPlayer1: losingPlayer,
              offPlayer1: winningPlayer,
              offTeam: winningTeam,
            });

            break;
          }
          case "possessionArrow": {
            if (this.possessionArrow === this.o) {
              this.notifyObservers("POSSESSION_ARROW_WON", {});
              this.possessionArrow = this.d;
              isPossessionEventsComplete = false;
            } else {
              const defPlayersOnCourt = this.playersOnCourt[this.d];
              const offPlayersOnCourt = this.playersOnCourt[this.d];
              const offTeam = this.teams[this.d];
              const defTeam = this.teams[this.o];
              this.notifyObservers("POSSESSION_ARROW_WON", {
                defPlayersOnCourt,
                defTeam,
                offPlayersOnCourt,
                offTeam,
              });
              this.possessionArrow = this.o;
            }

            break;
          }
          default:
            const exhaustiveCheck: never = this.possessionTossupMethod;
            throw new Error(exhaustiveCheck);
        }
        break;
      }
      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        const offPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.o);
        const defTeam = this.teams[this.d];
        const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
        isPossessionEventsComplete = false;

        this.notifyObservers("FOUL_DEFENSIVE_NON_SHOOTING", {
          defPlayer1: foulingPlayer,
          foulPenaltySettings: this.foulPenaltySettings,
          offPlayer1,
          segment:
            this.timeSegmentIndex !== undefined
              ? this.timeSegmentIndex
              : undefined,
        });

        if (this.teamStates[defTeam.id].penalty) {
          isPossessionEventsComplete = this.simFreeThrows({
            bonus: true,
            offPlayer1,
            totalShots: 2,
          });
        }
        break;
      }

      case "OFFENSIVE_FOUL": {
        const offPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.o);
        const isCharge = random.bool();
        this.notifyObservers("OFFENSIVE_FOUL", {
          isCharge,
          offPlayer1,
        });

        break;
      }

      case "TURNOVER": {
        const offPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.o);
        const team = this.teams[this.o];
        const turnoverType = getTurnoverType();

        if (turnoverType === "BAD_PASS" || turnoverType === "LOST_BALL") {
          const defPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers("STEAL", {
            defPlayer1,
            offPlayer1,
            team,
            turnoverType,
            valueToAdd: 1,
          });
        } else {
          const possibleTurnoverTypes = TurnoverTypes.options;
          const turnoverType = sample(possibleTurnoverTypes, 1, () =>
            random.float(0, 1)
          )[0];
          this.notifyObservers("TURNOVER", {
            offPlayer1,
            turnoverType,
            valueToAdd: 1,
          });
        }
        break;
      }
      case "VIOLATION": {
        const violationType = getViolationType();

        this.notifyObservers("VIOLATION", {
          violationType,
        });

        break;
      }
      default:
        const exhaustiveCheck: never = outcome;
        throw new Error(exhaustiveCheck);
    }

    return { isEndOfSegment, isPossessionEventsComplete };

    // is defensive foul, shot, or turnover

    // DEFENSIVE FOUL
    // Was shooting?
    //    Yes, was 2, 3, 4pter?
    // Was in bonus?
    //  Free throws - 1-and-1 or 2

    //FIELD_GOAL
    // Was 2, 3, 4pter?
    // What type of shot?
    // Was made?
    // Was missed?
    //    Was it blocked?

    //TURNOVER

    //FIELD_GOAL_MADE
    //FIELD_GOAL_MISSED
    //FREE_THROW
    //REBOUND
    //TURNOVER
    //FOUL
    //VIOLATION
    //SUBSTITUTION
    //TIMEOUT
    //JUMP_BALL - NOT INITIAL - NBA POSSESSION TOSSUP
    //EJECTION
  };

  simShootout = () => {
    console.log("Simming shootout");
  };

  start = (): Promise<void> => {
    this.notifyObservers("GAME_START");

    let simPossessionIsOver = false;

    while (!simPossessionIsOver) {
      this.simPossession();

      simPossessionIsOver = this.checkIfSimPossessionIsOver();
    }

    if (this.isShootout) {
      let simShootoutIsOver = false;

      while (!simShootoutIsOver) {
        this.simShootout();

        simShootoutIsOver = this.checkIfSimShootoutIsOver();
      }
    }

    this.notifyObservers("GAME_END");

    console.log(this.teamStates);

    return Promise.resolve();
  };
}

export default GameSim;
