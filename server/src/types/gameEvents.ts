import { z } from "zod";
import {
  FoulPenaltySettings,
  ShotTypes,
  TurnoverTypes,
  ViolationTypes,
} from ".";
import { Player, Team } from "../entities";

export const GameEventStartingLineup = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
}); //offensive team is team0, defensive team is team1
export type GameEventStartingLineup = z.infer<typeof GameEventStartingLineup>;

export const GameEventJumpBall = z.object({
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  isStartSegmentTip: z.boolean(),
  offPlayer1: z.instanceof(Player),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
});
export type GameEventJumpBall = z.infer<typeof GameEventJumpBall>;

export const GameEvent2FgAttempt = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent2FgAttempt = z.infer<typeof GameEvent2FgAttempt>;

export const GameEvent2FgMade = z.object({
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offPlayer2: z.instanceof(Player),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent2FgMade = z.infer<typeof GameEvent2FgMade>;

export const GameEvent2FgMiss = z.object({
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent2FgMiss = z.infer<typeof GameEvent2FgMiss>;

export const GameEvent2FgMadeFoul = z.object({
  foulPenaltySettings: FoulPenaltySettings,
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offPlayer2: z.instanceof(Player),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offTeam: z.instanceof(Team),
  segment: z.number().optional(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent2FgMadeFoul = z.infer<typeof GameEvent2FgMadeFoul>;

export const GameEvent2FgMissFoul = z.object({
  foulPenaltySettings: FoulPenaltySettings,
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  segment: z.number().optional(),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent2FgMissFoul = z.infer<typeof GameEvent2FgMissFoul>;

export const GameEvent3FgMade = z.object({
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offPlayer2: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent3FgMade = z.infer<typeof GameEvent3FgMade>;

export const GameEvent3FgMiss = z.object({
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  shotType: ShotTypes,
  shotValue: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GameEvent3FgMiss = z.infer<typeof GameEvent3FgMiss>;

export const GameEvent3FgMadeFoul = z.object({
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  foulPenaltySettings: FoulPenaltySettings,
  offPlayer1: z.instanceof(Player),
  offPlayer2: z.instanceof(Player),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
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
  foulPenaltySettings: FoulPenaltySettings,
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
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
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  defTeam: z.instanceof(Team),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
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
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player).optional(),
  offTeam: z.instanceof(Team),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  possessionLength: z.number(),
});
export type GameEventOffensiveRebound = z.infer<
  typeof GameEventOffensiveRebound
>;

export const GameEventDefensiveRebound = z.object({
  defPlayer1: z.instanceof(Player).optional(),
  defTeam: z.instanceof(Team),
  offTeam: z.instanceof(Team),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
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

export const GameEventFreeThrow = z.object({
  bonus: z.boolean().optional(),
  defTeam: z.instanceof(Team),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  shotNumber: z.number().min(1).max(3),
  shotValue: z.number(),
  totalShots: z.number().min(1).max(3),
  valueToAdd: z.number(),
});
export type GameEventFreeThrow = z.infer<typeof GameEventFreeThrow>;

export const GameEventOffensiveFoul = z.object({
  defPlayersOnCourt: z.array(z.instanceof(Player)),
  defTeam: z.instanceof(Team),
  isCharge: z.boolean(),
  offPlayersOnCourt: z.array(z.instanceof(Player)),
  offPlayer1: z.instanceof(Player),
  offTeam: z.instanceof(Team),
  possessionLength: z.number(),
});
export type GameEventOffensiveFoul = z.infer<typeof GameEventOffensiveFoul>;

export const GameEventNonShootingDefensiveFoul = z.object({
  defPlayer1: z.instanceof(Player),
  defTeam: z.instanceof(Team),
  foulPenaltySettings: FoulPenaltySettings,
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
  GameEventTurnover,
  GameEventViolation,
  z.object({}),
]);
export type GameEventData = z.infer<typeof GameEventData>;
