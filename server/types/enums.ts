import { z } from "zod";

export const ShotTypes = z.enum([
  "ARC_3",
  "AT_RIM",
  "CORNER_3",
  "LONG_MID_RANGE",
  "SHORT_MID_RANGE",
]);
export type ShotTypes = z.infer<typeof ShotTypes>;

export const TurnoverTypes = z.enum([
  "3_SECOND",
  "BAD_PASS",
  "BAD_PASS_OUT_OF_BOUNDS",
  "KICK_BALL",
  "LANE_VIOLATION",
  "LOST_BALL",
  "LOST_BALL_OUT_OF_BOUNDS",
  "OFFENSIVE_GOALTENDING",
  "SHOT_CLOCK",
  "STEP_OUT_OF_BOUNDS",
  "TRAVEL",
]);
export type TurnoverTypes = z.infer<typeof TurnoverTypes>;

export const ViolationTypes = z.enum([
  "DEFENSIVE_GOALTENDING",
  "DEFENSIVE_KICK_BALL",
]);
export type ViolationTypes = z.infer<typeof ViolationTypes>;

export const GameEventEnum = z.enum([
  "2FG_ATTEMPT",
  "2FG_BLOCK",
  "2FG_MADE",
  "2FG_MADE_FOUL",
  "2FG_MISS",
  "2FG_MISS_FOUL",
  "3FG_ATTEMPT",
  "3FG_BLOCK",
  "3FG_MADE",
  "3FG_MISS",
  "3FG_MADE_FOUL",
  "3FG_MISS_FOUL",
  "DEFENSIVE_REBOUND",
  "EJECTION",
  "FOUL_DEFENSIVE_NON_SHOOTING",
  "FOUL_OFFENSIVE",
  "FOUL_TECHNICAL",
  "FREE_THROW",
  "GAME_END",
  "GAME_START",
  "JUMP_BALL",
  "OFFENSIVE_REBOUND",
  "POSSESSION_ARROW",
  "SEGMENT_START",
  "SEGMENT_END",
  "STARTING_LINEUP",
  "STEAL",
  "SUBSTITUTION",
  "TIMEOUT",
  "TURNOVER",
  "VIOLATION",
]);
export type GameEventEnum = z.infer<typeof GameEventEnum>;

export const FoulTypesDefensiveNonShooting = z.enum([
  "CLEAR_PATH",
  "DOUBLE",
  "FLAGRANT_1",
  "FLAGRANT_2",
  "INBOUND",
  "LOOSE_BALL",
  "PERSONAL",
  "PERSONAL_BLOCK",
  "PERSONAL_TAKE",
]);
export type FoulTypesDefensiveNonShooting = z.infer<
  typeof FoulTypesDefensiveNonShooting
>;

export const EjectionReasons = z.enum([
  "FLAGRANT_1",
  "FLAGRANT_2",
  "TECHNICAL",
]);
export type EjectionReasons = z.infer<typeof EjectionReasons>;

export const TechnicalReasons = z.enum(["ARGUING_WITH_OFFICIAL", "FIGHTING"]);
export type TechnicalReasons = z.infer<typeof TechnicalReasons>;

export const GameEventPossessionOutcomes = z.enum([
  "FIELD_GOAL",
  "FOUL_DEFENSIVE_NON_SHOOTING",
  "FOUL_OFFENSIVE",
  "JUMP_BALL",
  "TURNOVER",
  "VIOLATION_DEFENSIVE_GOALTENDING",
  "VIOLATION_DEFENSIVE_KICK_BALL",
]);
export type GameEventPossessionOutcomes = z.infer<
  typeof GameEventPossessionOutcomes
>;

export enum OvertimeLength { // in seconds
  NBA = 300,
}

export const OvertimeLengthEnum = z.nativeEnum(OvertimeLength);
export type OvertimeLengthEnum = z.infer<typeof OvertimeLengthEnum>;

export const OvertimeTypeEnum = z.enum(["shootout", "time"]);
export type OvertimeTypeEnum = z.infer<typeof OvertimeTypeEnum>;

export enum GameTypeTimeSegments {
  Full = 1,
  Half = 2,
  Third = 3,
  Quarter = 4,
  Eighth = 8,
}
export const GameTypeTimeSegmentsEnum = z.nativeEnum(GameTypeTimeSegments);
export type GameTypeTimeSegmentsEnum = z.infer<typeof GameTypeTimeSegmentsEnum>;

export enum ShotClockLength {
  NBA = 24,
  College = 30,
}
export const ShotClockLengthEnum = z.nativeEnum(ShotClockLength);
export type ShotClockLengthEnum = z.infer<typeof ShotClockLengthEnum>;

export enum GameTotalTime { //in seconds
  College = 2400,
  NBA = 2880,
  Testing = 500,
}
export const GameTotalTimeEnum = z.nativeEnum(GameTotalTime);
export type GameTotalTimeEnum = z.infer<typeof GameTotalTimeEnum>;

export const GameTypeEnum = z.enum(["time", "points"]);
export type GameTypeEnum = z.infer<typeof GameTypeEnum>;

export const PossessionTossupMethodEnum = z.enum([
  "JUMP_BALL",
  "POSSESSION_ARROW",
]);
export type PossessionTossupMethodEnum = z.infer<
  typeof PossessionTossupMethodEnum
>;

export enum TeamIndex {
  Zero = 0,
  One = 1,
}
export const TeamIndexEnum = z.nativeEnum(TeamIndex);
export type TeamIndexEnum = z.infer<typeof TeamIndexEnum>;

export const GameSimStatFields = z.enum([
  "pts",
  "jumpBallsWon",
  "jumpBallsLost",
]);
export type GameSimStatFields = z.infer<typeof GameSimStatFields>;
