import { errors, getTypeGuardSafeData, isTypeGuardSafeObj } from "../utils";
import { GameLog, GameTeamState, GamePlayerState, Player } from ".";
import random from "random";
import { sample } from "simple-statistics";
import {
  FoulPenaltySettings,
  GameEventData,
  GameEventEnum,
  GameEventPossessionEventOutcomes,
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
  getShotXByShotType,
  getShotYByShotType,
} from "../utils/probabilities";
import Socket from "../Socket";

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

        const playerState = new GamePlayerState(player.id, teamIndex);
        this.playerStates[player.id] = playerState;
        this.observers.push(playerState);
      });
    });

    // INIT OTHER OBSERVERS
    this.observers.push(new GameLog(socket));

    //START MANIPULATING GAME STATE

    //STARTERS
    this.playersOnCourt = [
      [...teams[0].getRandomPlayers(5)],
      [...teams[1].getRandomPlayers(5)],
    ];

    this.notifyObservers("STARTING_LINEUP", {
      playersOnCourt: this.playersOnCourt,
      teams: this.teams,
    });

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

  jumpBall = ({ players }: { players: TwoPlayers; isInitialTip: boolean }) => {
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
    this.observers.forEach((observer) =>
      observer.notifyGameEvent(gameEvent, data)
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

    console.log("playerTotals", playerTotals);
    console.log("this", this);

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
    totalShots,
    player,
  }: {
    bonus?: boolean;
    totalShots: 1 | 2 | 3;
    player: Player;
  }): boolean => {
    let isPossessionEventsComplete = true;
    let i = 0;
    do {
      const isLastShot = totalShots === i + 1;
      const shotMade = random.bool();
      const shotNumber = i + 1;

      this.notifyObservers("FREE_THROW", {
        bonus,
        player,
        shotMade,
        shotNumber,
        team: this.teams[this.o],
        totalShots,
      });

      if (isLastShot && !shotMade) {
        const isReboundedByOffense = random.bool();
        if (isReboundedByOffense) {
          const player = this.pickRandomPlayerOnCourtByTeam(this.o);
          const team = this.teams[this.o];
          this.notifyObservers("OFFENSIVE_REBOUND", { player, team });
          isPossessionEventsComplete = false;
        } else {
          //isReboundedByDefense
          const player = this.pickRandomPlayerOnCourtByTeam(this.d);
          const team = this.teams[this.d];
          this.notifyObservers("DEFENSIVE_REBOUND", { player, team });
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
          isInitialTip: true,
          players,
        });

        this.o = isTeam0Winner ? 0 : 1;
        this.d = isTeam0Winner ? 1 : 0;

        this.possessionArrow = this.d;

        const losingPlayer = players[this.d];
        const winningPlayer = players[this.o];
        const winningTeam = this.teams[this.o];

        this.notifyObservers("JUMP_BALL_WON", {
          isInitialTip: true,
          losingPlayer,
          winningPlayer,
          team: winningTeam,
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
    let isEndOfSegment = false;
    let isPossessionEventsComplete = true;
    let lengthOfPossession =
      Math.round((random.float(1, 30) + Number.EPSILON) * 100) / 100;

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

    const outcome = sample(GameEventPossessionEventOutcomes.options, 1, () =>
      random.float(0, 1)
    )[0];
    const offensiveTeam = this.teams[this.o];
    const defensiveTeam = this.teams[this.d];

    switch (outcome) {
      case "NON_SHOOTING_DEFENSIVE_FOUL": {
        const player = this.pickRandomPlayerOnCourtByTeam(this.o);
        const offensiveTeam = this.teams[this.o];
        const defensiveTeam = this.teams[this.d];
        const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
        isPossessionEventsComplete = false;

        this.notifyObservers("NON_SHOOTING_DEFENSIVE_FOUL", {
          player,
          team: offensiveTeam,
          foulingPlayer,
          segment:
            this.timeSegmentIndex !== undefined
              ? this.timeSegmentIndex
              : undefined,
          foulPenaltySettings: this.foulPenaltySettings,
        });

        if (this.teamStates[defensiveTeam.id].penalty) {
          isPossessionEventsComplete = this.simFreeThrows({
            bonus: true,
            totalShots: 2,
            player,
          });
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
              isInitialTip: true,
              players,
            });

            //initialize winners as offense
            let losingPlayer = defensePlayer;
            let winningPlayer = offensePlayer;
            let winningTeam = this.teams[this.o];

            if (isOffenseWinner) {
              isPossessionEventsComplete = false;
            } else {
              //isDefenseWinner
              losingPlayer = offensePlayer;
              winningPlayer = defensePlayer;
              winningTeam = this.teams[this.d];
            }

            this.notifyObservers("JUMP_BALL_WON", {
              isInitialTip: false,
              losingPlayer,
              winningPlayer,
              team: winningTeam,
            });

            break;
          }
          case "possessionArrow": {
            if (this.possessionArrow === this.o) {
              const team = this.teams[this.o];
              this.notifyObservers("POSSESSION_ARROW_WON", { team });
              this.possessionArrow = this.d;
              isPossessionEventsComplete = false;
            } else {
              const team = this.teams[this.d];
              this.notifyObservers("POSSESSION_ARROW_WON", { team });
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
      case "SHOT": {
        const player = this.pickRandomPlayerOnCourtByTeam(this.o);
        const pts = get2or3Pointer();
        let shotType: ShotTypes =
          pts === 2 ? get2PointShotType() : get3PointShotType();
        const x = getShotXByShotType(shotType);
        const y = getShotYByShotType(shotType);
        this.notifyObservers(`${pts}FG_ATTEMPT`, {
          player,
          team: offensiveTeam,
          x,
          y,
          shotType,
        });

        const isMade = random.bool();
        const isFouled = random.bool();

        if (isMade && isFouled) {
          const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers(`${pts}FG_MADE_FOUL`, {
            player,
            team: offensiveTeam,
            foulingPlayer,
            segment:
              this.timeSegmentIndex !== undefined
                ? this.timeSegmentIndex
                : undefined,
            foulPenaltySettings: this.foulPenaltySettings,
            x,
            y,
            shotType,
          });

          isPossessionEventsComplete = this.simFreeThrows({
            totalShots: 1,
            player,
          });
        } else if (!isMade && isFouled) {
          const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers(`${pts}FG_MISS_FOUL`, {
            player,
            team: offensiveTeam,
            foulingPlayer,
            segment:
              this.timeSegmentIndex !== undefined
                ? this.timeSegmentIndex
                : undefined,
            foulPenaltySettings: this.foulPenaltySettings,
            x,
            y,
            shotType,
          });
          isPossessionEventsComplete = this.simFreeThrows({
            totalShots: pts,
            player,
          });
        } else if (isMade && !isFouled) {
          this.notifyObservers(`${pts}FG_MADE`, {
            player,
            team: offensiveTeam,
            x,
            y,
            shotType,
          });
        } else {
          this.notifyObservers(`${pts}FG_MISS`, {
            player,
            team: offensiveTeam,
            x,
            y,
            shotType,
          });

          const isBlock = random.bool();
          const isOffensiveRebound = random.bool();
          let reboundingPlayer: Player | undefined;
          const isTeamRebound = random.bool();

          if (isBlock) {
            const blockingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
            this.notifyObservers(`${pts}FG_BLOCK`, {
              player,
              team: offensiveTeam,
              blockingPlayer,
            });
          }

          if (isOffensiveRebound) {
            if (!isTeamRebound) {
              reboundingPlayer = this.pickRandomPlayerOnCourtByTeam(this.o);
            }

            this.notifyObservers(`OFFENSIVE_REBOUND`, {
              player: reboundingPlayer,
              team: offensiveTeam,
            });

            isPossessionEventsComplete = false;
          } else {
            //isDefensiveRebound
            if (!isTeamRebound) {
              reboundingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
            }

            this.notifyObservers(`DEFENSIVE_REBOUND`, {
              player: reboundingPlayer,
              team: defensiveTeam,
            });
          }
        }
        break;
      }
      case "TURNOVER": {
        const player = this.pickRandomPlayerOnCourtByTeam(this.o);
        const team = this.teams[this.o];
        const isSteal = random.boolean();

        if (isSteal) {
          const stealingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers("STEAL", { player, team, stealingPlayer });
        } else {
          const possibleTurnoverTypes = TurnoverTypes.options;
          const turnoverType = sample(possibleTurnoverTypes, 1, () =>
            random.float(0, 1)
          )[0];
          this.notifyObservers("TURNOVER", { player, team, turnoverType });
        }
        break;
      }
      case "VIOLATION": {
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

    //SHOT
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

    console.log("Reacted the end");

    return Promise.resolve();
  };
}

export default GameSim;
