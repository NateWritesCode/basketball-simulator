from numpy.lib.arraysetops import isin
from pbpstats.client import Client
from pbpstats.resources.enhanced_pbp.enhanced_pbp_item import EnhancedPbpItem
from pbpstats.resources.enhanced_pbp.ejection import Ejection
from pbpstats.resources.enhanced_pbp.end_of_period import EndOfPeriod
from pbpstats.resources.enhanced_pbp.field_goal import FieldGoal
from pbpstats.resources.enhanced_pbp.foul import Foul
from pbpstats.resources.enhanced_pbp.free_throw import FreeThrow
from pbpstats.resources.enhanced_pbp.jump_ball import JumpBall
from pbpstats.resources.enhanced_pbp.rebound import Rebound
from pbpstats.resources.enhanced_pbp.replay import Replay
from pbpstats.resources.enhanced_pbp.start_of_period import StartOfPeriod
from pbpstats.resources.enhanced_pbp.substitution import Substitution
from pbpstats.resources.enhanced_pbp.timeout import Timeout
from pbpstats.resources.enhanced_pbp.turnover import Turnover
from pbpstats.resources.enhanced_pbp.violation import Violation
import numpy as np
from os import listdir
import pandas as pd
import traceback
np.random.seed(123)


def get_game_id(string):
    return string.split("_")[1].replace(".json", "")


def update_row(dict, data, key, value):
    keys = dict.keys()
    index = None

    for idx, dict_key in enumerate(keys):
        if dict_key == key:
            index = idx
            break

    data[index] = value


seconds_regulation_quarter = 720.0
seconds_overtime = 300.0


game_ids = list(map(get_game_id, listdir("./response_data/pbp")))
# game_ids = game_ids[1438:1441]


pbp_ref = {
    "defense_team_id": {
        "data_type": "string"
    },
    "event_num": {
        "data_type": "integer"
    },
    "game_id": {
        "data_type": "string"
    },
    "is_count_as_possession": {
        "data_type": "boolean",
    },
    "is_ejection": {
        "data_type": "boolean",
    },
    "is_end_of_period": {
        "data_type": "boolean",
    },
    "is_field_goal": {
        "data_type": "boolean",
    },
    "is_foul": {
        "data_type": "boolean",
    },
    "is_free_throw": {
        "data_type": "boolean",
    },
    "is_jump_ball": {
        "data_type": "boolean",
    },
    "is_one_of_multiple_events_at_same_time": {
        "data_type": "boolean"
    },
    "is_penalty_event": {
        "data_type": "boolean"
    },
    "is_possession_ending": {
        "data_type": "boolean",
    },
    "is_rebound": {
        "data_type": "boolean",
    },
    "is_replay": {
        "data_type": "boolean",
    },
    "is_second_chance_event": {
        "data_type": "boolean"
    },
    "is_start_of_period": {
        "data_type": "boolean",
    },
    "is_substitution": {
        "data_type": "boolean",
    },
    "is_timeout": {
        "data_type": "boolean",
    },
    "is_turnover": {
        "data_type": "boolean",
    },
    "is_violation": {
        "data_type": "boolean",
    },
    "offense_team_id": {
        "data_type": "string"
    },
    "pbp_id": {
        "data_type": "string"
    },
    "player1_id": {
        "data_type": "string"
    },
    "player2_id": {
        "data_type": "string"
    },
    "player3_id": {
        "data_type": "string"
    },
    "possession_length": {
        "data_type": "float"
    },
    "seconds_remaining": {
        "data_type": "float"
    },
    "score_margin": {
        "data_type": "integer"
    }
}

fg_ref = {
    "distance": {
        "data_type": "integer"
    },
    "is_and1": {
        "data_type": "boolean"
    },
    "is_assisted": {
        "data_type": "boolean"
    },
    "is_blocked": {
        "data_type": "boolean"
    },
    "is_corner_3": {
        "data_type": "boolean"
    },
    "is_heave": {
        "data_type": "boolean"
    },
    "is_made": {
        "data_type": "boolean"
    },
    "is_make_that_does_not_end_possession": {
        "data_type": "boolean"
    },
    "is_putback": {
        "data_type": "boolean"
    },
    "pbp_id": {
        "data_type": "string"
    },
    "shot_type": {
        "data_type": "string"
    },
    "shot_value": {
        "data_type": "integer"
    },
    "x": {
        "data_type": "integer"
    },
    "y": {
        "data_type": "integer"
    }
}

foul_ref = {
    "number_of_fta_for_foul": {
        "data_type": "integer"
    },
    "is_personal_foul": {
        "data_type": "boolean"
    },
    "is_shooting_foul": {
        "data_type": "boolean"
    },
    "is_loose_ball_foul": {
        "data_type": "boolean"
    },
    "is_offensive_foul": {
        "data_type": "boolean"
    },
    "is_inbound_foul": {
        "data_type": "boolean"
    },
    "is_away_from_play_foul": {
        "data_type": "boolean"
    },
    "is_clear_path_foul": {
        "data_type": "boolean"
    },
    "is_double_foul": {
        "data_type": "boolean"
    },
    "is_technical": {
        "data_type": "boolean"
    },
    "is_flagrant": {
        "data_type": "boolean"
    },
    "is_flagrant1": {
        "data_type": "boolean"
    },
    "is_flagrant2": {
        "data_type": "boolean"
    },
    "is_double_technical": {
        "data_type": "boolean"
    },
    "is_defensive_3_seconds": {
        "data_type": "boolean"
    },
    "is_delay_of_game": {
        "data_type": "boolean"
    },
    "is_charge": {
        "data_type": "boolean"
    },
    "is_personal_block_foul": {
        "data_type": "boolean"
    },
    "is_personal_take_foul": {
        "data_type": "boolean"
    },
    "is_shooting_block_foul": {
        "data_type": "boolean"
    },
    "is_counts_towards_penalty": {
        "data_type": "boolean"
    },
    "is_counts_as_personal_foul": {
        "data_type": "boolean"
    },
    "foul_type": {
        "data_type": "string"
    },
    "pbp_id": {
        "data_type": "string"
    }
}

ft_ref = {
    "free_throw_type": {
        "data_type": "string"
    },
    "is_made": {
        "data_type": "boolean"
    },
    "is_ft_1_of_1": {
        "data_type": "boolean"
    },
    "is_ft_1_of_2": {
        "data_type": "boolean"
    },
    "is_ft_2_of_2": {
        "data_type": "boolean"
    },
    "is_ft_1_of_3": {
        "data_type": "boolean"
    },
    "is_ft_2_of_3": {
        "data_type": "boolean"
    },
    "is_ft_3_of_3": {
        "data_type": "boolean"
    },
    "is_first_ft": {
        "data_type": "boolean"
    },
    "is_end_ft": {
        "data_type": "boolean"
    },
    "is_technical_ft": {
        "data_type": "boolean"
    },
    "is_ft_1pt": {
        "data_type": "boolean"
    },
    "is_ft_2pt": {
        "data_type": "boolean"
    },
    "is_ft_3pt": {
        "data_type": "boolean"
    },
    "is_away_from_play_ft": {
        "data_type": "boolean"
    },
    "is_inbound_foul_ft": {
        "data_type": "boolean"
    },
    "foul_pbp_id": {
        "data_type": "string"
    },
    "num_ft_for_trip": {
        "data_type": "integer"
    },
    "pbp_id": {
        "data_type": "string"
    },
    "shot_value": {
        "data_type": "integer"
    },
}

jump_ball_ref = {
    "pbp_id": {
        "data_type": "string"
    },
    "winning_team": {
        "data_type": "string"
    }
}

rebound_ref = {
    "is_buzzer_beater_rebound_at_shot_time": {
        "data_type": "boolean"
    },
    "is_buzzer_beater_placeholder": {
        "data_type": "boolean"
    },
    "is_non_live_ft_placeholder": {
        "data_type": "boolean"
    },
    "is_placeholder": {
        "data_type": "boolean"
    },
    "is_real_rebound": {
        "data_type": "boolean"
    },
    "is_self_reb": {
        "data_type": "boolean"
    },
    "is_turnover_placeholder": {
        "data_type": "boolean"
    },
    "pbp_id": {
        "data_type": "string"
    },
}

replay_ref = {
    "overturn_ruling": {
        "data_type": "boolean"
    },
    "pbp_id": {
        "data_type": "string"
    },
    "ruling_stands": {
        "data_type": "boolean"
    },
    "support_ruling": {
        "data_type": "boolean"
    }
}

substitution_ref = {
    "incoming_player_id": {
        "data_type": "string"
    },
    "outgoing_player_id": {
        "data_type": "string"
    },
    "pbp_id": {
        "data_type": "string"
    },
}

turnover_ref = {
    "is_3_second_violation": {
        "data_type": "boolean"
    },
    "is_bad_pass": {
        "data_type": "boolean"
    },
    "is_bad_pass_out_of_bounds": {
        "data_type": "boolean"
    },
    "is_kicked_ball": {
        "data_type": "boolean"
    },
    "is_lane_violation": {
        "data_type": "boolean"
    },
    "is_lost_ball": {
        "data_type": "boolean"
    },
    "is_lost_ball_out_of_bounds": {
        "data_type": "boolean"
    },
    "is_no_turnover": {
        "data_type": "boolean"
    },
    "is_offensive_goaltending": {
        "data_type": "boolean"
    },
    "is_shot_clock_violation": {
        "data_type": "boolean"
    },
    "is_steal": {
        "data_type": "boolean"
    },
    "is_step_out_of_bounds": {
        "data_type": "boolean"
    },
    "is_travel": {
        "data_type": "boolean"
    },
    "pbp_id": {
        "data_type": "string"
    },
}

violation_ref = {
    "is_double_lane_violation": {
        "data_type": "boolean"
    },
    "is_delay_of_game": {
        "data_type": "boolean"
    },
    "is_goaltend_violation": {
        "data_type": "boolean"
    },
    "is_jumpball_violation": {
        "data_type": "boolean"
    },
    "is_kicked_ball_violation": {
        "data_type": "boolean"
    },
    "is_lane_violation": {
        "data_type": "boolean"
    },
    "pbp_id": {
        "data_type": "string"
    },
}

fg_data = []
foul_data = []
ft_data = []
jump_ball_data = []
pbp_data = []
rebound_data = []
substitution_data = []
turnover_data = []
violation_data = []

possible_keys_set = set()


def get_data_list(ref_obj):
    data = [None] * len(ref_obj.keys())
    keys = ref_obj.keys()
    for idx, key in enumerate(keys):
        data_type = ref_obj[key]["data_type"]
        default_value = None
        if (data_type == "boolean"):
            data[idx] = False

        if default_value in ref_obj[key]:
            data[idx] = ref_obj[key]["default_value"]
    return data


num_games_to_process = len(game_ids)
counter = 0

for game_id in game_ids:
    counter += 1
    print("Processed", counter, "of", num_games_to_process)
    settings = {
        "dir": "response_data",
        "Boxscore": {"source": "file", "data_provider": "stats_nba"},
        "Possessions": {"source": "file", "data_provider": "stats_nba"},
    }
    client = Client(settings)
    game = None
    try:
        game = client.Game(game_id)
    except Exception as e:
        print("Problem with gameID", game_id, e)
        continue

    time_temp = seconds_regulation_quarter

    for possession in game.possessions.items:
        try:
            possession_stats = possession.possession_stats

            for possession_event in possession.events:

                try:
                    pbp_id = f'{game_id}-{possession_event.event_num}'
                    poss_general_data = get_data_list(pbp_ref)

                    try:
                        team_ids = possession.get_team_ids()
                        team_1 = str(team_ids[0])
                        team_2 = str(team_ids[1])

                        update_row(pbp_ref, poss_general_data,
                                   "offense_team_id", team_1 if possession_event.get_offense_team_id() == team_2 else team_1)
                        update_row(pbp_ref, poss_general_data,
                                   "defense_team_id", team_1 if possession_event.get_offense_team_id() == team_1 else team_2)

                    except Exception as e:
                        print("Top innie: ", e)

                    if hasattr(possession_event, 'player1_id') and possession_event.player1_id != "0":
                        update_row(pbp_ref, poss_general_data,
                                   "player1_id", str(possession_event.player1_id))
                    if hasattr(possession_event, 'player2_id'):
                        update_row(pbp_ref, poss_general_data,
                                   "player2_id", str(possession_event.player2_id))
                    if hasattr(possession_event, 'player3_id'):
                        update_row(pbp_ref, poss_general_data,
                                   "player3_id", str(possession_event.player3_id))

                    if possession_event.count_as_possession:
                        update_row(pbp_ref, poss_general_data,
                                   "is_count_as_possession", True)

                    if possession_event.is_possession_ending_event:
                        update_row(pbp_ref, poss_general_data,
                                   "is_possession_ending", True)
                        update_row(pbp_ref, poss_general_data, "possession_length", time_temp -
                                   possession_event.seconds_remaining)
                        # possession_length.append(
                        #     time_temp - possession_event.seconds_remaining)
                        time_temp = possession_event.seconds_remaining
                        if isinstance(possession_event, EndOfPeriod):
                            if possession_event.period >= 4:
                                time_temp = seconds_overtime
                            else:
                                time_temp = seconds_regulation_quarter
                    if isinstance(possession_event, Ejection):
                        update_row(pbp_ref, poss_general_data,
                                   "is_ejection", True)
                    elif isinstance(possession_event, EndOfPeriod):
                        update_row(pbp_ref, poss_general_data,
                                   "is_end_of_period", True)
                    elif isinstance(possession_event, FieldGoal):
                        update_row(pbp_ref, poss_general_data,
                                   "is_field_goal", True)
                        poss_fg_data = get_data_list(fg_ref)
                        update_row(fg_ref, poss_fg_data, "distance",
                                   possession_event.distance)
                        update_row(fg_ref, poss_fg_data, "is_and1",
                                   possession_event.is_and1)
                        update_row(fg_ref, poss_fg_data, "is_assisted",
                                   possession_event.is_assisted)
                        update_row(fg_ref, poss_fg_data, "is_blocked",
                                   possession_event.is_blocked)
                        update_row(fg_ref, poss_fg_data, "is_corner_3",
                                   possession_event.is_corner_3)
                        update_row(fg_ref, poss_fg_data, "is_heave",
                                   possession_event.is_heave)
                        update_row(fg_ref, poss_fg_data, "is_made",
                                   possession_event.is_made)
                        update_row(fg_ref, poss_fg_data, "is_make_that_does_not_end_possession",
                                   possession_event.is_make_that_does_not_end_possession)
                        update_row(fg_ref, poss_fg_data, "is_putback",
                                   possession_event.is_putback)
                        update_row(fg_ref, poss_fg_data, "pbp_id",
                                   pbp_id)
                        update_row(fg_ref, poss_fg_data, "shot_type",
                                   possession_event.shot_type)
                        update_row(fg_ref, poss_fg_data, "shot_value",
                                   possession_event.shot_value)
                        update_row(fg_ref, poss_fg_data, "x",
                                   possession_event.shot_data["X"])
                        update_row(fg_ref, poss_fg_data, "y",
                                   possession_event.shot_data["Y"])
                        fg_data.append(poss_fg_data)
                    elif isinstance(possession_event, Foul):
                        update_row(pbp_ref, poss_general_data, "is_foul", True)
                        poss_foul_data = get_data_list(foul_ref)

                        update_row(foul_ref, poss_foul_data, "number_of_fta_for_foul",
                                   possession_event.number_of_fta_for_foul)
                        update_row(foul_ref, poss_foul_data, "is_personal_foul",
                                   possession_event.is_personal_foul)
                        update_row(foul_ref, poss_foul_data, "is_shooting_foul",
                                   possession_event.is_shooting_foul)
                        update_row(foul_ref, poss_foul_data, "is_loose_ball_foul",
                                   possession_event.is_loose_ball_foul)
                        update_row(foul_ref, poss_foul_data, "is_offensive_foul",
                                   possession_event.is_offensive_foul)
                        update_row(foul_ref, poss_foul_data, "is_inbound_foul",
                                   possession_event.is_inbound_foul)
                        update_row(foul_ref, poss_foul_data, "is_away_from_play_foul",
                                   possession_event.is_away_from_play_foul)
                        update_row(foul_ref, poss_foul_data, "is_clear_path_foul",
                                   possession_event.is_clear_path_foul)
                        update_row(foul_ref, poss_foul_data, "is_double_foul",
                                   possession_event.is_double_foul)
                        update_row(foul_ref, poss_foul_data, "is_technical",
                                   possession_event.is_technical)
                        update_row(foul_ref, poss_foul_data, "is_flagrant",
                                   possession_event.is_flagrant)
                        update_row(foul_ref, poss_foul_data, "is_flagrant1",
                                   possession_event.is_flagrant1)
                        update_row(foul_ref, poss_foul_data, "is_flagrant2",
                                   possession_event.is_flagrant2)
                        update_row(foul_ref, poss_foul_data, "is_double_technical",
                                   possession_event.is_double_technical)
                        update_row(foul_ref, poss_foul_data, "is_defensive_3_seconds",
                                   possession_event.is_defensive_3_seconds)
                        update_row(foul_ref, poss_foul_data, "is_delay_of_game",
                                   possession_event.is_delay_of_game)
                        update_row(foul_ref, poss_foul_data, "is_charge",
                                   possession_event.is_charge)
                        update_row(foul_ref, poss_foul_data, "is_personal_block_foul",
                                   possession_event.is_personal_block_foul)
                        update_row(foul_ref, poss_foul_data, "is_personal_take_foul",
                                   possession_event.is_personal_take_foul)
                        update_row(foul_ref, poss_foul_data, "is_shooting_block_foul",
                                   possession_event.is_shooting_block_foul)
                        update_row(foul_ref, poss_foul_data, "is_counts_towards_penalty",
                                   possession_event.counts_towards_penalty)
                        update_row(foul_ref, poss_foul_data, "is_counts_as_personal_foul",
                                   possession_event.counts_as_personal_foul)
                        update_row(foul_ref, poss_foul_data, "foul_type",
                                   possession_event.foul_type_string)
                        update_row(foul_ref, poss_foul_data, "pbp_id",
                                   pbp_id)
                        foul_data.append(poss_foul_data)
                    elif isinstance(possession_event, FreeThrow):
                        update_row(pbp_ref, poss_general_data,
                                   "is_free_throw", True)
                        poss_ft_data = get_data_list(ft_ref)
                        update_row(ft_ref, poss_ft_data, "pbp_id",
                                   pbp_id)
                        update_row(ft_ref, poss_ft_data, "is_ft_1_of_1",
                                   possession_event.is_ft_1_of_1)
                        update_row(ft_ref, poss_ft_data, "is_ft_1_of_2",
                                   possession_event.is_ft_1_of_2)
                        update_row(ft_ref, poss_ft_data, "is_ft_2_of_2",
                                   possession_event.is_ft_2_of_2)
                        update_row(ft_ref, poss_ft_data, "is_ft_1_of_3",
                                   possession_event.is_ft_1_of_3)
                        update_row(ft_ref, poss_ft_data, "is_ft_2_of_3",
                                   possession_event.is_ft_2_of_3)
                        update_row(ft_ref, poss_ft_data, "is_ft_3_of_3",
                                   possession_event.is_ft_3_of_3)
                        update_row(ft_ref, poss_ft_data, "is_first_ft",
                                   possession_event.is_first_ft)
                        update_row(ft_ref, poss_ft_data, "is_end_ft",
                                   possession_event.is_end_ft)
                        update_row(ft_ref, poss_ft_data, "is_technical_ft",
                                   possession_event.is_technical_ft)
                        update_row(ft_ref, poss_ft_data, "is_ft_1pt",
                                   possession_event.is_ft_1pt)
                        update_row(ft_ref, poss_ft_data, "is_ft_2pt",
                                   possession_event.is_ft_2pt)
                        update_row(ft_ref, poss_ft_data, "is_ft_3pt",
                                   possession_event.is_ft_3pt)
                        update_row(ft_ref, poss_ft_data, "is_made",
                                   possession_event.is_made)
                        update_row(ft_ref, poss_ft_data, "is_away_from_play_ft",
                                   possession_event.is_away_from_play_ft)
                        update_row(ft_ref, poss_ft_data, "is_inbound_foul_ft",
                                   possession_event.is_inbound_foul_ft)
                        update_row(ft_ref, poss_ft_data, "shot_value",
                                   possession_event.shot_value)
                        if hasattr(possession_event, "foul_that_led_to_ft"):
                            if hasattr(possession_event.foul_that_led_to_ft, "event_num"):
                                foul_pbp_id = f'{game_id}-{possession_event.foul_that_led_to_ft.event_num}'
                                update_row(ft_ref, poss_ft_data, "foul_pbp_id",
                                           foul_pbp_id)

                        update_row(ft_ref, poss_ft_data, "num_ft_for_trip",
                                   possession_event.num_ft_for_trip)

                        update_row(ft_ref, poss_ft_data, "free_throw_type",
                                   possession_event.free_throw_type)

                        ft_data.append(poss_ft_data)

                    elif isinstance(possession_event, JumpBall):
                        update_row(pbp_ref, poss_general_data,
                                   "is_jump_ball", True)
                        poss_jump_ball_data = get_data_list(jump_ball_ref)
                        update_row(jump_ball_ref, poss_jump_ball_data, "winning_team",
                                   possession_event.winning_team)
                        update_row(jump_ball_ref, poss_jump_ball_data, "pbp_id",
                                   pbp_id)

                        jump_ball_data.append(poss_jump_ball_data)
                    elif isinstance(possession_event, Rebound):
                        update_row(pbp_ref, poss_general_data,
                                   "is_rebound", True)
                        poss_rebound_data = get_data_list(rebound_ref)
                        update_row(rebound_ref, poss_rebound_data, "pbp_id",
                                   pbp_id)

                        update_row(rebound_ref, poss_rebound_data, "is_buzzer_beater_rebound_at_shot_time",
                                   possession_event.is_buzzer_beater_rebound_at_shot_time)
                        update_row(rebound_ref, poss_rebound_data, "is_buzzer_beater_placeholder",
                                   possession_event.is_buzzer_beater_placeholder)
                        update_row(rebound_ref, poss_rebound_data, "is_non_live_ft_placeholder",
                                   possession_event.is_non_live_ft_placeholder)
                        update_row(rebound_ref, poss_rebound_data, "is_placeholder",
                                   possession_event.is_placeholder)
                        update_row(rebound_ref, poss_rebound_data, "is_real_rebound",
                                   possession_event.is_real_rebound)
                        update_row(rebound_ref, poss_rebound_data, "is_self_reb",
                                   possession_event.self_reb)
                        update_row(rebound_ref, poss_rebound_data, "is_turnover_placeholder",
                                   possession_event.is_turnover_placeholder)

                        rebound_data.append(poss_rebound_data)
                    elif isinstance(possession_event, Replay):
                        update_row(pbp_ref, poss_general_data,
                                   "is_replay", True)
                    elif isinstance(possession_event, StartOfPeriod):
                        update_row(pbp_ref, poss_general_data,
                                   "is_start_of_period", True)
                    elif isinstance(possession_event, Substitution):
                        update_row(pbp_ref, poss_general_data,
                                   "is_substitution", True)

                        poss_substitution_data = get_data_list(
                            substitution_ref)
                        update_row(substitution_ref, poss_substitution_data, "pbp_id",
                                   pbp_id)

                        update_row(substitution_ref, poss_substitution_data, "incoming_player_id",
                                   str(possession_event.incoming_player_id))

                        update_row(substitution_ref, poss_substitution_data, "outgoing_player_id",
                                   str(possession_event.outgoing_player_id))

                        substitution_data.append(poss_substitution_data)

                    elif isinstance(possession_event, Timeout):
                        update_row(pbp_ref, poss_general_data,
                                   "is_timeout", True)
                    elif isinstance(possession_event, Turnover):
                        update_row(pbp_ref, poss_general_data,
                                   "is_turnover", True)

                        poss_turnover_data = get_data_list(turnover_ref)
                        update_row(turnover_ref, poss_turnover_data, "pbp_id",
                                   pbp_id)

                        update_row(turnover_ref, poss_turnover_data, "is_3_second_violation",
                                   possession_event.is_3_second_violation)
                        update_row(turnover_ref, poss_turnover_data, "is_bad_pass",
                                   possession_event.is_bad_pass)
                        update_row(turnover_ref, poss_turnover_data, "is_bad_pass_out_of_bounds",
                                   possession_event.is_bad_pass_out_of_bounds)
                        update_row(turnover_ref, poss_turnover_data, "is_kicked_ball",
                                   possession_event.is_kicked_ball)
                        update_row(turnover_ref, poss_turnover_data, "is_lane_violation",
                                   possession_event.is_lane_violation)
                        update_row(turnover_ref, poss_turnover_data, "is_lost_ball",
                                   possession_event.is_lost_ball)
                        update_row(turnover_ref, poss_turnover_data, "is_lost_ball_out_of_bounds",
                                   possession_event.is_lost_ball_out_of_bounds)
                        update_row(turnover_ref, poss_turnover_data, "is_no_turnover",
                                   possession_event.is_no_turnover)
                        update_row(turnover_ref, poss_turnover_data, "is_offensive_goaltending",
                                   possession_event.is_offensive_goaltending)
                        update_row(turnover_ref, poss_turnover_data, "is_shot_clock_violation",
                                   possession_event.is_shot_clock_violation)
                        update_row(turnover_ref, poss_turnover_data, "is_steal",
                                   possession_event.is_steal)
                        update_row(turnover_ref, poss_turnover_data, "is_step_out_of_bounds",
                                   possession_event.is_step_out_of_bounds)
                        update_row(turnover_ref, poss_turnover_data, "is_travel",
                                   possession_event.is_travel)

                        turnover_data.append(poss_turnover_data)

                    elif isinstance(possession_event, Violation):
                        update_row(pbp_ref, poss_general_data,
                                   "is_violation", True)

                        poss_violation_data = get_data_list(violation_ref)
                        update_row(violation_ref, poss_violation_data, "pbp_id",
                                   pbp_id)

                        update_row(violation_ref, poss_violation_data, "is_double_lane_violation",
                                   possession_event.is_double_lane_violation)
                        update_row(violation_ref, poss_violation_data, "is_delay_of_game",
                                   possession_event.is_delay_of_game)
                        update_row(violation_ref, poss_violation_data, "is_goaltend_violation",
                                   possession_event.is_goaltend_violation)
                        update_row(violation_ref, poss_violation_data, "is_jumpball_violation",
                                   possession_event.is_jumpball_violation)
                        update_row(violation_ref, poss_violation_data, "is_kicked_ball_violation",
                                   possession_event.is_kicked_ball_violation)
                        update_row(violation_ref, poss_violation_data, "is_lane_violation",
                                   possession_event.is_lane_violation)

                        violation_data.append(poss_violation_data)
                    else:
                        raise(
                            "Woah! This play is not an instance of a determined type")

                except Exception as e:
                    print("Innie: ", e, possession_event)
                    print(traceback.format_exc())

                update_row(pbp_ref, poss_general_data, "event_num",
                           possession_event.event_num)

                update_row(pbp_ref, poss_general_data, "game_id", game_id)

                update_row(pbp_ref, poss_general_data, "pbp_id",
                           pbp_id)

                update_row(pbp_ref, poss_general_data, "seconds_remaining",
                           possession_event.seconds_remaining)

                update_row(pbp_ref, poss_general_data, "score_margin",
                           possession_event.score_margin)

                update_row(pbp_ref, poss_general_data, "is_one_of_multiple_events_at_same_time", len(
                    possession_event.get_all_events_at_current_time()) > 2)

                pbp_data.append(poss_general_data)
        except Exception as e:
            print(traceback.format_exc())
            print("Outie: ", e, possession)


pbp_df = pd.DataFrame(pbp_data, columns=pbp_ref.keys())
fg_df = pd.DataFrame(fg_data, columns=fg_ref.keys())
foul_df = pd.DataFrame(foul_data, columns=foul_ref.keys())
ft_df = pd.DataFrame(ft_data, columns=ft_ref.keys())
jump_ball_df = pd.DataFrame(jump_ball_data, columns=jump_ball_ref.keys())
rebound_df = pd.DataFrame(rebound_data, columns=rebound_ref.keys())
substitution_df = pd.DataFrame(
    substitution_data, columns=substitution_ref.keys())
turnover_df = pd.DataFrame(turnover_data, columns=turnover_ref.keys())
violation_df = pd.DataFrame(violation_data, columns=violation_ref.keys())


pbp_df.to_pickle("./output/pbp.pkl")
fg_df.to_pickle("./output/fg.pkl")
foul_df.to_pickle("./output/foul.pkl")
ft_df.to_pickle("./output/ft.pkl")
jump_ball_df.to_pickle("./output/jump_ball.pkl")
rebound_df.to_pickle("./output/rebound.pkl")
substitution_df.to_pickle("./output/substitution.pkl")
turnover_df.to_pickle("./output/turnover.pkl")
violation_df.to_pickle("./output/violation.pkl")


pbp_df.to_csv("./output/pbp.csv", index=False)
fg_df.to_csv("./output/fg.csv", index=False)
foul_df.to_csv("./output/foul.csv", index=False)
ft_df.to_csv("./output/ft.csv", index=False)
jump_ball_df.to_csv("./output/jump_ball.csv", index=False)
rebound_df.to_csv("./output/rebound.csv", index=False)
substitution_df.to_csv("./output/substitution.csv", index=False)
turnover_df.to_csv("./output/turnover.csv", index=False)
violation_df.to_csv("./output/violation.csv", index=False)
