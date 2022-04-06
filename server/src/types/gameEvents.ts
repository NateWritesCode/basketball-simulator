import { z } from "zod";
import {
  FoulPenaltySettings,
  ShotTypes,
  TurnoverTypes,
  ViolationTypes,
} from ".";
import { Player, Team } from "../entities";
import {
  EjectionReasons,
  FoulTypesDefensiveNonShooting,
  GameTypeEnum,
  TechnicalReasons,
} from "./enums";

const DefaultGameEvent = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  gameType: GameTypeEnum,
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  segment: z.number(),
});

const BaseGameEventStartingLineup = z.object({});
const GameEventStartingLineup = DefaultGameEvent.merge(
  BaseGameEventStartingLineup
);
export type GameEventStartingLineup = z.infer<typeof GameEventStartingLineup>;

export const BaseGameEventJumpBall = z.object({
  defPlayer1: z.instanceof(Player),
  isStartSegmentTip: z.boolean(),
  offPlayer1: z.instanceof(Player),
  possessionLength: z.number(),
});
const GameEventJumpBall = DefaultGameEvent.merge(BaseGameEventJumpBall);
export type GameEventJumpBall = z.infer<typeof GameEventJumpBall>;

const BaseGameEvent2FgAttempt = z.object({
  offPlayer1: z.instanceof(Player),
  possessionLength: z.number(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});

const GameEvent2FgAttempt = DefaultGameEvent.merge(BaseGameEvent2FgAttempt);
export type GameEvent2FgAttempt = z.infer<typeof GameEvent2FgAttempt>;

const BaseGameEvent2FgMade = z.object({
  offPlayer1: z.instanceof(Player),
  offPlayer2: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent2FgMade = DefaultGameEvent.merge(BaseGameEvent2FgMade);
export type GameEvent2FgMade = z.infer<typeof GameEvent2FgMade>;

const BaseGameEvent2FgMiss = z.object({
  offPlayer1: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent2FgMiss = DefaultGameEvent.merge(BaseGameEvent2FgMiss);
export type GameEvent2FgMiss = z.infer<typeof GameEvent2FgMiss>;

const BaseGameEvent2FgMadeFoul = z.object({
  defPlayer1: z.instanceof(Player),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer1: z.instanceof(Player),
  offPlayer2: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent2FgMadeFoul = DefaultGameEvent.merge(BaseGameEvent2FgMadeFoul);
export type GameEvent2FgMadeFoul = z.infer<typeof GameEvent2FgMiss>;

export const BaseGameEvent2FgMissFoul = z.object({
  defPlayer1: z.instanceof(Player),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer1: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent2FgMissFoul = DefaultGameEvent.merge(BaseGameEvent2FgMissFoul);
export type GameEvent2FgMissFoul = z.infer<typeof GameEvent2FgMissFoul>;

export const BaseGameEvent3FgMade = z.object({
  offPlayer1: z.instanceof(Player),
  offPlayer2: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent3FgMade = DefaultGameEvent.merge(BaseGameEvent3FgMade);
export type GameEvent3FgMade = z.infer<typeof GameEvent3FgMade>;

export const BaseGameEvent3FgMiss = z.object({
  offPlayer1: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent3FgMiss = DefaultGameEvent.merge(BaseGameEvent3FgMiss);
export type GameEvent3FgMiss = z.infer<typeof GameEvent3FgMiss>;

export const GameEvent3FgMadeFoul = z.object({
  defPlayer1: z.instanceof(Player),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer1: z.instanceof(Player),
  offPlayer2: z.instanceof(Player),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  segment: z.number().optional(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent3FgMadeFoul = z.infer<typeof GameEvent3FgMadeFoul>;

export const GameEvent3FgMissFoul = z.object({
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  segment: z.number().optional(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent3FgMissFoul = z.infer<typeof GameEvent3FgMissFoul>;

export const GameEvent3FgAttempt = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent3FgAttempt = z.infer<typeof GameEvent3FgAttempt>;

export const GameEventBlock = z.object({
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  shotValue: z.number(),
});
export type GameEventBlock = z.infer<typeof GameEventBlock>;

export const GameEventOffensiveRebound = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player).optional(),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
});
export type GameEventOffensiveRebound = z.infer<
  typeof GameEventOffensiveRebound
>;

export const GameEventDefensiveRebound = z.object({
  defPlayer1: z.instanceof(Player).optional(),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
});
export type GameEventDefensiveRebound = z.infer<
  typeof GameEventDefensiveRebound
>;

export const GameEventSegment = z.object({
  segment: z.number(),
  timeSegmentIndex: z.number(),
});
export type GameEventSegment = z.infer<typeof GameEventSegment>;

export const GameEventEjection = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  ejectionReason: EjectionReasons,
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  player0: z.instanceof(Player),
});
export type GameEventEjection = z.infer<typeof GameEventEjection>;

export const GameEventFreeThrow = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  isBonus: z.boolean().optional(),
  isMade: z.boolean(),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  shotNumber: z.number().min(1).max(3),
  shotValue: z.number(),
  totalShots: z.number().min(1).max(3),
});
export type GameEventFreeThrow = z.infer<typeof GameEventFreeThrow>;

export const GameEventFoulOffensive = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  isCharge: z.boolean(),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
});
export type GameEventFoulOffensive = z.infer<typeof GameEventFoulOffensive>;

export const GameEventFoulTechnical = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  player0: z.instanceof(Player),
  player1: z.instanceof(Player).optional(),
  technicalReason: TechnicalReasons,
});
export type GameEventFoulTechnical = z.infer<typeof GameEventFoulTechnical>;

export const GameEventNonShootingDefensiveFoul = z.object({
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  foulPenaltySettings: FoulPenaltySettings,
  foulType: FoulTypesDefensiveNonShooting,
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
  segment: z.number().optional(),
});
export type GameEventNonShootingDefensiveFoul = z.infer<
  typeof GameEventNonShootingDefensiveFoul
>;

export const GameEventPossessionArrowWon = z.object({
  defTeam: z.instanceof(Team),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
});
export type GameEventPossessionArrowWon = z.infer<
  typeof GameEventPossessionArrowWon
>;

export const GameEventSegmentEnd = z.object({
  isHalftime: z.boolean(),
});
export type GameEventSegmentEnd = z.infer<typeof GameEventSegmentEnd>;

export const GameEventSteal = z.object({
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
});
export type GameEventSteal = z.infer<typeof GameEventSteal>;

export const GameEventSubstitution = z.object({
  isPlayerFouledOut: z.boolean(),
  incomingPlayer: z.instanceof(Player),
  outgoingPlayer: z.instanceof(Player),
});
export type GameEventSubstitution = z.infer<typeof GameEventSubstitution>;

export const GameEventTimeout = z.object({
  reason: z.string(),
  team0: z.instanceof(Team),
});
export type GameEventTimeout = z.infer<typeof GameEventTimeout>;

export const GameEventTurnover = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
  turnoverType: TurnoverTypes,
});
export type GameEventTurnover = z.infer<typeof GameEventTurnover>;

export const GameEventViolation = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  offTeam: z.instanceof(Team),
  violationType: ViolationTypes,
  possessionLength: z.number(),
});

export type GameEventViolation = z.infer<typeof GameEventViolation>;

export const GameEventData = z.union([
  GameEvent2FgAttempt,
  GameEvent2FgMade,
  GameEvent2FgMadeFoul,
  GameEvent2FgMiss,
  GameEvent2FgMissFoul,
  GameEvent3FgAttempt,
  GameEvent3FgMade,
  GameEvent3FgMadeFoul,
  GameEvent3FgMiss,
  GameEvent3FgMissFoul,
  GameEventFoulTechnical,
  GameEventEjection,
  GameEventBlock,
  GameEventFreeThrow,
  GameEventJumpBall,
  GameEventNonShootingDefensiveFoul,
  GameEventPossessionArrowWon,
  GameEventOffensiveRebound,
  GameEventDefensiveRebound,
  GameEventSegment,
  GameEventStartingLineup,
  GameEventSteal,
  GameEventSubstitution,
  GameEventTimeout,
  GameEventTurnover,
  GameEventViolation,
  z.object({}),
]);
export type GameEventData = z.infer<typeof GameEventData>;
