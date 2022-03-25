import { z } from "zod";
import { ShotTypes } from ".";
import { GamePlayerState, GameTeamState, Player, Team } from "../entities";
import Socket from "../Socket";
import {
  GameTotalTimeEnum,
  GameTypeEnum,
  GameTypeTimeSegmentsEnum,
  OvertimeLengthEnum,
  OvertimeTypeEnum,
  PossessionTossupMethodEnum,
  ShotClockLengthEnum,
} from "./enums";

export const FgType = z.object({
  isAnd1: z.boolean(),
  isAssist: z.boolean(),
  isBlock: z.boolean(),
  isMade: z.boolean(),
  shotType: ShotTypes,
});
export type FgType = z.infer<typeof FgType>;

export const OvertimeTypeShootout = z.object({
  numOfShooters: z.number(),
  type: OvertimeTypeEnum,
});
export type OvertimeTypeShootout = z.infer<typeof OvertimeTypeShootout>;

export const OvertimeTypeTime = z.object({
  max: z.number().optional(),
  overtimeLength: OvertimeLengthEnum,
  type: OvertimeTypeEnum,
});
export type OvertimeTypeTime = z.infer<typeof OvertimeTypeTime>;

export const OvertimeOptions = z.union([
  OvertimeTypeShootout,
  OvertimeTypeTime,
  z.null(),
]);
export type OvertimeOptions = z.infer<typeof OvertimeOptions>;

export const GameTypePoints = z.object({
  totalPts: z.number(),
  type: GameTypeEnum,
  winBy: z.number(),
});
export type GameTypePoints = z.infer<typeof GameTypePoints>;

export const GameTypeTime = z.object({
  overtimeOptions: OvertimeOptions,
  segment: GameTypeTimeSegmentsEnum,
  totalTime: GameTotalTimeEnum,
  type: GameTypeEnum,
});
export type GameTypeTime = z.infer<typeof GameTypeTime>;

export const GameType = z.union([GameTypePoints, GameTypeTime]);
export type GameType = z.infer<typeof GameType>;

export const FoulPenaltySettings = z.object({
  doublePenaltyThreshold: z.number(),
  penaltyThreshold: z.number(),
});
export type FoulPenaltySettings = z.infer<typeof FoulPenaltySettings>;

export const GameSimInit = z.object({
  foulPenaltySettings: FoulPenaltySettings,
  gameType: GameType,
  id: z.number().gte(1),
  isNeutralFloor: z.boolean().optional(),
  numFoulsForPlayerFoulOut: z.number().gte(1).optional(),
  possessionTossupMethod: PossessionTossupMethodEnum,
  shotClock: ShotClockLengthEnum.optional(),
  socket: z.instanceof(Socket),
  teams: z.tuple([z.instanceof(Team), z.instanceof(Team)]),
  timeouts: z.number().positive(),
});
export type GameSimInit = z.infer<typeof GameSimInit>;

export const TeamInit = z.object({
  homeName: z.string(),
  id: z.number().gte(1),
  nickname: z.string(),
  players: z.array(z.instanceof(Player)),
});
export type TeamInit = z.infer<typeof TeamInit>;

export const TwoPlayers = z.tuple([z.instanceof(Player), z.instanceof(Player)]);
export type TwoPlayers = z.infer<typeof TwoPlayers>;

export const GameSimStats = z.object({
  jumpBallsLost: z.number(),
  jumpBallsWon: z.number(),
  pts: z.number(),
});
export type GameSimStats = z.infer<typeof GameSimStats>;

export const GameSimPlayerStat = z.record(z.instanceof(GamePlayerState));
export type GameSimPlayerStat = z.infer<typeof GameSimPlayerStat>;

export const GameSimTeamStat = z.record(z.instanceof(GameTeamState));
export type GameSimTeamStat = z.infer<typeof GameSimTeamStat>;

export const ArrayOfPlayers = z.array(z.instanceof(Player));
export type ArrayOfPlayers = z.infer<typeof ArrayOfPlayers>;

export const PlayersOnCourt = z.tuple([ArrayOfPlayers, ArrayOfPlayers]);
export type PlayersOnCourt = z.infer<typeof PlayersOnCourt>;

export const GameSimTeams = z.tuple([z.instanceof(Team), z.instanceof(Team)]);
export type GameSimTeams = z.infer<typeof GameSimTeams>;
