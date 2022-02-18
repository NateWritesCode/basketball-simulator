import { z } from "zod";

export const PositivePlayerRatingFieldEnum = z.enum(["height", "jumping"]);
export type PositivePlayerRatingFieldEnum = z.infer<
  typeof PositivePlayerRatingFieldEnum
>;

export const PositivePlayerRatingFields = z.array(
  PositivePlayerRatingFieldEnum
);
export type PositivePlayerRatingFields = z.infer<
  typeof PositivePlayerRatingFields
>;

export const NegativePlayerRatingFieldEnum = z.enum(["irritability"]);
export type NegativePlayerRatingFieldEnum = z.infer<
  typeof NegativePlayerRatingFieldEnum
>;

export const NegativePlayerRatingFields = z.array(
  NegativePlayerRatingFieldEnum
);
export type NegativePlayerRatingFields = z.infer<
  typeof NegativePlayerRatingFields
>;

export const PositivePlayerStateFieldEnum = z.enum(["inspiration"]);
export type PositivePlayerStateFieldEnum = z.infer<
  typeof PositivePlayerStateFieldEnum
>;

export const PositivePlayerStateFields = z.array(PositivePlayerStateFieldEnum);
export type PositivePlayerStateFields = z.infer<
  typeof PositivePlayerStateFields
>;

export const NegativePlayerStateFieldEnum = z.enum(["fatigue"]);
export type NegativePlayerStateFieldEnum = z.infer<
  typeof NegativePlayerStateFieldEnum
>;

export const NegativePlayerStateFields = z.array(NegativePlayerStateFieldEnum);
export type NegativePlayerStateFields = z.infer<
  typeof NegativePlayerStateFields
>;

export const PlayerRatingFields = z.union([
  PositivePlayerRatingFields,
  NegativePlayerRatingFields,
]);
export type PlayerRatingFields = z.infer<typeof PlayerRatingFields>;

export const PlayerStateFields = z.union([
  PositivePlayerStateFields,
  NegativePlayerStateFields,
]);
export type PlayerStateFields = z.infer<typeof PlayerStateFields>;

export const GameSimPlayerFields = z.object({
  positivePlayerRatingFields: PositivePlayerRatingFields.optional(),
  positivePlayerStateFields: PositivePlayerStateFields.optional(),
  negativePlayerRatingFields: NegativePlayerRatingFields.optional(),
  negativePlayerStateFields: NegativePlayerStateFields.optional(),
});
export type GameSimPlayerFields = z.infer<typeof GameSimPlayerFields>;
