import { z } from "zod";

export const ShotTypes = z.enum([
  "Arc3",
  "AtRim",
  "Corner3",
  "LongMidRange",
  "ShortMidRange",
]);
export type ShotTypes = z.infer<typeof ShotTypes>;

export const FgTypesCoded = z.enum([
  "ARC_300000",
  "ARC_300010",
  "ARC_300100",
  "ARC_301010",
  "ARC_310010",
  "ARC_311010",
  "AT_RIM00000",
  "AT_RIM00001",
  "AT_RIM00010",
  "AT_RIM00011",
  "AT_RIM00100",
  "AT_RIM00101",
  "AT_RIM01010",
  "AT_RIM10000",
  "AT_RIM10010",
  "AT_RIM10011",
  "AT_RIM11010",
  "CORNER_300000",
  "CORNER_300010",
  "CORNER_300100",
  "CORNER_301010",
  "CORNER_310010",
  "CORNER_311010",
  "LONG_MID_RANGE00000",
  "LONG_MID_RANGE00001",
  "LONG_MID_RANGE00010",
  "LONG_MID_RANGE00011",
  "LONG_MID_RANGE00100",
  "LONG_MID_RANGE00101",
  "LONG_MID_RANGE01010",
  "LONG_MID_RANGE10010",
  "LONG_MID_RANGE10011",
  "LONG_MID_RANGE11010",
  "SHORT_MID_RANGE00000",
  "SHORT_MID_RANGE00001",
  "SHORT_MID_RANGE00010",
  "SHORT_MID_RANGE00011",
  "SHORT_MID_RANGE00100",
  "SHORT_MID_RANGE00101",
  "SHORT_MID_RANGE01010",
  "SHORT_MID_RANGE10000",
  "SHORT_MID_RANGE10010",
  "SHORT_MID_RANGE10011",
  "SHORT_MID_RANGE10100",
  "SHORT_MID_RANGE11010",
]);
export type FgTypesCoded = z.infer<typeof FgTypesCoded>;

export const TurnoverTypes = z.enum([
  "3_SECOND",
  "BAD_PASS",
  "BAD_PASS_OUT_OF_BOUNDS",
  "KICK_BALL",
  "LANE_VIOLATION",
  "LOST_BALL",
  "LOST_BALL_OUT_OF_BOUNDS",
  "OFF_GOALTEND",
  "SHOT_CLOCK",
  "STEP_OUT_OF_BOUNDS",
  "TRAVEL",
]);
export type TurnoverTypes = z.infer<typeof TurnoverTypes>;

export const ViolationTypes = z.enum(["DEF_GOALTEND", "DEF_KICK_BALL"]);
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
  "FREE_THROW",
  "GAME_START",
  "GAME_END",
  "JUMP_BALL",
  "FOUL_DEFENSIVE_NON_SHOOTING",
  "OFFENSIVE_FOUL",
  "OFFENSIVE_REBOUND",
  "POSSESSION_ARROW_WON",
  "SEGMENT_START",
  "SEGMENT_END",
  "STARTING_LINEUP",
  "STEAL",
  "TURNOVER",
  "VIOLATION",
]);
export type GameEventEnum = z.infer<typeof GameEventEnum>;

export const GameEventPossessionOutcomes = z.enum([
  "FOUL_DEFENSIVE_NON_SHOOTING",
  "JUMP_BALL",
  "OFFENSIVE_FOUL",
  "FIELD_GOAL",
  "TURNOVER",
  "VIOLATION_DEF_GOALTEND",
  "VIOLATION_DEF_KICK_BALL",
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
  "jumpBall",
  "possessionArrow",
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
