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
  "BAD_PASS", //STEAL
  "BAD_PASS_OUT_OF_BOUNDS",
  "KICKED_BALL",
  "LANE_VIOLATION",
  "LOST_BALL", //STEAL
  "LOST_BALL_OUT_OF_BOUNDS",
  "OFFENSIVE_GOALTENDING",
  "SHOT_CLOCK_VIOLATION",
  "STEP_OUT_OF_BOUNDS",
  "THREE_SECONDS_VIOLATION",
  "TRAVEL",
]);

export const ViolationTypes = z.enum([
  "DOUBLE_LANE_VIOLATION",
  "DELAY_OF_GAME",
  "GOALTEND_VIOLATION",
  "JUMPBALL_VIOLATION",
  "KICKED_BALL_VILATION",
  "LANE_VIOLATION",
]);

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
  "NON_SHOOTING_DEFENSIVE_FOUL",
  "OFFENSIVE_REBOUND",
  "POSSESSION_ARROW_WON",
  "SEGMENT_START",
  "SEGMENT_END",
  "STARTING_LINEUP",
  "STEAL",
  "TURNOVER",
]);

export const GameEventPossessionEventOutcomes = z.enum([
  "NON_SHOOTING_DEFENSIVE_FOUL",
  "JUMP_BALL",
  "SHOT",
  "TURNOVER",
]);

export type GameEventEnum = z.infer<typeof GameEventEnum>;

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
