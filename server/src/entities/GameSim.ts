import { errors, getTypeGuardSafeData, isTypeGuardSafeObj } from "../utils";
import { GameTeamState, GamePlayerState, Player, GameLog } from ".";
import random from "random";
import { sample, shuffle } from "simple-statistics";
import {
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
  TurnoverTypes,
  TwoPlayers,
} from "../types";
import {
  get2or3Pointer,
  getAssistPlayer,
  getBlockPlayer,
  getFgAttemptPlayer,
  getFgIsMadeByPlayer,
  getFgXYByShotType,
  getFtIsMadeByPlayer,
  getIsAssist,
  getIsBlock,
  getIsOffensiveRebound,
  getIsShootingFoul,
  getIsTeamRebound,
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

class GameSim {
  private d: TeamIndex;
  private foulPenaltySettings: FoulPenaltySettings;
  private fullSegmentTime: number | undefined;
  private gameType: GameType;
  private id: number;
  private isEndOfSegment: boolean;
  private isGameTied: boolean;
  private isOvertime: boolean;
  private isPossessionEventsComplete: boolean;
  private isShootout: boolean;
  private neutralFloor: boolean;
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
  private timeSegmentIndex: number | undefined;
  private timeSegments: number[] | undefined;

  constructor({
    foulPenaltySettings,
    gameType,
    id,
    neutralFloor = false,
    numFoulsForPlayerFoulOut,
    possessionTossupMethod,
    socket,
    teams,
    timeouts,
  }: GameSimInit) {
    // INIT GAME STATE

    this.d = 1;
    this.foulPenaltySettings = foulPenaltySettings;
    this.id = id;
    this.isEndOfSegment = false;
    this.isGameTied = false;
    this.isOvertime = false;
    this.isPossessionEventsComplete = false;
    this.isShootout = false;
    this.neutralFloor = neutralFloor;
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
    this.teams.forEach((team, teamIndex) => {
      const teamState = new GameTeamState(
        team.id,
        team.getFullName(),
        timeouts
      );
      this.teamStates[team.id] = teamState;
      this.observers.push(teamState);

      team.players.forEach((player) => {
        player.normalizePlayerData();

        const playerState = new GamePlayerState(
          player.id,
          random.int(80, 99),
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
    this.observers.push(new GameLog(id));
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

  getDefaultEventData = () => {
    const defTeam = this.teams[this.d];
    const offTeam = this.teams[this.o];
    const offPlayersOnCourt = this.playersOnCourt[this.o];
    const defPlayersOnCourt = this.playersOnCourt[this.d];

    return {
      defTeam,
      offTeam,
      offPlayersOnCourt,
      defPlayersOnCourt,
    };
  };

  getGameTeamStates = (): [GameTeamState, GameTeamState] => {
    return [
      this.teamStates[this.teams[0].id],
      this.teamStates[this.teams[1].id],
    ];
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

  isPlayerEligibleToSub = (player: Player): boolean => {
    let returnBool = true;
    const playerState = this.getPlayerState(player);

    if (
      (this.numFoulsForPlayerFoulOut &&
        playerState.fouls === this.numFoulsForPlayerFoulOut) ||
      playerState.isInjuredWithNoReturn
    ) {
      returnBool = false;
    }

    return returnBool;
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

  handleSubstitution = (ineligibleOutcomingPlayers?: Player[]) => {
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
        let isPlayerFouledOut = false;

        if (
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

  handleTime = (
    possessionType:
      | "fg"
      | "foul"
      | "jumpBall"
      | "rebound"
      | "turnover"
      | "violation"
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

  simFreeThrows = ({
    bonus,
    offPlayer1,
    totalShots,
  }: {
    bonus?: boolean;
    totalShots: 1 | 2 | 3;
    offPlayer1: Player;
  }) => {
    let i = 0;
    do {
      const isLastShot = totalShots === i + 1;
      const shotMade = getFtIsMadeByPlayer(offPlayer1);
      const shotNumber = i + 1;
      const valueToAdd = shotMade ? 1 : 0;

      const offPlayersOnCourt = this.playersOnCourt[this.o];
      const defPlayersOnCourt = this.playersOnCourt[this.d];

      if (isLastShot) {
        this.handleSubstitution([offPlayer1]);
      }

      this.notifyObservers("FREE_THROW", {
        bonus,
        offPlayer1,
        shotNumber,
        totalShots,
        valueToAdd,
        offPlayersOnCourt,
        defPlayersOnCourt,
      });

      if (isLastShot && !shotMade) {
        const possessionLength = this.handleTime("rebound");
        const isOffensiveRebound = getIsOffensiveRebound();
        const isReboundedByTeam = getIsTeamRebound(isOffensiveRebound);
        if (isOffensiveRebound) {
          const offPlayer1 = isReboundedByTeam
            ? null
            : getOffensiveReboundPlayer(this.playersOnCourt[this.o]);
          this.notifyObservers("OFFENSIVE_REBOUND", {
            offPlayer1,
            possessionLength,
          });
          this.isPossessionEventsComplete = false;
        } else {
          //isReboundedByDefense
          const defPlayer1 = isReboundedByTeam
            ? null
            : getOffensiveReboundPlayer(this.playersOnCourt[this.d]);
          this.notifyObservers("DEFENSIVE_REBOUND", {
            defPlayer1,
            possessionLength,
          });
        }
      }

      i++;
    } while (i !== totalShots);
  };

  simPossession = () => {
    console.info("----------------------------");
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
          defPlayer1: losingPlayer,
          isStartSegmentTip: true,
          offPlayer1: winningPlayer,
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
    const outcome = getPossessionOutcome();
    this.isPossessionEventsComplete = true;
    const offPlayersOnCourt = this.playersOnCourt[this.o];
    const defPlayersOnCourt = this.playersOnCourt[this.d];

    switch (outcome) {
      case "FIELD_GOAL": {
        const possessionLength = this.handleTime("fg");
        const shotType = getShotType([offPlayersOnCourt, defPlayersOnCourt]);
        const offPlayer1 = getFgAttemptPlayer(offPlayersOnCourt, shotType);
        const isMade = getFgIsMadeByPlayer(offPlayer1, shotType);

        const pts = get2or3Pointer(shotType);
        const [x, y] = getFgXYByShotType(shotType);

        this.notifyObservers(`${pts}FG_ATTEMPT`, {
          offPlayer1,
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
            defPlayer1: foulingPlayer,
            foulPenaltySettings: this.foulPenaltySettings,
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

          this.simFreeThrows({
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
          this.simFreeThrows({
            totalShots: pts,
            offPlayer1,
          });
        } else if (isMade && !isFouled) {
          const isAssist = getIsAssist();
          const assistingPlayer = isAssist
            ? getAssistPlayer(offPlayersOnCourt)
            : null;
          this.notifyObservers(`${pts}FG_MADE`, {
            offPlayer1,
            offPlayer2: assistingPlayer,
            shotType,
            shotValue: pts,
            valueToAdd: pts,
            x,
            y,
          });
        } else {
          const possessionLengthRebound = this.handleTime("rebound");
          this.notifyObservers(`${pts}FG_MISS`, {
            offPlayer1,
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
              defPlayer1: blockingPlayer,
              offPlayer1,
              shotValue: pts,
              valueToAdd: 1,
            });
          }

          if (isOffensiveRebound) {
            if (!isTeamRebound) {
              reboundingPlayer = getOffensiveReboundPlayer(
                this.playersOnCourt[this.o]
              );
            }

            this.notifyObservers(`OFFENSIVE_REBOUND`, {
              offPlayer1: reboundingPlayer,
              possessionLength: possessionLengthRebound,
              valueToAdd: 1,
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
              defPlayer1: reboundingPlayer,
              possessionLength: possessionLengthRebound,
              valueToAdd: 1,
            });
          }
        }
        break;
      }
      case "JUMP_BALL": {
        const possessionLength = this.handleTime("jumpBall");
        switch (this.possessionTossupMethod) {
          case "jumpBall": {
            const offensePlayer = this.pickRandomPlayerOnCourtByTeam(this.o);
            const defensePlayer = this.pickRandomPlayerOnCourtByTeam(this.d);

            const players: [Player, Player] = [offensePlayer, defensePlayer];
            this.handleSubstitution(players);

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
              defPlayer1: losingPlayer,
              isStartSegmentTip: false,
              offPlayer1: winningPlayer,
              offTeam: winningTeam,
              possessionLength,
            });

            break;
          }
          case "possessionArrow": {
            if (this.possessionArrow === this.o) {
              this.notifyObservers("POSSESSION_ARROW_WON", {
                possessionLength,
              });
              this.possessionArrow = this.d;
              this.isPossessionEventsComplete = false;
            } else {
              this.notifyObservers("POSSESSION_ARROW_WON", {
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
      case "FOUL_DEFENSIVE_NON_SHOOTING": {
        const possessionLength = this.handleTime("foul");
        const offPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.o);
        const defTeam = this.teams[this.d];
        const foulingPlayer = this.pickRandomPlayerOnCourtByTeam(this.d);
        this.isPossessionEventsComplete = false;

        this.notifyObservers("FOUL_DEFENSIVE_NON_SHOOTING", {
          defPlayer1: foulingPlayer,
          foulPenaltySettings: this.foulPenaltySettings,
          offPlayer1,
          possessionLength,
          segment:
            this.timeSegmentIndex !== undefined
              ? this.timeSegmentIndex
              : undefined,
        });

        this.handleSubstitution();

        if (this.teamStates[defTeam.id].penalty) {
          this.simFreeThrows({
            bonus: true,
            offPlayer1,
            totalShots: 2,
          });
        }

        break;
      }

      case "OFFENSIVE_FOUL": {
        const possessionLength = this.handleTime("foul");
        const offPlayer1 = this.pickRandomPlayerOnCourtByTeam(this.o);
        const isCharge = random.bool();
        this.notifyObservers("OFFENSIVE_FOUL", {
          isCharge,
          offPlayer1,
          possessionLength,
        });

        this.handleSubstitution();

        break;
      }

      case "TURNOVER": {
        const possessionLength = this.handleTime("turnover");
        const offPlayer1 = getTurnoverPlayer(offPlayersOnCourt);
        const turnoverType = getTurnoverType();

        if (turnoverType === "BAD_PASS" || turnoverType === "LOST_BALL") {
          const defPlayer1 = getStealPlayer(defPlayersOnCourt);
          this.notifyObservers("STEAL", {
            defPlayer1,
            offPlayer1,
            possessionLength,
            turnoverType,
            valueToAdd: 1,
          });
        } else {
          this.notifyObservers("TURNOVER", {
            offPlayer1,
            possessionLength,
            turnoverType,
            valueToAdd: 1,
          });
          this.handleSubstitution();
        }
        break;
      }
      case "VIOLATION_DEF_GOALTEND": {
        const possessionLength = this.handleTime("violation");
        this.notifyObservers("VIOLATION", {
          possessionLength,
          violationType: "DEF_GOALTEND",
        });

        this.handleSubstitution();

        break;
      }
      case "VIOLATION_DEF_KICK_BALL": {
        const possessionLength = this.handleTime("violation");
        this.notifyObservers("VIOLATION", {
          possessionLength,
          violationType: "DEF_KICK_BALL",
        });

        this.handleSubstitution();

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

  start = () => {
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

    return {
      playerStats: [
        this.teams[0].players.map((player) => this.playerStates[player.id]),
        this.teams[1].players.map((player) => this.playerStates[player.id]),
      ],
      teamStats: [
        this.teamStates[this.teams[0].id],
        this.teamStates[this.teams[1].id],
      ],
    };
  };
}

export default GameSim;
