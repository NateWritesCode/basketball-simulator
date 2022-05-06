import { errors, getTypeGuardSafeData, isTypeGuardSafeObj } from "../utils";
import { GameTeamState, GamePlayerState, Player, GameLog } from ".";
import random from "random";
import { sample } from "simple-statistics";
import fs from "fs";
import {
  EjectionReasons,
  FoulPenaltySettings,
  GameEventData,
  GameEventEnum,
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
  TeamIndex,
  TechnicalReasons,
  TimeoutOptions,
  TwoPlayers,
} from "../types";
import {
  get2or3Pointer,
  getAssistPlayer,
  getBlockPlayer,
  getFgAttemptPlayer,
  getFgIsMadeByPlayer,
  getFgXYByShotType,
  getFouledPlayerDefensiveNonShooting,
  getFoulingPlayerDefensiveNonShooting,
  getFoulTypeDefensiveNonShooting,
  getFtIsMadeByPlayer,
  getIsAssist,
  getIsBlock,
  getIsCharge,
  getIsDoubleTechnical,
  getIsOffensiveRebound,
  getIsShootingFoul,
  getIsTeamRebound,
  getIsTechnical,
  getOffensiveFouledPlayer,
  getOffensiveFoulPlayer,
  getOffensiveReboundPlayer,
  getPossessionLength,
  getPossessionOutcome,
  getShotType,
  getStealPlayer,
  getTurnoverPlayer,
  getTurnoverType,
} from "../utils/probabilities";
import Socket from "../Socket";
import GameEventStore from "./GameEventStore";
import { csvDbClient } from "../csvDbClient";

class GameSim {
  private d: TeamIndex;
  private foulPenaltySettings: FoulPenaltySettings;
  private fullSegmentTime: number | undefined;
  private gameSummaryFilePath: string;
  private gameType: GameType;
  private id: number;
  private isEndOfSegment: boolean;
  private isGameTied: boolean;
  private isOvertime: boolean;
  private isPossessionEventsComplete: boolean;
  private isShootout: boolean;
  private isNeutralFloor: boolean;
  private numFoulsForPlayerFoulOut: number | undefined;
  private o: TeamIndex;
  private observers: IObserver[];
  private playersOnCourt: PlayersOnCourt;
  private possessionArrow: TeamIndex;
  private possessionLengthTest: number[];
  private possessionTossupMethod: PossessionTossupMethodEnum;
  private playerStates: GameSimPlayerStat;
  private socket: Socket;
  private teams: GameSimTeams;
  private teamStates: GameSimTeamStat;
  private timeoutOptions: TimeoutOptions;
  private timeoutSegments:
    | {
        time: number;
        teamChargedForTimeout: 0 | 1;
      }[][]
    | undefined;
  private timeSegmentIndex: number | undefined;
  private timeSegments: number[] | undefined;

  constructor({
    foulPenaltySettings,
    gameType,
    id,
    isNeutralFloor = false,
    numFoulsForPlayerFoulOut,
    possessionTossupMethod,
    socket,
    teams,
    timeoutOptions,
  }: GameSimInit) {
    // INIT GAME STATE

    this.d = 1;
    this.foulPenaltySettings = foulPenaltySettings;
    this.gameSummaryFilePath = `./src/data/game-summary/${id}.txt`;
    this.id = id;
    this.isEndOfSegment = false;
    this.isGameTied = false;
    this.isOvertime = false;
    this.isPossessionEventsComplete = false;
    this.isShootout = false;
    this.isNeutralFloor = isNeutralFloor;
    this.numFoulsForPlayerFoulOut = numFoulsForPlayerFoulOut;
    this.o = 0;
    this.observers = [];
    this.teams = teams;
    this.possessionArrow = 0;
    this.possessionLengthTest = [];
    this.possessionTossupMethod = possessionTossupMethod;
    this.gameType = gameType;
    this.teamStates = {};
    this.playerStates = {};
    this.socket = socket;
    this.timeoutOptions = timeoutOptions;
    this.teams.forEach((team, teamIndex) => {
      const teamState = new GameTeamState(
        team.id,
        id,
        team.getFullName(),
        timeoutOptions.timeouts
      );
      this.teamStates[team.id] = teamState;
      this.observers.push(teamState);

      team.players.forEach((player) => {
        // player.normalizePlayerData();

        const playerState = new GamePlayerState(
          player.id,
          random.int(80, 99),
          id,
          player.getFullName(),
          player.position,
          player.slug,
          player.teamId,
          teamIndex
        );
        this.playerStates[player.id] = playerState;
        this.observers.push(playerState);
      });
    });

    // INIT OTHER OBSERVERS
    // this.observers.push(new GameLog(id));
    this.observers.push(
      new GameEventStore({
        gameId: id,
        gameType: gameType.type,
        isNeutralFloor,
        team0: teams[0].id,
        team1: teams[1].id,
      })
    );

    //START MANIPULATING GAME STATE

    //STARTERS
    this.playersOnCourt = this.pickStarters();
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

      if (this.timeoutOptions.timeoutRules === "NBA") {
        this.timeoutSegments = [];
      }

      this.fullSegmentTime = gameType.totalTime / gameType.segment;

      while (counter > 0) {
        this.timeSegments.push(this.fullSegmentTime);
        if (this.timeoutSegments) {
          this.timeoutSegments.push([
            { time: 419, teamChargedForTimeout: 0 },
            { time: 179, teamChargedForTimeout: 1 },
          ]);
        }
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

  getDefaultEventData = () => {
    const defPlayersOnCourt = this.playersOnCourt[this.d];
    const defTeam = this.teams[this.d];
    const offPlayersOnCourt = this.playersOnCourt[this.o];
    const offTeam = this.teams[this.o];
    const segment =
      this.timeSegmentIndex !== undefined
        ? this.timeSegmentIndex + 1
        : undefined;

    return {
      defPlayersOnCourt,
      defTeam,
      offPlayersOnCourt,
      offTeam,
      segment,
    };
  };

  getGameTeamStates = (): [GameTeamState, GameTeamState] => {
    return [
      this.teamStates[this.teams[0].id],
      this.teamStates[this.teams[1].id],
    ];
  };

  getPlayersOnCourtFromTeam = (team: 0 | 1): Player[] => {
    return this.playersOnCourt[team];
  };

  getPlayerState = (player: Player): GamePlayerState => {
    return this.playerStates[player.id];
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

  getEligibleBenchPlayers = (): [Player[], Player[]] => {
    return this.teams.map((team, teamIndex) => {
      const playersOnCourt = this.playersOnCourt[teamIndex].map(
        (player) => player.id
      );
      const players = team.players.filter(
        (player) =>
          !playersOnCourt.includes(player.id) &&
          this.isPlayerEligibleToSub(player)
      );

      return players;
    }) as [Player[], Player[]];
  };

  getIncomingPlayer = (
    benchPlayers: Player[],
    outgoingPlayer: Player
  ): Player => {
    if (!benchPlayers || benchPlayers.length === 0) {
      throw new Error("Ut oh! Don't have any bench players");
    }

    let incomingPlayer = benchPlayers[0];
    let incomingPlayerIndex = 0;
    benchPlayers.sort((a, b) => b.fgTotalChance - a.fgTotalChance);

    if (outgoingPlayer.position.includes("Center")) {
      for (let i = 0; i < benchPlayers.length; i++) {
        const player = benchPlayers[i];
        const playerState = this.getPlayerState(player);

        if (player.position.includes("Center") && playerState.fatigue <= 80) {
          incomingPlayer = player;
          incomingPlayerIndex = i;
          break;
        }
      }
    } else if (outgoingPlayer.position.includes("Forward")) {
      for (let i = 0; i < benchPlayers.length; i++) {
        const player = benchPlayers[i];
        const playerState = this.getPlayerState(player);

        if (player.position.includes("Forward") && playerState.fatigue <= 80) {
          incomingPlayer = player;
          incomingPlayerIndex = i;
          break;
        }
      }
    } else if (outgoingPlayer.position.includes("Guard")) {
      for (let i = 0; i < benchPlayers.length; i++) {
        const player = benchPlayers[i];
        const playerState = this.getPlayerState(player);

        if (player.position.includes("Guard") && playerState.fatigue <= 80) {
          incomingPlayer = player;
          incomingPlayerIndex = i;
          break;
        }
      }
    }

    benchPlayers.splice(incomingPlayerIndex, 1);

    return incomingPlayer;
  };

  handleTime = (
    possessionType:
      | "FG"
      | "FOUL"
      | "JUMP_BALL"
      | "REBOUND"
      | "TURNOVER"
      | "VIOLATION"
  ): number => {
    let possessionLength = getPossessionLength(possessionType);

    if (
      this.gameType.type === "time" &&
      this.timeSegments &&
      this.timeSegmentIndex !== undefined
    ) {
      const timeRemaining = this.timeSegments[this.timeSegmentIndex];

      if (timeRemaining <= 24) {
        possessionLength = timeRemaining;
        this.isEndOfSegment = true;
      }

      this.timeSegments[this.timeSegmentIndex] -= possessionLength;
    }

    this.possessionLengthTest.push(possessionLength);

    return possessionLength;
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

    try {
      //lower probability goes to team 0, higher probablity goes to team 1
      const pickWinner = random.bernoulli(probability);

      //did team 0 win?
      return pickWinner() === 0;
    } catch (error) {
      console.log("players", players);
      console.log("fields", fields);
      throw new Error(error);
    }
  };

  isPlayerEligibleToSub = (player: Player): boolean => {
    let returnBool = true;
    const playerState = this.getPlayerState(player);

    if (
      (this.numFoulsForPlayerFoulOut &&
        playerState.fouls === this.numFoulsForPlayerFoulOut) ||
      playerState.isEjected ||
      playerState.isInjuredWithNoReturn
    ) {
      returnBool = false;
    }

    return returnBool;
  };

  isPlayerTeam0OrTeam1 = (player: Player): 0 | 1 => {
    if (player.teamId === this.teams[0].id) {
      return 0;
    } else if (player.teamId === this.teams[1].id) {
      return 1;
    } else {
      throw new Error(
        `${player.getFullName} does not have a team that is in this game`
      );
    }
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
    this.observers.forEach((observer) =>
      observer.notifyGameEvent(gameEvent, {
        ...this.getDefaultEventData(),
        ...data,
      })
    );
  };

  pickFreeThrowShooterFromPlayersOnCourt = (players: Player[]) => {
    let playerToReturn = 0;

    players.forEach((player, i) => {
      if (player.freeThrow > players[playerToReturn].freeThrow) {
        playerToReturn = i;
      }
    });

    return players[playerToReturn];
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

  pickStarters = (): PlayersOnCourt => {
    return [
      [...this.teams[0].getStartingLineup(5)],
      [...this.teams[1].getStartingLineup(5)],
    ];
  };

  shouldWeEjection = () => {
    [...this.playersOnCourt[0], ...this.playersOnCourt[1]].forEach((player) => {
      const playerState = this.getPlayerState(player);
      let shouldWeEject = false;
      let ejectionReason: EjectionReasons = "TECHNICAL";
      if (playerState.flagrant1 === 2) {
        debugger;
        ejectionReason = "FLAGRANT_1";
        shouldWeEject = true;
      } else if (playerState.flagrant2 === 1) {
        ejectionReason = "FLAGRANT_2";
        shouldWeEject = true;
      } else if (playerState.foulsTechnical === 2) {
        shouldWeEject = true;
      }

      if (shouldWeEject) {
        this.notifyObservers("EJECTION", {
          ejectionReason,
          player0: player,
        });
      }
    });

    this.shouldWeSubstitution();
  };

  shouldWeSubstitution = (ineligibleOutcomingPlayers?: Player[]) => {
    let ineligibleOutcomingPlayersIds = ineligibleOutcomingPlayers?.map(
      (player) => player.id
    );

    const allEligibleBenchPlayers = this.getEligibleBenchPlayers();

    this.playersOnCourt.forEach((players, teamIndex) => {
      const benchPlayers = allEligibleBenchPlayers[teamIndex];

      players.forEach((player, playerIndex) => {
        if (ineligibleOutcomingPlayersIds?.includes(player.id)) {
          return;
        }

        const playerState = this.getPlayerState(player);
        let incomingPlayer, outgoingPlayer;
        let isPlayerEjected = false;
        let isPlayerFouledOut = false;

        if (playerState && playerState.isEjected) {
          isPlayerEjected = true;
          outgoingPlayer = player;
          incomingPlayer = this.getIncomingPlayer(benchPlayers, outgoingPlayer);
          this.playersOnCourt[teamIndex][playerIndex] = incomingPlayer;
        }

        if (
          !isPlayerEjected &&
          this.numFoulsForPlayerFoulOut &&
          playerState &&
          playerState.fouls === this.numFoulsForPlayerFoulOut
        ) {
          isPlayerFouledOut = true;
          outgoingPlayer = player;
          //TODO: Account for when the bench is empty

          incomingPlayer = this.getIncomingPlayer(benchPlayers, outgoingPlayer);

          this.playersOnCourt[teamIndex][playerIndex] = incomingPlayer;
        }

        if (!isPlayerFouledOut && playerState && playerState.fatigue >= 80) {
          outgoingPlayer = player;
          incomingPlayer = this.getIncomingPlayer(benchPlayers, outgoingPlayer);

          this.playersOnCourt[teamIndex][playerIndex] = incomingPlayer;
        }

        if (incomingPlayer && outgoingPlayer) {
          this.notifyObservers("SUBSTITUTION", {
            incomingPlayer,
            outgoingPlayer,
            isPlayerFouledOut,
          });
        }
      });
    });
  };

  shouldWeTechnical = () => {
    const isTechnical = getIsTechnical();

    if (isTechnical) {
      let technicalReason: TechnicalReasons = "ARGUING_WITH_OFFICIAL";
      const isDoubleTechnical = getIsDoubleTechnical();
      const player0 = this.pickRandomPlayerOnCourt();
      const player0Team = this.isPlayerTeam0OrTeam1(player0);
      const isTechOnOffensiveTeam = this.o === player0Team;
      let player1;

      if (isDoubleTechnical) {
        player1 = this.pickRandomPlayerOnCourtByTeam(player0Team === 0 ? 1 : 0);
        technicalReason = "FIGHTING";
      } else {
        this.simFreeThrows({
          isBonus: false,
          isPossessionChange: isTechOnOffensiveTeam ? true : false,
          offPlayer0: this.pickFreeThrowShooterFromPlayersOnCourt(
            this.getPlayersOnCourtFromTeam(player0Team)
          ),
          totalShots: 1,
        });
      }

      this.notifyObservers("FOUL_TECHNICAL", {
        player0,
        player1,
        technicalReason,
      });

      this.shouldWeEjection();
    }
  };

  shouldWeTimeout = ({ isDeadBall }: { isDeadBall: boolean }) => {
    let reason: string | undefined = undefined;
    let isTimeoutCalled = false;
    let teamCallingTimeout: number | undefined = undefined; //team that is calling the timeout
    if (this.timeoutOptions.timeoutRules === "NBA") {
      if (
        this.timeoutSegments &&
        this.timeSegments &&
        this.timeSegmentIndex !== undefined
      ) {
        const currentTime = this.timeSegments[this.timeSegmentIndex];
        const currentTimeoutSegment =
          this.timeoutSegments[this.timeSegmentIndex];

        if (currentTimeoutSegment && currentTimeoutSegment.length > 0) {
          for (let i = 0; i < currentTimeoutSegment.length; i++) {
            const timeoutSegment = currentTimeoutSegment[i];

            if (isDeadBall && currentTime <= timeoutSegment.time) {
              // call a mandatory timeout (TV)
              isTimeoutCalled = true;
              teamCallingTimeout = timeoutSegment.teamChargedForTimeout;
              currentTimeoutSegment.splice(i, 1);
              reason = "TV Timeout - Mandatory";

              break;
            }
          }
        }
      }
    } else {
      throw new Error("Don't know how to handle these timeout options");
    }

    if (!isTimeoutCalled) {
      const [team0, team1] = this.getGameTeamStates();
      const momentumDifference = Math.abs(team0.momentum - team1.momentum);

      if (momentumDifference && momentumDifference > 10) {
        if (team0.momentum > team1.momentum) {
          teamCallingTimeout = 1;
        } else {
          teamCallingTimeout = 0;
        }
      }
      isTimeoutCalled = true;
      reason = "Momentum";
    }

    if (isTimeoutCalled && reason && teamCallingTimeout !== undefined) {
      this.notifyObservers("TIMEOUT", {
        reason,
        team0: this.teams[teamCallingTimeout],
      });
    }
  };

  simFreeThrows = ({
    isBonus,
    isPossessionChange,
    offPlayer0,
    totalShots,
  }: {
    isBonus: boolean;
    isPossessionChange: boolean;
    totalShots: 1 | 2 | 3;
    offPlayer0: Player;
  }) => {
    let i = 0;
    do {
      const isFirstShot = 1 === i + 1;
      const isLastShot = totalShots === i + 1;
      const isMade = getFtIsMadeByPlayer(offPlayer0);
      const shotNumber = i + 1;

      const offPlayersOnCourt = this.playersOnCourt[this.o];
      const defPlayersOnCourt = this.playersOnCourt[this.d];

      if (!isFirstShot) {
        //allow timeouts before each shot. timeouts before the first shot are handled in simPossessionEvents method
        this.shouldWeTimeout({ isDeadBall: true });
      }

      if (isLastShot) {
        this.shouldWeSubstitution([offPlayer0]);
      }

      this.notifyObservers("FREE_THROW", {
        isBonus,
        isMade,
        offPlayer0,
        shotNumber,
        totalShots,
        offPlayersOnCourt,
        defPlayersOnCourt,
      });

      if (isLastShot && !isMade) {
        const possessionLength = this.handleTime("REBOUND");
        const isOffensiveRebound = getIsOffensiveRebound();
        const isReboundedByTeam = getIsTeamRebound(isOffensiveRebound);
        if (isOffensiveRebound) {
          const offPlayer0 = isReboundedByTeam
            ? null
            : getOffensiveReboundPlayer(this.playersOnCourt[this.o]);
          this.notifyObservers("OFFENSIVE_REBOUND", {
            offPlayer0,
            possessionLength,
          });
          if (isPossessionChange) {
            this.isPossessionEventsComplete = false;
          }
        } else {
          //isReboundedByDefense
          const defPlayer0 = isReboundedByTeam
            ? null
            : getOffensiveReboundPlayer(this.playersOnCourt[this.d]);
          this.notifyObservers("DEFENSIVE_REBOUND", {
            defPlayer0,
            possessionLength,
          });
        }
      }

      i++;
    } while (i !== totalShots);
  };

  simPossession = () => {
    this.isPossessionEventsComplete = false;
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
          defPlayer0: losingPlayer,
          isStartSegmentTip: true,
          offPlayer0: winningPlayer,
        });
      }
    }

    while (!this.isPossessionEventsComplete) {
      this.simPossessionEvents();
    }

    if (
      this.gameType.type === "time" &&
      this.timeSegments &&
      this.timeSegmentIndex !== undefined
    ) {
      const gameType = this.gameType as GameTypeTime;

      if (this.isEndOfSegment) {
        this.isEndOfSegment = false;

        const isLastSegment =
          this.timeSegments[this.timeSegments.length - 1] === 0;

        if (isLastSegment) {
          if (this.checkIfGameTied()) {
            if (gameType.overtimeOptions) {
              const overtimeOptions =
                gameType.overtimeOptions as OvertimeTypeTime;

              //set timeouts in the team state to the number of overtime timeouts allowed
              this.teamStates[this.teams[0].id].setTimeouts(
                overtimeOptions.timeouts
              );
              this.teamStates[this.teams[1].id].setTimeouts(
                overtimeOptions.timeouts
              );

              if (gameType.overtimeOptions.type === "time") {
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
          const isHalftimePossible = this.timeSegments.length > 1;

          if (isHalftimePossible) {
            const isHalftime =
              this.timeSegments.length / 2 === this.timeSegmentIndex + 1;
            if (isHalftime) {
              this.playersOnCourt = this.pickStarters();
              this.notifyObservers("STARTING_LINEUP", {});
            }
          }

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

  simPossessionEvents = () => {
    this.shouldWeTechnical();
    this.shouldWeTimeout({ isDeadBall: false });
    const outcome = getPossessionOutcome();
    this.isPossessionEventsComplete = true;
    const offPlayersOnCourt = this.playersOnCourt[this.o];
    const defPlayersOnCourt = this.playersOnCourt[this.d];

    switch (outcome) {
      case "FIELD_GOAL": {
        const possessionLength = this.handleTime("FG");
        const shotType = getShotType([offPlayersOnCourt, defPlayersOnCourt]);
        const offPlayer0 = getFgAttemptPlayer(offPlayersOnCourt, shotType);
        const isMade = getFgIsMadeByPlayer(offPlayer0, shotType);
        const pts = get2or3Pointer(shotType);
        const [x, y] = getFgXYByShotType(shotType);

        this.notifyObservers(`${pts}FG_ATTEMPT`, {
          offPlayer0,
          possessionLength,
          shotType,
          shotValue: pts,
          x,
          y,
        });

        const isFouled = getIsShootingFoul();
        const isBlock = getIsBlock();

        if (isMade && isFouled) {
          const isAssist = getIsAssist();
          const assistingPlayer = isAssist
            ? getAssistPlayer(offPlayersOnCourt)
            : null;
          const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers(`${pts}FG_MADE_FOUL`, {
            defPlayer0: foulingPlayer,
            foulPenaltySettings: this.foulPenaltySettings,
            offPlayer0,
            offPlayer1: assistingPlayer,
            segment:
              this.timeSegmentIndex !== undefined
                ? this.timeSegmentIndex
                : undefined,
            shotValue: pts,
            shotType,
            x,
            y,
          });

          this.shouldWeTimeout({ isDeadBall: true });

          this.simFreeThrows({
            isBonus: false,
            isPossessionChange: true,
            offPlayer0,
            totalShots: 1,
          });
        } else if (!isMade && isFouled) {
          const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
          this.notifyObservers(`${pts}FG_MISS_FOUL`, {
            defPlayer0: foulingPlayer,
            foulPenaltySettings: this.foulPenaltySettings,
            offPlayer0,
            segment:
              this.timeSegmentIndex !== undefined
                ? this.timeSegmentIndex
                : undefined,
            shotType,
            shotValue: pts,
            x,
            y,
          });

          this.shouldWeTimeout({ isDeadBall: true });

          this.simFreeThrows({
            isBonus: false,
            isPossessionChange: true,
            totalShots: pts,
            offPlayer0,
          });
        } else if (isMade && !isFouled) {
          const isAssist = getIsAssist();
          const assistingPlayer = isAssist
            ? getAssistPlayer(offPlayersOnCourt)
            : null;
          this.notifyObservers(`${pts}FG_MADE`, {
            offPlayer0,
            offPlayer1: assistingPlayer,
            shotType,
            shotValue: pts,
            x,
            y,
          });
        } else {
          const possessionLengthRebound = this.handleTime("REBOUND");
          this.notifyObservers(`${pts}FG_MISS`, {
            offPlayer0,
            shotType,
            shotValue: pts,
            x,
            y,
          });

          const isOffensiveRebound = getIsOffensiveRebound();

          let reboundingPlayer: Player | null = null;
          const isTeamRebound = getIsTeamRebound(isOffensiveRebound);

          if (isBlock) {
            const blockingPlayer = getBlockPlayer(defPlayersOnCourt);
            this.notifyObservers(`${pts}FG_BLOCK`, {
              defPlayer0: blockingPlayer,
              offPlayer0,
              shotValue: pts,
              shotType,
              x,
              y,
            });
          }

          if (isOffensiveRebound) {
            if (!isTeamRebound) {
              reboundingPlayer = getOffensiveReboundPlayer(
                this.playersOnCourt[this.o]
              );
            }

            this.notifyObservers(`OFFENSIVE_REBOUND`, {
              offPlayer0: reboundingPlayer,
              possessionLength: possessionLengthRebound,
            });

            this.isPossessionEventsComplete = false;
          } else {
            //isDefensiveRebound
            if (!isTeamRebound) {
              reboundingPlayer = getOffensiveReboundPlayer(
                this.playersOnCourt[this.d]
              );
            }

            this.notifyObservers(`DEFENSIVE_REBOUND`, {
              defPlayer0: reboundingPlayer,
              possessionLength: possessionLengthRebound,
            });
          }
        }
        break;
      }
      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        const possessionLength = this.handleTime("FOUL");
        const defTeam = this.teams[this.d];
        this.isPossessionEventsComplete = false;
        const foulType = getFoulTypeDefensiveNonShooting();
        const foulingPlayer = getFoulingPlayerDefensiveNonShooting({
          defPlayersOnCourt,
          foulType,
        });
        const fouledPlayer = getFouledPlayerDefensiveNonShooting({
          offPlayersOnCourt,
          foulType,
        });

        this.notifyObservers("FOUL_DEFENSIVE_NON_SHOOTING", {
          defPlayer0: foulingPlayer,
          foulPenaltySettings: this.foulPenaltySettings,
          foulType,
          offPlayer0: fouledPlayer,
          possessionLength,
          segment:
            this.timeSegmentIndex !== undefined
              ? this.timeSegmentIndex
              : undefined,
        });

        switch (foulType) {
          case "CLEAR_PATH": {
            this.simFreeThrows({
              isBonus: false,
              isPossessionChange: false,
              offPlayer0: fouledPlayer,
              totalShots: 2,
            });
            break;
          }
          case "FLAGRANT_1":
          case "FLAGRANT_2": {
            this.shouldWeEjection();
            this.simFreeThrows({
              isBonus: false,
              isPossessionChange: false,
              offPlayer0: fouledPlayer,
              totalShots: 2,
            });
            break;
          }
          case "INBOUND": {
            this.simFreeThrows({
              isBonus: false,
              isPossessionChange: false,
              offPlayer0:
                this.pickFreeThrowShooterFromPlayersOnCourt(offPlayersOnCourt),
              totalShots: 1,
            });
            break;
          }
          case "DOUBLE":
          case "PERSONAL":
          case "PERSONAL_BLOCK":
          case "PERSONAL_TAKE":
          case "LOOSE_BALL": {
            break;
          }
          default:
            const exhaustiveCheck: never = foulType;
            throw new Error(exhaustiveCheck);
        }

        this.shouldWeTimeout({ isDeadBall: true });
        this.shouldWeSubstitution();

        if (this.teamStates[defTeam.id].penalty) {
          this.simFreeThrows({
            isBonus: true,
            isPossessionChange: true,
            offPlayer0: fouledPlayer,
            totalShots: 2,
          });
        }

        break;
      }

      case "FOUL_OFFENSIVE": {
        const possessionLength = this.handleTime("FOUL");
        const isCharge = getIsCharge();
        const offPlayer0 = getOffensiveFoulPlayer({
          isCharge,
          offPlayersOnCourt,
        });
        const defPlayer0 = getOffensiveFouledPlayer({
          isCharge,
          defPlayersOnCourt,
        });
        this.notifyObservers("FOUL_OFFENSIVE", {
          defPlayer0,
          isCharge,
          offPlayer0,
          possessionLength,
        });

        this.shouldWeTimeout({ isDeadBall: true });
        this.shouldWeSubstitution();

        break;
      }
      case "JUMP_BALL": {
        const possessionLength = this.handleTime("JUMP_BALL");
        switch (this.possessionTossupMethod) {
          case "JUMP_BALL": {
            this.shouldWeTimeout({ isDeadBall: true });

            const offensePlayer = this.pickRandomPlayerOnCourtByTeam(this.o);
            const defensePlayer = this.pickRandomPlayerOnCourtByTeam(this.d);

            const players: [Player, Player] = [offensePlayer, defensePlayer];
            this.shouldWeSubstitution(players);

            const isOffenseWinner = this.jumpBall({
              players,
            });

            //initialize winners as offense
            let losingPlayer = defensePlayer;
            let losingTeam = this.teams[this.d];
            let winningPlayer = offensePlayer;
            let winningTeam = this.teams[this.o];

            if (isOffenseWinner) {
              this.isPossessionEventsComplete = false;
            } else {
              //isDefenseWinner
              losingPlayer = offensePlayer;
              losingTeam = this.teams[this.o];
              winningPlayer = defensePlayer;
              winningTeam = this.teams[this.d];
            }

            this.notifyObservers("JUMP_BALL", {
              defTeam: losingTeam,
              defPlayer0: losingPlayer,
              isStartSegmentTip: false,
              offPlayer0: winningPlayer,
              offTeam: winningTeam,
              possessionLength,
            });

            break;
          }
          case "POSSESSION_ARROW": {
            if (this.possessionArrow === this.o) {
              this.notifyObservers("POSSESSION_ARROW", {
                possessionLength,
              });
              this.possessionArrow = this.d;
              this.isPossessionEventsComplete = false;
            } else {
              this.notifyObservers("POSSESSION_ARROW", {
                possessionLength,
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

      case "TURNOVER": {
        const possessionLength = this.handleTime("TURNOVER");
        const offPlayer0 = getTurnoverPlayer(offPlayersOnCourt);
        const turnoverType = getTurnoverType();

        if (turnoverType === "BAD_PASS" || turnoverType === "LOST_BALL") {
          const defPlayer0 = getStealPlayer(defPlayersOnCourt);
          this.notifyObservers("STEAL", {
            defPlayer0,
            offPlayer0,
            possessionLength,
            turnoverType,
          });
        } else {
          this.notifyObservers("TURNOVER", {
            offPlayer0,
            possessionLength,
            turnoverType,
          });
          this.shouldWeTimeout({ isDeadBall: true });
          this.shouldWeSubstitution();
        }
        break;
      }
      case "VIOLATION_DEFENSIVE_GOALTENDING": {
        const possessionLength = this.handleTime("VIOLATION");
        this.notifyObservers("VIOLATION", {
          possessionLength,
          violationType: "DEFENSIVE_GOALTENDING",
        });

        this.shouldWeSubstitution();
        this.shouldWeTimeout({ isDeadBall: true });

        break;
      }
      case "VIOLATION_DEFENSIVE_KICK_BALL": {
        const possessionLength = this.handleTime("VIOLATION");
        this.notifyObservers("VIOLATION", {
          possessionLength,
          violationType: "DEFENSIVE_KICK_BALL",
        });

        this.shouldWeSubstitution();
        this.shouldWeTimeout({ isDeadBall: true });

        break;
      }
      default:
        const exhaustiveCheck: never = outcome;
        throw new Error(exhaustiveCheck);
    }
  };

  simShootout = () => {
    console.info("Simming shootout");
  };

  closeGameSim = async () => {
    // //create file
    // fs.writeFileSync(this.gameSummaryFilePath, "");
    // //add headers
    // let headerString = "team0Score|";
    // fs.appendFileSync(this.filePath, `${headerString}\n`);
    // return {
    //   playerStats: [
    //     this.teams[0].players.map((player) => this.playerStates[player.id]),
    //     this.teams[1].players.map((player) => this.playerStates[player.id]),
    //   ],
    //   teamStats: [
    //     this.teamStates[this.teams[0].id],
    //     this.teamStates[this.teams[1].id],
    //   ],
    // };

    const team0Won =
      this.teamStates[this.teams[0].id].pts >
      this.teamStates[this.teams[1].id].pts;

    console.log("team0Won", team0Won);

    await csvDbClient.incrementOneRow(
      `1`,
      "standings",
      { teamId: this.teams[0].id },
      team0Won ? { w: 1 } : { l: 1 }
    );
    await csvDbClient.incrementOneRow(
      `1`,
      "standings",
      { teamId: this.teams[1].id },
      team0Won ? { l: 1 } : { w: 1 }
    );
  };

  start = async () => {
    this.notifyObservers("GAME_START");

    let simPossessionIsOver = false;
    let counterEndlessLoopProtect = 0;
    const counterEndlessLoopProtectLimiter = 1000;

    while (
      !simPossessionIsOver &&
      counterEndlessLoopProtect !== counterEndlessLoopProtectLimiter
    ) {
      counterEndlessLoopProtect += 1;
      this.simPossession();

      simPossessionIsOver = this.checkIfSimPossessionIsOver();
    }

    if (counterEndlessLoopProtect === counterEndlessLoopProtectLimiter) {
      throw new Error("Game sim is endless loop");
    }

    if (this.isShootout) {
      let simShootoutIsOver = false;

      while (!simShootoutIsOver) {
        this.simShootout();

        simShootoutIsOver = this.checkIfSimShootoutIsOver();
      }
    }

    this.notifyObservers("GAME_END");

    console.log("GAME IS ENDED!!!");

    await this.closeGameSim();
  };
}

export default GameSim;
