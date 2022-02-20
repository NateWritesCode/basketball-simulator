import { z } from "zod";

export const Pbp = z.object({
  defense_team_id: z.string(),
  event_num: z.number(),
  game_id: z.string(),
  is_count_as_possession: z.boolean(),
  is_ejection: z.boolean(),
  is_end_of_period: z.boolean(),
  is_field_goal: z.boolean(),
  is_foul: z.boolean(),
  is_free_throw: z.boolean(),
  is_jump_ball: z.boolean(),
  is_one_of_multiple_events_at_same_time: z.boolean(),
  is_penalty_event: z.boolean(),
  is_possession_ending: z.boolean(),
  is_rebound: z.boolean(),
  is_replay: z.boolean(),
  is_second_chance_event: z.boolean(),
  is_start_of_period: z.boolean(),
  is_substitution: z.boolean(),
  is_timeout: z.boolean(),
  is_turnover: z.boolean(),
  is_violation: z.boolean(),
  offense_team_id: z.number(),
  pbp_id: z.string(),
  player1_id: z.string().or(z.null()),
  player2_id: z.string().or(z.null()),
  player3_id: z.string(),
  possession_length: z.number().or(z.null()),
  seconds_remaining: z.number(),
  score_margin: z.number(),
});

export type Pbp = z.infer<typeof Pbp>;

export const PbpFg = z.object({
  distance: z.number(),
  is_and1: z.boolean(),
  is_assisted: z.boolean(),
  is_blocked: z.boolean(),
  is_corner_3: z.boolean(),
  is_heave: z.boolean(),
  is_made: z.boolean(),
  is_make_that_does_not_end_possession: z.boolean(),
  is_putback: z.boolean(),
  pbp_id: z.string(),
  shot_type: z.string(),
  shot_value: z.number(),
  x: z.number(),
  y: z.number(),
});

export type PbpFg = z.infer<typeof PbpFg>;

export const PbpFoul = z.object({
  number_of_fta_for_foul: z.number(),
  is_personal_foul: z.boolean(),
  is_shooting_foul: z.boolean(),
  is_loose_ball_foul: z.boolean(),
  is_offensive_foul: z.boolean(),
  is_inbound_foul: z.boolean(),
  is_away_from_play_foul: z.boolean(),
  is_clear_path_foul: z.boolean(),
  is_double_foul: z.boolean(),
  is_technical: z.boolean(),
  is_flagrant: z.boolean(),
  is_flagrant1: z.boolean(),
  is_flagrant2: z.boolean(),
  is_double_technical: z.boolean(),
  is_defensive_3_seconds: z.boolean(),
  is_delay_of_game: z.boolean(),
  is_charge: z.boolean(),
  is_personal_block_foul: z.boolean(),
  is_personal_take_foul: z.boolean(),
  is_shooting_block_foul: z.boolean(),
  is_counts_towards_penalty: z.boolean(),
  is_counts_as_personal_foul: z.boolean(),
  foul_type: z.string(),
  pbp_id: z.string(),
});

export type PbpFoul = z.infer<typeof PbpFoul>;

export const PbpFt = z.object({
  free_throw_type: z.string(),
  is_made: z.boolean(),
  is_ft_1_of_1: z.boolean(),
  is_ft_1_of_2: z.boolean(),
  is_ft_2_of_2: z.boolean(),
  is_ft_1_of_3: z.boolean(),
  is_ft_2_of_3: z.boolean(),
  is_ft_3_of_3: z.boolean(),
  is_first_ft: z.boolean(),
  is_end_ft: z.boolean(),
  is_technical_ft: z.boolean(),
  is_ft_1pt: z.boolean(),
  is_ft_2pt: z.boolean(),
  is_ft_3pt: z.boolean(),
  is_away_from_play_ft: z.boolean(),
  is_inbound_foul_ft: z.boolean(),
  foul_pbp_id: z.string(),
  num_ft_for_trip: z.number(),
  pbp_id: z.string(),
  shot_value: z.number(),
});

export type PbpFt = z.infer<typeof PbpFt>;

export const PbpJumpBall = z.object({
  pbp_id: z.string(),
  winning_team: z.number(),
});

export type PbpJumpBall = z.infer<typeof PbpJumpBall>;

export const PbpRebound = z.object({
  is_buzzer_beater_rebound_at_shot_time: z.boolean(),
  is_buzzer_beater_placeholder: z.boolean(),
  is_non_live_ft_placeholder: z.boolean(),
  is_placeholder: z.boolean(),
  is_real_rebound: z.boolean(),
  is_self_reb: z.boolean(),
  is_turnover_placeholder: z.boolean(),
  pbp_id: z.string(),
});

export type PbpRebound = z.infer<typeof PbpRebound>;

export const PbpSubstitution = z.object({
  incoming_player_id: z.string(),
  outgoing_player_id: z.string(),
  pbp_id: z.string(),
});

export type PbpSubstitution = z.infer<typeof PbpSubstitution>;

export const PbpTurnover = z.object({
  is_3_second_violation: z.boolean(),
  is_bad_pass: z.boolean(),
  is_bad_pass_out_of_bounds: z.boolean(),
  is_kicked_ball: z.boolean(),
  is_lane_violation: z.boolean(),
  is_lost_ball: z.boolean(),
  is_lost_ball_out_of_bounds: z.boolean(),
  is_no_turnover: z.boolean(),
  is_offensive_goaltending: z.boolean(),
  is_shot_clock_violation: z.boolean(),
  is_steal: z.boolean(),
  is_step_out_of_bounds: z.boolean(),
  is_travel: z.boolean(),
  pbp_id: z.string(),
});

export type PbpTurnover = z.infer<typeof PbpTurnover>;

export const PbpViolation = z.object({
  is_double_lane_violation: z.boolean(),
  is_delay_of_game: z.boolean(),
  is_goaltend_violation: z.boolean(),
  is_jumpball_violation: z.boolean(),
  is_kicked_ball_violation: z.boolean(),
  is_lane_violation: z.boolean(),
  pbp_id: z.string(),
});

export type PbpViolation = z.infer<typeof PbpViolation>;
