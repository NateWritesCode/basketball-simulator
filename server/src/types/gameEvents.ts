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

const BaseGameEvent2FgAttempt = z.object({
  offPlayer0: z.instanceof(Player),
  possessionLength: z.number(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});

const GameEvent2FgAttempt = DefaultGameEvent.merge(BaseGameEvent2FgAttempt);
export type GameEvent2FgAttempt = z.infer<typeof GameEvent2FgAttempt>;

const BaseGameEvent2FgMade = z.object({
  offPlayer0: z.instanceof(Player),
  offPlayer1: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent2FgMade = DefaultGameEvent.merge(BaseGameEvent2FgMade);
export type GameEvent2FgMade = z.infer<typeof GameEvent2FgMade>;

const BaseGameEvent2FgMiss = z.object({
  offPlayer0: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent2FgMiss = DefaultGameEvent.merge(BaseGameEvent2FgMiss);
export type GameEvent2FgMiss = z.infer<typeof GameEvent2FgMiss>;

const BaseGameEvent2FgMadeFoul = z.object({
  defPlayer0: z.instanceof(Player),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer0: z.instanceof(Player),
  offPlayer1: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent2FgMadeFoul = DefaultGameEvent.merge(BaseGameEvent2FgMadeFoul);
export type GameEvent2FgMadeFoul = z.infer<typeof GameEvent2FgMadeFoul>;

const BaseGameEvent2FgMissFoul = z.object({
  defPlayer0: z.instanceof(Player),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer0: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent2FgMissFoul = DefaultGameEvent.merge(BaseGameEvent2FgMissFoul);
export type GameEvent2FgMissFoul = z.infer<typeof GameEvent2FgMissFoul>;

const BaseGameEvent3FgMade = z.object({
  offPlayer0: z.instanceof(Player),
  offPlayer1: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent3FgMade = DefaultGameEvent.merge(BaseGameEvent3FgMade);
export type GameEvent3FgMade = z.infer<typeof GameEvent3FgMade>;

const BaseGameEvent3FgMiss = z.object({
  offPlayer0: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent3FgMiss = DefaultGameEvent.merge(BaseGameEvent3FgMiss);
export type GameEvent3FgMiss = z.infer<typeof GameEvent3FgMiss>;

const BaseGameEvent3FgMadeFoul = z.object({
  defPlayer0: z.instanceof(Player),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer0: z.instanceof(Player),
  offPlayer1: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent3FgMadeFoul = DefaultGameEvent.merge(BaseGameEvent3FgMadeFoul);
export type GameEvent3FgMadeFoul = z.infer<typeof GameEvent3FgMadeFoul>;

const BaseGameEvent3FgMissFoul = z.object({
  defPlayer0: z.instanceof(Player),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer0: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent3FgMissFoul = DefaultGameEvent.merge(BaseGameEvent3FgMissFoul);
export type GameEvent3FgMissFoul = z.infer<typeof GameEvent3FgMissFoul>;

const BaseGameEvent3FgAttempt = z.object({
  offPlayer0: z.instanceof(Player),
  possessionLength: z.number(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEvent3FgAttempt = DefaultGameEvent.merge(BaseGameEvent3FgAttempt);
export type GameEvent3FgAttempt = z.infer<typeof GameEvent3FgAttempt>;

const BaseGameEventBlock = z.object({
  defPlayer0: z.instanceof(Player),
  offPlayer0: z.instanceof(Player),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
const GameEventBlock = DefaultGameEvent.merge(BaseGameEventBlock);
export type GameEventBlock = z.infer<typeof GameEventBlock>;

const BaseGameEventEjection = z.object({
  ejectionReason: EjectionReasons,
  player0: z.instanceof(Player),
});
const GameEventEjection = DefaultGameEvent.merge(BaseGameEventEjection);
export type GameEventEjection = z.infer<typeof GameEventEjection>;

const BaseGameEventFreeThrow = z.object({
  isBonus: z.boolean().optional(),
  isMade: z.boolean(),
  offPlayer0: z.instanceof(Player),
  shotNumber: z.number().min(1).max(3),
  shotValue: z.number(),
  totalShots: z.number().min(1).max(3),
});
const GameEventFreeThrow = DefaultGameEvent.merge(BaseGameEventFreeThrow);
export type GameEventFreeThrow = z.infer<typeof GameEventFreeThrow>;

const BaseGameEventFoulOffensive = z.object({
  defPlayer0: z.instanceof(Player),
  isCharge: z.boolean(),
  offPlayer0: z.instanceof(Player),
  possessionLength: z.number(),
});
const GameEventFoulOffensive = DefaultGameEvent.merge(
  BaseGameEventFoulOffensive
);
export type GameEventFoulOffensive = z.infer<typeof GameEventFoulOffensive>;

const BaseGameEventFoulTechnical = z.object({
  player0: z.instanceof(Player),
  player1: z.instanceof(Player).optional(),
  technicalReason: TechnicalReasons,
});
const GameEventFoulTechnical = DefaultGameEvent.merge(
  BaseGameEventFoulTechnical
);
export type GameEventFoulTechnical = z.infer<typeof GameEventFoulTechnical>;

const BaseGameEventFoulNonShootingDefensive = z.object({
  defPlayer0: z.instanceof(Player),
  foulPenaltySettings: FoulPenaltySettings,
  foulType: FoulTypesDefensiveNonShooting,
  offPlayer0: z.instanceof(Player),
  possessionLength: z.number(),
});
const GameEventFoulNonShootingDefensive = DefaultGameEvent.merge(
  BaseGameEventFoulNonShootingDefensive
);
export type GameEventFoulNonShootingDefensive = z.infer<
  typeof GameEventFoulNonShootingDefensive
>;

export const BaseGameEventJumpBall = z.object({
  defPlayer0: z.instanceof(Player),
  isStartSegmentTip: z.boolean(),
  offPlayer0: z.instanceof(Player),
  possessionLength: z.number(),
});
const GameEventJumpBall = DefaultGameEvent.merge(BaseGameEventJumpBall);
export type GameEventJumpBall = z.infer<typeof GameEventJumpBall>;

const BaseGameEventPossessionArrow = z.object({
  possessionLength: z.number(),
});
const GameEventPossessionArrow = DefaultGameEvent.merge(
  BaseGameEventPossessionArrow
);
export type GameEventPossessionArrow = z.infer<typeof GameEventPossessionArrow>;

export const BaseGameEventReboundDefensive = z.object({
  defPlayer0: z.instanceof(Player).optional(),
  possessionLength: z.number(),
});
const GameEventReboundDefensive = DefaultGameEvent.merge(
  BaseGameEventReboundDefensive
);
export type GameEventReboundDefensive = z.infer<
  typeof GameEventReboundDefensive
>;

const BaseGameEventReboundOffensive = z.object({
  offPlayer0: z.instanceof(Player).optional(),
  possessionLength: z.number(),
});
const GameEventReboundOffensive = DefaultGameEvent.merge(
  BaseGameEventReboundOffensive
);
export type GameEventReboundOffensive = z.infer<
  typeof GameEventReboundOffensive
>;

const BaseGameEventSegment = z.object({
  timeSegmentIndex: z.number(),
});
const GameEventSegment = DefaultGameEvent.merge(BaseGameEventSegment);
export type GameEventSegment = z.infer<typeof GameEventSegment>;

const BaseGameEventSegmentEnd = z.object({
  isHalftime: z.boolean(),
});
const GameEventSegmentEnd = DefaultGameEvent.merge(BaseGameEventSegmentEnd);
export type GameEventSegmentEnd = z.infer<typeof GameEventSegmentEnd>;

const BaseGameEventStartingLineup = z.object({});
const GameEventStartingLineup = DefaultGameEvent.merge(
  BaseGameEventStartingLineup
);
export type GameEventStartingLineup = z.infer<typeof GameEventStartingLineup>;

const BaseGameEventSteal = z.object({
  defPlayer0: z.instanceof(Player),
  offPlayer0: z.instanceof(Player),
  possessionLength: z.number(),
});
const GameEventSteal = DefaultGameEvent.merge(BaseGameEventSteal);
export type GameEventSteal = z.infer<typeof GameEventSteal>;

const BaseGameEventSubstitution = z.object({
  isPlayerFouledOut: z.boolean(),
  incomingPlayer: z.instanceof(Player),
  outgoingPlayer: z.instanceof(Player),
});
const GameEventSubstitution = DefaultGameEvent.merge(BaseGameEventSubstitution);
export type GameEventSubstitution = z.infer<typeof GameEventSubstitution>;

const BaseGameEventTimeout = z.object({
  reason: z.string(),
  team0: z.instanceof(Team),
});
const GameEventTimeout = DefaultGameEvent.merge(BaseGameEventTimeout);
export type GameEventTimeout = z.infer<typeof GameEventTimeout>;

const BaseGameEventTurnover = z.object({
  offPlayer0: z.instanceof(Player),
  possessionLength: z.number(),
  turnoverType: TurnoverTypes,
});
const GameEventTurnover = DefaultGameEvent.merge(BaseGameEventTurnover);
export type GameEventTurnover = z.infer<typeof GameEventTurnover>;

const BaseGameEventViolation = z.object({
  player0: z.instanceof(Player),
  possessionLength: z.number(),
  violationType: ViolationTypes,
});
const GameEventViolation = DefaultGameEvent.merge(BaseGameEventViolation);
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
  GameEventBlock,
  GameEventEjection,
  GameEventFoulNonShootingDefensive,
  GameEventFoulTechnical,
  GameEventFreeThrow,
  GameEventJumpBall,
  GameEventPossessionArrow,
  GameEventReboundDefensive,
  GameEventReboundOffensive,
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
