import { z } from "zod";
import { FoulPenaltySettings, ShotTypes, TurnoverTypes } from ".";
import { Player, Team } from "../entities";
import { GameSimTeams, PlayersOnCourt } from "./gameSim";

export const GameEventStartingLineup = z.object({
  playersOnCourt: PlayersOnCourt,
  teams: GameSimTeams,
});
export type GameEventStartingLineup = z.infer<typeof GameEventStartingLineup>;

export const GameEventJumpBallWon = z.object({
  isInitialTip: z.boolean(),
  losingPlayer: z.instanceof(Player),
  winningPlayer: z.instanceof(Player),
  team: z.instanceof(Team),
});
export type GameEventJumpBallWon = z.infer<typeof GameEventJumpBallWon>;

export const GameEvent2FgAttempt = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent2FgAttempt = z.infer<typeof GameEvent2FgAttempt>;

export const GameEvent2FgMade = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent2FgMade = z.infer<typeof GameEvent2FgMade>;

export const GameEvent2FgMiss = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent2FgMiss = z.infer<typeof GameEvent2FgMiss>;

export const GameEvent2FgMadeFoul = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  foulingPlayer: z.instanceof(Player),
  segment: z.number().optional(),
  foulPenaltySettings: FoulPenaltySettings,
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent2FgMadeFoul = z.infer<typeof GameEvent2FgMadeFoul>;

export const GameEvent2FgMissFoul = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  foulingPlayer: z.instanceof(Player),
  segment: z.number().optional(),
  foulPenaltySettings: FoulPenaltySettings,
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent2FgMissFoul = z.infer<typeof GameEvent2FgMissFoul>;

export const GameEvent3FgMade = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent3FgMade = z.infer<typeof GameEvent3FgMade>;

export const GameEvent3FgMiss = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent3FgMiss = z.infer<typeof GameEvent3FgMiss>;

export const GameEvent3FgMadeFoul = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  foulingPlayer: z.instanceof(Player),
  segment: z.number().optional(),
  foulPenaltySettings: FoulPenaltySettings,
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent3FgMadeFoul = z.infer<typeof GameEvent3FgMadeFoul>;

export const GameEvent3FgMissFoul = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  foulingPlayer: z.instanceof(Player),
  segment: z.number().optional(),
  foulPenaltySettings: FoulPenaltySettings,
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent3FgMissFoul = z.infer<typeof GameEvent3FgMissFoul>;

export const GameEvent3FgAttempt = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  x: z.number(),
  y: z.number(),
  shotType: ShotTypes,
});
export type GameEvent3FgAttempt = z.infer<typeof GameEvent3FgAttempt>;

export const GameEventBlock = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  blockingPlayer: z.instanceof(Player),
});
export type GameEventBlock = z.infer<typeof GameEventBlock>;

export const GameEventRebound = z.object({
  player: z.instanceof(Player).optional(),
  team: z.instanceof(Team),
});
export type GameEventRebound = z.infer<typeof GameEventRebound>;

export const GameEventSegment = z.object({
  segment: z.number(),
  timeSegmentIndex: z.number(),
});
export type GameEventSegment = z.infer<typeof GameEventSegment>;

export const GameEventFreeThrow = z.object({
  bonus: z.boolean().optional(),
  player: z.instanceof(Player),
  shotMade: z.boolean(),
  shotNumber: z.number().min(1).max(3),
  team: z.instanceof(Team),
  totalShots: z.number().min(1).max(3),
});
export type GameEventFreeThrow = z.infer<typeof GameEventFreeThrow>;

export const GameEventNonShootingDefensiveFoul = z.object({
  player: z.instanceof(Player),
  segment: z.number().optional(),
  team: z.instanceof(Team),
  foulingPlayer: z.instanceof(Player),
  foulPenaltySettings: FoulPenaltySettings,
});
export type GameEventNonShootingDefensiveFoul = z.infer<
  typeof GameEventNonShootingDefensiveFoul
>;

export const GameEventPossessionArrowWon = z.object({
  team: z.instanceof(Team),
});

export const GameEventSteal = z.object({
  player: z.instanceof(Player),
  stealingPlayer: z.instanceof(Player),
  team: z.instanceof(Team),
});
export type GameEventSteal = z.infer<typeof GameEventSteal>;

export const GameEventTurnover = z.object({
  player: z.instanceof(Player),
  team: z.instanceof(Team),
  turnoverType: TurnoverTypes,
});
export type GameEventTurnover = z.infer<typeof GameEventTurnover>;

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
  GameEventJumpBallWon,
  GameEventNonShootingDefensiveFoul,
  GameEventPossessionArrowWon,
  GameEventRebound,
  GameEventSegment,
  GameEventStartingLineup,
  GameEventSteal,
  GameEventTurnover,
]);
export type GameEventData = z.infer<typeof GameEventData>;
