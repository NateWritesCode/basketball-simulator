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
import pandas as pd
import json
games_to_process = 150


season_settings = {
    "dir": "/response_data",
    "Games": {"source": "web", "data_provider": "stats_nba"}
}
season_client = Client(season_settings)
season = season_client.Season("nba", "2021-22", "Regular Season")

game_settings = {
    "dir": "response_data",
    "Boxscore": {"source": "file", "data_provider": "stats_nba"},
    "Possessions": {"source": "file", "data_provider": "stats_nba"},
}
game_client = Client(game_settings)

master_foul_dict = {
    "counts_as_personal_foul": [],
    "counts_towards_penalty": [],
    "is_away_from_play_foul": [],
    "is_charge": [],
    "is_clear_path_foul": [],
    "is_defensive_3_seconds": [],
    "is_delay_of_game": [],
    "is_double_foul": [],
    "is_double_technical": [],
    "is_flagrant": [],
    "is_flagrant1": [],
    "is_flagrant2": [],
    "is_inbound_foul": [],
    "is_loose_ball_foul": [],
    "is_offensive_foul": [],
    "is_personal_foul": [],
    "is_personal_block_foul": [],
    "is_personal_take_foul": [],
    "is_shooting_foul": [],
    "is_shooting_block_foul": [],
    "is_technical": []
}
master_game_dict = {}
master_player_dict = {}
master_team_dict = {}
master_x_y_dict = {
    "ARC_3": {},
    "AT_RIM": {},
    "CORNER_3": {},
    "LONG_MID_RANGE": {},
    "SHORT_MID_RANGE": {}
}
master_play_length_dict = {
    "FG": {},
    "FOUL": {},
    "JUMP_BALL": {},
    "REBOUND": {},
    "TURNOVER": {},
    "VIOLATION": {}
}


def players_on_court_update(players_on_court, dict, field, value):
    for player in players_on_court:
        dict[player][field] += value


def player_update(player_id, dict, field, value):
    try:
        dict[player_id][field] += value
    except:
        print("PROBLEM UPDATING PLAYER", player_id, field, value)


def game_update(game_id, dict, field, value):
    dict[game_id][field] += value


def team_update(team_id, dict, field, value):
    dict[team_id][field] += value


def possession_length_update(possession_type, dict, seconds):
    if seconds <= 0:
        return
    key = str(int(seconds))

    if key in dict[possession_type]:
        dict[possession_type][key] += 1
    else:
        dict[possession_type][key] = 1


for season_game in season.games.items[:games_to_process]:
    game_id = season_game.game_id
    print("Processing game id: ", game_id)
    game = None
    try:
        game = game_client.Game(game_id)
    except Exception as e:
        print("Game problem with gameID", game_id, e)
        continue

    team_0 = game.boxscore.team_items[0]["team_id"]  # think this is away team
    team_1 = game.boxscore.team_items[1]["team_id"]  # think this is home team

    master_game_dict[game_id] = {
        "ASSIST": 0,
        "BLOCK": 0,
        "EJECTION": 0,
        "FG": 0,
        "FG_INCLUDING_SHOOTING_FOULS_MISSED": 0,
        "FG_ARC_3": 0,
        "FG_AT_RIM": 0,
        "FG_CORNER_3": 0,
        "FG_LONG_MID_RANGE": 0,
        "FG_SHORT_MID_RANGE": 0,
        "FG_MADE": 0,
        "FG_XY": {
            "ARC_3": {},
            "AT_RIM": {},
            "CORNER_3": {},
            "LONG_MID_RANGE": {},
            "SHORT_MID_RANGE": {}
        },
        "FOUL": 0,
        "FOUL_AWAY_FROM_PLAY": 0,
        "FOUL_CLEAR_PATH": 0,
        "FOUL_COUNT_AS_PERSONAL": 0,
        "FOUL_COUNT_TOWARD_PENALTY": 0,
        "FOUL_DEFENSIVE_NON_SHOOTING": 0,
        "FOUL_DOUBLE": 0,
        "FOUL_DOUBLE_TECHNICAL": 0,
        "FOUL_FLAGRANT": 0,
        "FOUL_FLAGRANT_1": 0,
        "FOUL_FLAGRANT_2": 0,
        "FOUL_INBOUND": 0,
        "FOUL_LOOSE_BALL": 0,
        "FOUL_OFFENSIVE_CHARGE": 0,
        "FOUL_OFFENSIVE_OTHER": 0,
        "FOUL_OFFENSIVE_TOTAL": 0,
        "FOUL_PERSONAL": 0,
        "FOUL_PERSONAL_BLOCK": 0,
        "FOUL_PERSONAL_TAKE": 0,
        "FOUL_SHOOTING": 0,
        "FOUL_SHOOTING_BLOCK": 0,
        "FOUL_TECHNICAL": 0,
        "FOUL_TECHNICAL_NON_PLAYER": 0,
        "JUMP_BALL": 0,
        "POSSESSION": 0,
        "REBOUND": 0,
        "REBOUND_DEFENSIVE": 0,
        "REBOUND_OFFENSIVE": 0,
        "REBOUND_DEFENSIVE_TEAM": 0,
        "REBOUND_OFFENSIVE_TEAM": 0,
        "REPLAY": 0,
        "STEAL": 0,
        "SUBSTITUTION": 0,
        "TIMEOUT": 0,
        "TURNOVER": 0,
        "TURNOVER_3_SECOND": 0,
        "TURNOVER_BAD_PASS": 0,  # steal
        "TURNOVER_BAD_PASS_OUT_OF_BOUNDS": 0,
        "TURNOVER_KICK_BALL": 0,
        "TURNOVER_LANE_VIOLATION": 0,
        "TURNOVER_LOST_BALL": 0,  # steal
        "TURNOVER_LOST_BALL_OUT_OF_BOUNDS": 0,
        "TURNOVER_OFFENSIVE_GOALTENDING": 0,
        "TURNOVER_SHOT_CLOCK": 0,
        "TURNOVER_STEP_OUT_OF_BOUNDS": 0,
        "TURNOVER_TRAVEL": 0,
        "VIOLATION": 0,
        "VIOLATION_DELAY_OF_GAME": 0,  # FG after usually
        "VIOLATION_DOUBLE_LANE": 0,  # FREE THROW
        "VIOLATION_DEFENSIVE_GOALTENDING": 0,  # POSSESSION - FG awarded
        "VIOLATION_JUMP_BALL": 0,  # JUMP BALL
        "VIOLATION_DEFENSIVE_KICK_BALL": 0,  # POSSESSION - Defense kicked ball
        "VIOLATION_LANE": 0,  # FREE THROW
    }

    for item in game.boxscore.player_items:
        if item["player_id"] not in master_player_dict:
            master_player_dict[item["player_id"]] = {
                "ASSIST": 0,
                "ASSIST_CHANCE": 0,
                "BLOCK": 0,
                "BLOCK_CHANCE": 0,
                "FG_ARC_3_ATTEMPT": 0,
                "FG_ARC_3_BLOCK": 0,
                "FG_ARC_3_CHANCE_OFFENSIVE": 0,
                "FG_ARC_3_CHANCE_DEFENSIVE": 0,
                "FG_ARC_3_MADE": 0,
                "FG_ARC_3_MADE_FOUL": 0,
                "FG_AT_RIM_ATTEMPT": 0,
                "FG_AT_RIM_BLOCK": 0,
                "FG_AT_RIM_CHANCE_OFFENSIVE": 0,
                "FG_AT_RIM_CHANCE_DEFENSIVE": 0,
                "FG_AT_RIM_MADE": 0,
                "FG_AT_RIM_MADE_FOUL": 0,
                "FG_CORNER_3_ATTEMPT": 0,
                "FG_CORNER_3_BLOCK": 0,
                "FG_CORNER_3_CHANCE_OFFENSIVE": 0,
                "FG_CORNER_3_CHANCE_DEFENSIVE": 0,
                "FG_CORNER_3_MADE": 0,
                "FG_CORNER_3_MADE_FOUL": 0,
                "FG_LONG_MID_RANGE_ATTEMPT": 0,
                "FG_LONG_MID_RANGE_BLOCK": 0,
                "FG_LONG_MID_RANGE_CHANCE_OFFENSIVE": 0,
                "FG_LONG_MID_RANGE_CHANCE_DEFENSIVE": 0,
                "FG_LONG_MID_RANGE_MADE": 0,
                "FG_LONG_MID_RANGE_MADE_FOUL": 0,
                "FG_SHORT_MID_RANGE_ATTEMPT": 0,
                "FG_SHORT_MID_RANGE_BLOCK": 0,
                "FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE": 0,
                "FG_SHORT_MID_RANGE_CHANCE_DEFENSIVE": 0,
                "FG_SHORT_MID_RANGE_MADE": 0,
                "FG_SHORT_MID_RANGE_MADE_FOUL": 0,
                "FG_TOTAL_ATTEMPT": 0,
                "FG_TOTAL_BLOCK": 0,
                "FG_TOTAL_CHANCE_OFFENSIVE": 0,
                "FG_TOTAL_CHANCE_DEFENSIVE": 0,
                "FG_TOTAL_MADE": 0,
                "FG_TOTAL_MADE_FOUL": 0,
                "FG_TOTAL_MISS_FOUL_2": 0,
                "FG_TOTAL_MISS_FOUL_3": 0,
                "FG_XY": {
                    "ARC_3": {},
                    "AT_RIM": {},
                    "CORNER_3": {},
                    "LONG_MID_RANGE": {},
                    "SHORT_MID_RANGE": {}
                },
                "FOUL": 0,
                "FOUL_CHANCE": 0,
                "FOUL_AWAY_FROM_PLAY": 0,
                "FOUL_AWAY_FROM_PLAY_CHANCE": 0,
                "FOULED_AWAY_FROM_PLAY": 0,
                "FOULED_AWAY_FROM_PLAY_CHANCE": 0,
                "FOUL_CLEAR_PATH": 0,
                "FOUL_CLEAR_PATH_CHANCE": 0,
                "FOULED_CLEAR_PATH": 0,
                "FOULED_CLEAR_PATH_CHANCE": 0,
                "FOUL_COUNT_AS_PERSONAL": 0,
                "FOUL_COUNT_AS_PERSONAL_CHANCE": 0,
                "FOULED_COUNT_AS_PERSONAL": 0,
                "FOULED_COUNT_AS_PERSONAL_CHANCE": 0,
                "FOUL_COUNT_TOWARD_PENALTY": 0,
                "FOUL_COUNT_TOWARD_PENALTY_CHANCE": 0,
                "FOULED_COUNT_TOWARD_PENALTY": 0,
                "FOULED_COUNT_TOWARD_PENALTY_CHANCE": 0,
                "FOUL_DEFENSIVE_NON_SHOOTING": 0,
                "FOUL_DEFENSIVE_NON_SHOOTING_CHANCE": 0,
                "FOULED_DEFENSIVE_NON_SHOOTING": 0,
                "FOULED_DEFENSIVE_NON_SHOOTING_CHANCE": 0,
                "FOUL_DOUBLE": 0,
                "FOUL_DOUBLE_CHANCE": 0,
                "FOUL_DOUBLE_TECHNICAL": 0,
                "FOUL_DOUBLE_TECHNICAL_CHANCE": 0,
                "FOUL_FLAGRANT": 0,
                "FOUL_FLAGRANT_CHANCE": 0,
                "FOULED_FLAGRANT": 0,
                "FOULED_FLAGRANT_CHANCE": 0,
                "FOUL_FLAGRANT_1": 0,
                "FOUL_FLAGRANT_1_CHANCE": 0,
                "FOULED_FLAGRANT_1": 0,
                "FOULED_FLAGRANT_1_CHANCE": 0,
                "FOUL_FLAGRANT_2": 0,
                "FOUL_FLAGRANT_2_CHANCE": 0,
                "FOULED_FLAGRANT_2": 0,
                "FOULED_FLAGRANT_2_CHANCE": 0,
                "FOUL_INBOUND": 0,
                "FOUL_INBOUND_CHANCE": 0,
                "FOULED_INBOUND": 0,
                "FOULED_INBOUND_CHANCE": 0,
                "FOUL_LOOSE_BALL": 0,
                "FOUL_LOOSE_BALL_CHANCE": 0,
                "FOULED_LOOSE_BALL": 0,
                "FOULED_LOOSE_BALL_CHANCE": 0,
                "FOUL_OFFENSIVE_CHARGE": 0,
                "FOUL_OFFENSIVE_CHARGE_CHANCE": 0,
                "FOULED_OFFENSIVE_CHARGE": 0,
                "FOULED_OFFENSIVE_CHARGE_CHANCE": 0,
                "FOUL_OFFENSIVE_OTHER": 0,
                "FOUL_OFFENSIVE_OTHER_CHANCE": 0,
                "FOULED_OFFENSIVE_OTHER": 0,
                "FOULED_OFFENSIVE_OTHER_CHANCE": 0,
                "FOUL_OFFENSIVE_TOTAL": 0,
                "FOUL_OFFENSIVE_TOTAL_CHANCE": 0,
                "FOULED_OFFENSIVE_TOTAL": 0,
                "FOULED_OFFENSIVE_TOTAL_CHANCE": 0,
                "FOUL_PERSONAL": 0,
                "FOUL_PERSONAL_CHANCE": 0,
                "FOULED_PERSONAL": 0,
                "FOULED_PERSONAL_CHANCE": 0,
                "FOUL_PERSONAL_BLOCK": 0,
                "FOUL_PERSONAL_BLOCK_CHANCE": 0,
                "FOULED_PERSONAL_BLOCK": 0,
                "FOULED_PERSONAL_BLOCK_CHANCE": 0,
                "FOUL_PERSONAL_TAKE": 0,
                "FOUL_PERSONAL_TAKE_CHANCE": 0,
                "FOULED_PERSONAL_TAKE": 0,
                "FOULED_PERSONAL_TAKE_CHANCE": 0,
                "FOUL_SHOOTING": 0,
                "FOUL_SHOOTING_CHANCE": 0,
                "FOULED_SHOOTING": 0,
                "FOULED_SHOOTING_CHANCE": 0,
                "FOUL_SHOOTING_BLOCK": 0,
                "FOUL_SHOOTING_BLOCK_CHANCE": 0,
                "FOULED_SHOOTING_BLOCK": 0,
                "FOULED_SHOOTING_BLOCK_CHANCE": 0,
                "FOUL_TECHNICAL": 0,
                "FOUL_TECHNICAL_CHANCE": 0,
                "FT_ATTEMPT": 0,
                "FT_MADE": 0,
                "REBOUND_DEFENSIVE": 0,
                "REBOUND_DEFENSIVE_CHANCE": 0,
                "REBOUND_OFFENSIVE": 0,
                "REBOUND_OFFENSIVE_CHANCE": 0,
                "STEAL": 0,
                "STEAL_CHANCE": 0,
                "TURNOVER": 0,
                "TURNOVER_CHANCE": 0,
                "VIOLATION_DEFENSIVE_GOALTENDING": 0,
                "VIOLATION_DEFENSIVE_GOALTENDING_CHANCE": 0,
                "VIOLATION_DEFENSIVE_KICK_BALL": 0,
                "VIOLATION_DEFENSIVE_KICK_BALL_CHANCE": 0,
            }

    for possession in game.possessions.items:
        for possession_event in possession.events:
            possession_event_length = possession_event.seconds_since_previous_event
            if possession_event.count_as_possession:
                game_update(game_id, master_game_dict, "POSSESSION", 1)

            offense_team_id = possession_event.get_offense_team_id()
            defense_team_id = team_0 if team_0 != offense_team_id else team_1
            offense_players = possession_event.current_players[offense_team_id]
            defense_players = possession_event.current_players[defense_team_id]

            if isinstance(possession_event, EndOfPeriod):
                continue

            if isinstance(possession_event, StartOfPeriod):
                continue

            if isinstance(possession_event, Ejection):
                game_update(game_id, master_game_dict, "EJECTION", 1)
                continue

            if isinstance(possession_event, JumpBall):
                is_jump_ball_starts_period = False
                for event in possession_event.get_all_events_at_current_time():
                    if isinstance(event, StartOfPeriod):
                        is_jump_ball_starts_period = True
                if is_jump_ball_starts_period != True:
                    game_update(game_id, master_game_dict, "JUMP_BALL", 1)
                    possession_length_update(
                        "JUMP_BALL", master_play_length_dict, possession_event_length)
                continue

            if isinstance(possession_event, Replay):
                game_update(game_id, master_game_dict, "REPLAY", 1)
                continue

            if isinstance(possession_event, Substitution):
                game_update(game_id, master_game_dict, "SUBSTITUTION", 1)
                continue

            if isinstance(possession_event, Timeout):
                game_update(game_id, master_game_dict, "TIMEOUT", 1)
                continue

            if isinstance(possession_event, Violation):
                game_update(game_id, master_game_dict, "VIOLATION", 1)
                if possession_event.is_delay_of_game:
                    game_update(game_id, master_game_dict,
                                "VIOLATION_DELAY_OF_GAME", 1)
                if possession_event.is_double_lane_violation:
                    game_update(game_id, master_game_dict,
                                "VIOLATION_DOUBLE_LANE", 1)
                if possession_event.is_goaltend_violation:
                    game_update(game_id, master_game_dict,
                                "VIOLATION_DEFENSIVE_GOALTENDING", 1)
                    players_on_court_update(
                        defense_players, master_player_dict, "VIOLATION_DEFENSIVE_GOALTENDING_CHANCE", 1)
                    player = possession_event.player1_id
                    player_update(player, master_player_dict,
                                  "VIOLATION_DEFENSIVE_GOALTENDING", 1)

                    possession_length_update(
                        "VIOLATION", master_play_length_dict, possession_event_length)

                if possession_event.is_jumpball_violation:
                    game_update(game_id, master_game_dict,
                                "VIOLATION_JUMP_BALL", 1)
                if possession_event.is_kicked_ball_violation:
                    game_update(game_id, master_game_dict,
                                "VIOLATION_DEFENSIVE_KICK_BALL", 1)
                    players_on_court_update(
                        defense_players, master_player_dict, "VIOLATION_DEFENSIVE_KICK_BALL_CHANCE", 1)
                    player = possession_event.player1_id
                    player_update(player, master_player_dict,
                                  "VIOLATION_DEFENSIVE_KICK_BALL", 1)
                    possession_length_update(
                        "VIOLATION", master_play_length_dict, possession_event_length)
                if possession_event.is_lane_violation:
                    game_update(game_id, master_game_dict,
                                "VIOLATION_LANE", 1)

            if isinstance(possession_event, Turnover) and not possession_event.is_no_turnover:
                possession_length_update(
                    "TURNOVER", master_play_length_dict, possession_event_length)
                players_on_court_update(
                    offense_players, master_player_dict, "TURNOVER_CHANCE", 1)
                offense_player = possession_event.player1_id
                if offense_player != 0:
                    player_update(offense_player,
                                  master_player_dict, "TURNOVER", 1)

                game_update(game_id, master_game_dict, "TURNOVER", 1)
                if possession_event.is_steal:
                    players_on_court_update(
                        defense_players, master_player_dict, "STEAL_CHANCE", 1)
                    player = possession_event.player3_id
                    player_update(player, master_player_dict, "STEAL", 1)
                    game_update(game_id, master_game_dict,
                                "STEAL", 1)

                if possession_event.is_3_second_violation:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_3_SECOND", 1)
                if possession_event.is_bad_pass:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_BAD_PASS", 1)
                if possession_event.is_bad_pass_out_of_bounds:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_BAD_PASS_OUT_OF_BOUNDS", 1)
                if possession_event.is_kicked_ball:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_KICK_BALL", 1)
                if possession_event.is_lane_violation:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_LANE_VIOLATION", 1)
                if possession_event.is_lost_ball:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_LOST_BALL", 1)
                if possession_event.is_lost_ball_out_of_bounds:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_LOST_BALL_OUT_OF_BOUNDS", 1)
                if possession_event.is_offensive_goaltending:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_OFFENSIVE_GOALTENDING", 1)
                if possession_event.is_shot_clock_violation:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_SHOT_CLOCK", 1)
                if possession_event.is_step_out_of_bounds:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_STEP_OUT_OF_BOUNDS", 1)
                if possession_event.is_travel:
                    game_update(game_id, master_game_dict,
                                "TURNOVER_TRAVEL", 1)

            if isinstance(possession_event, FreeThrow):
                player = possession_event.player1_id
                player_update(player, master_player_dict, "FT_ATTEMPT", 1)
                if possession_event.is_made:
                    player_update(player, master_player_dict, "FT_MADE", 1)
                if possession_event.foul_that_led_to_ft != None:
                    if possession_event.foul_that_led_to_ft.foul_type_string == "2pt Shooting Foul":
                        player_update(player, master_player_dict,
                                      "FG_TOTAL_MISS_FOUL_2", 1)
                        game_update(game_id, master_game_dict,
                                    "FG_INCLUDING_SHOOTING_FOULS_MISSED", 1)

                    if possession_event.foul_that_led_to_ft.foul_type_string == "3pt Shooting Foul":
                        player_update(player, master_player_dict,
                                      "FG_TOTAL_MISS_FOUL_3", 1)
                        game_update(game_id, master_game_dict,
                                    "FG_INCLUDING_SHOOTING_FOULS_MISSED", 1)

                continue

            if isinstance(possession_event, Rebound):
                if possession_event.is_real_rebound:
                    possession_length_update(
                        "REBOUND", master_play_length_dict, possession_event_length)
                    game_update(
                        game_id, master_game_dict, "REBOUND", 1)
                    players_on_court_update(
                        offense_players, master_player_dict, "REBOUND_OFFENSIVE_CHANCE", 1)
                    players_on_court_update(
                        defense_players, master_player_dict, "REBOUND_DEFENSIVE_CHANCE", 1)
                    if hasattr(possession_event, 'player1_id') and possession_event.player1_id != 0:
                        player = possession_event.player1_id
                        if possession_event.oreb:
                            player_update(
                                player, master_player_dict, "REBOUND_OFFENSIVE", 1)
                            game_update(game_id, master_game_dict,
                                        "REBOUND_OFFENSIVE", 1)
                        else:
                            player_update(
                                player, master_player_dict, "REBOUND_DEFENSIVE", 1)
                            game_update(game_id, master_game_dict,
                                        "REBOUND_DEFENSIVE", 1)
                    else:  # is team rebound
                        if possession_event.oreb:
                            game_update(game_id, master_game_dict,
                                        "REBOUND_OFFENSIVE_TEAM", 1)
                        else:
                            game_update(game_id, master_game_dict,
                                        "REBOUND_DEFENSIVE_TEAM", 1)

            if isinstance(possession_event, Foul):
                master_foul_dict["counts_as_personal_foul"].append(
                    possession_event.counts_as_personal_foul)
                master_foul_dict["counts_towards_penalty"].append(
                    possession_event.counts_towards_penalty)
                master_foul_dict["is_away_from_play_foul"].append(
                    possession_event.is_away_from_play_foul)
                master_foul_dict["is_charge"].append(
                    possession_event.is_charge)
                master_foul_dict["is_clear_path_foul"].append(
                    possession_event.is_clear_path_foul)
                master_foul_dict["is_defensive_3_seconds"].append(
                    possession_event.is_defensive_3_seconds)
                master_foul_dict["is_delay_of_game"].append(
                    possession_event.is_delay_of_game)
                master_foul_dict["is_double_foul"].append(
                    possession_event.is_double_foul)
                master_foul_dict["is_double_technical"].append(
                    possession_event.is_double_technical)
                master_foul_dict["is_flagrant"].append(
                    possession_event.is_flagrant)
                master_foul_dict["is_flagrant1"].append(
                    possession_event.is_flagrant1)
                master_foul_dict["is_flagrant2"].append(
                    possession_event.is_flagrant2)
                master_foul_dict["is_inbound_foul"].append(
                    possession_event.is_inbound_foul)
                master_foul_dict["is_loose_ball_foul"].append(
                    possession_event.is_loose_ball_foul)
                master_foul_dict["is_offensive_foul"].append(
                    possession_event.is_offensive_foul)
                master_foul_dict["is_personal_foul"].append(
                    possession_event.is_personal_foul)
                master_foul_dict["is_personal_block_foul"].append(
                    possession_event.is_personal_block_foul)
                master_foul_dict["is_personal_take_foul"].append(
                    possession_event.is_personal_take_foul)
                master_foul_dict["is_shooting_foul"].append(
                    possession_event.is_shooting_foul)
                master_foul_dict["is_shooting_block_foul"].append(
                    possession_event.is_shooting_block_foul)
                master_foul_dict["is_technical"].append(
                    possession_event.is_technical)

                player1 = possession_event.player1_id
                player3 = None
                # Player 1 is fouling player
                # Player 3 is fouled player
                # Also, can act as the two players involved in a double technical/foul

                player1_players_on_court = offense_players if player1 in offense_players else defense_players
                player3_players_on_court = []

                if hasattr(possession_event, "player3_id"):
                    player3 = possession_event.player3_id
                    player3_players_on_court = offense_players if player3 in offense_players else defense_players

                game_update(game_id, master_game_dict,
                            "FOUL", 1)
                possession_length_update(
                    "FOUL", master_play_length_dict, possession_event_length)

                players_on_court_update(
                    player1_players_on_court, master_player_dict, "FOUL_CHANCE", 1)

                players_on_court_update(
                    player3_players_on_court, master_player_dict, "FOUL_CHANCE", 1)

                if possession_event.is_away_from_play_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_AWAY_FROM_PLAY", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_AWAY_FROM_PLAY", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_AWAY_FROM_PLAY", 1)
                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_AWAY_FROM_PLAY_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_AWAY_FROM_PLAY_CHANCE", 1)

                if possession_event.counts_as_personal_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_COUNT_AS_PERSONAL", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_COUNT_AS_PERSONAL", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_COUNT_AS_PERSONAL", 1)
                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_COUNT_AS_PERSONAL_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_COUNT_AS_PERSONAL_CHANCE", 1)

                if possession_event.counts_towards_penalty:
                    game_update(game_id, master_game_dict,
                                "FOUL_COUNT_TOWARD_PENALTY", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_COUNT_TOWARD_PENALTY", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_COUNT_TOWARD_PENALTY", 1)
                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_COUNT_TOWARD_PENALTY_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_COUNT_TOWARD_PENALTY_CHANCE", 1)

                if possession_event.is_charge:
                    # Charge and general offensive foul are treated seperately
                    game_update(game_id, master_game_dict,
                                "FOUL_OFFENSIVE_CHARGE", 1)
                    game_update(game_id, master_game_dict,
                                "FOUL_OFFENSIVE_TOTAL", 1)

                    player_update(
                        player1, master_player_dict, "FOUL_OFFENSIVE_CHARGE", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_OFFENSIVE_CHARGE", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_OFFENSIVE_TOTAL", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_OFFENSIVE_TOTAL", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_OFFENSIVE_CHARGE_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_OFFENSIVE_CHARGE_CHANCE", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_OFFENSIVE_TOTAL_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_OFFENSIVE_TOTAL_CHANCE", 1)

                if possession_event.is_clear_path_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_CLEAR_PATH", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_CLEAR_PATH", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_CLEAR_PATH", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_CLEAR_PATH_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_CLEAR_PATH_CHANCE", 1)

                if possession_event.is_double_foul:
                    game_update(game_id, master_game_dict, "FOUL_DOUBLE", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_DOUBLE", 1)
                    player_update(
                        player3, master_player_dict, "FOUL_DOUBLE", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_DOUBLE_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOUL_DOUBLE_CHANCE", 1)

                if possession_event.is_double_technical:
                    game_update(game_id, master_game_dict,
                                "FOUL_DOUBLE_TECHNICAL", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_DOUBLE_TECHNICAL", 1)
                    player_update(
                        player3, master_player_dict, "FOUL_DOUBLE_TECHNICAL", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_DOUBLE_TECHNICAL_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOUL_DOUBLE_TECHNICAL_CHANCE", 1)

                if possession_event.is_flagrant:
                    game_update(game_id, master_game_dict,
                                "FOUL_FLAGRANT", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_FLAGRANT", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_FLAGRANT", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_FLAGRANT_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_FLAGRANT_CHANCE", 1)

                if possession_event.is_flagrant1:
                    game_update(game_id, master_game_dict,
                                "FOUL_FLAGRANT_1", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_FLAGRANT_1", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_FLAGRANT_1", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_FLAGRANT_1_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_FLAGRANT_1_CHANCE", 1)

                if possession_event.is_flagrant2:
                    game_update(game_id, master_game_dict,
                                "FOUL_FLAGRANT_2", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_FLAGRANT_2", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_FLAGRANT_2", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_FLAGRANT_2_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_FLAGRANT_2_CHANCE", 1)

                if possession_event.is_inbound_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_INBOUND", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_INBOUND", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_INBOUND", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_INBOUND_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_INBOUND_CHANCE", 1)

                if possession_event.is_loose_ball_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_LOOSE_BALL", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_LOOSE_BALL", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_LOOSE_BALL", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_LOOSE_BALL", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_LOOSE_BALL_CHANCE", 1)

                if possession_event.is_offensive_foul:
                    # Charge and general offensive foul are treated seperately
                    game_update(game_id, master_game_dict,
                                "FOUL_OFFENSIVE_OTHER", 1)
                    game_update(game_id, master_game_dict,
                                "FOUL_OFFENSIVE_TOTAL", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_OFFENSIVE_OTHER", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_OFFENSIVE_OTHER", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_OFFENSIVE_TOTAL", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_OFFENSIVE_TOTAL", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_OFFENSIVE_OTHER", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_OFFENSIVE_OTHER", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_OFFENSIVE_TOTAL_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_OFFENSIVE_TOTAL_CHANCE", 1)

                if possession_event.is_personal_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_PERSONAL", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_PERSONAL", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_PERSONAL", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_PERSONAL_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_PERSONAL_CHANCE", 1)

                if possession_event.is_personal_block_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_PERSONAL_BLOCK", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_PERSONAL_BLOCK", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_PERSONAL_BLOCK", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_PERSONAL_BLOCK_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_PERSONAL_BLOCK_CHANCE", 1)

                if possession_event.is_personal_take_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_PERSONAL_TAKE", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_PERSONAL_TAKE", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_PERSONAL_TAKE", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_PERSONAL_TAKE_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_PERSONAL_TAKE_CHANCE", 1)

                if possession_event.is_shooting_block_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_SHOOTING_BLOCK", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_SHOOTING_BLOCK", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_SHOOTING_BLOCK", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_SHOOTING_BLOCK_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_SHOOTING_BLOCK_CHANCE", 1)

                if possession_event.is_shooting_foul:
                    game_update(game_id, master_game_dict,
                                "FOUL_SHOOTING", 1)
                    player_update(
                        player1, master_player_dict, "FOUL_SHOOTING", 1)
                    player_update(
                        player3, master_player_dict, "FOULED_SHOOTING", 1)

                    players_on_court_update(
                        player1_players_on_court, master_player_dict, "FOUL_SHOOTING_CHANCE", 1)
                    players_on_court_update(
                        player3_players_on_court, master_player_dict, "FOULED_SHOOTING_CHANCE", 1)

                if possession_event.is_technical:
                    if player1 == 0:
                        game_update(game_id, master_game_dict,
                                    "FOUL_TECHNICAL_NON_PLAYER", 1)
                    else:
                        player_update(
                            player1, master_player_dict, "FOUL_TECHNICAL", 1)

                    game_update(game_id, master_game_dict,
                                "FOUL_TECHNICAL", 1)

                    players_on_court_update(
                        offense_players, master_player_dict, "FOUL_TECHNICAL_CHANCE", 1)
                    players_on_court_update(
                        defense_players, master_player_dict, "FOUL_TECHNICAL_CHANCE", 1)

                if possession_event.is_offensive_foul == False and possession_event.is_shooting_foul == False and possession_event.is_shooting_block_foul == False and possession_event.is_charge == False:
                    if (possession_event.is_clear_path_foul or possession_event.is_double_foul or possession_event.is_flagrant or possession_event.is_loose_ball_foul or possession_event.is_personal_block_foul or possession_event.is_personal_take_foul or possession_event.is_personal_foul):
                        game_update(game_id, master_game_dict,
                                    "FOUL_DEFENSIVE_NON_SHOOTING", 1)

                        player_update(
                            player1, master_player_dict, "FOUL_DEFENSIVE_NON_SHOOTING", 1)
                        player_update(
                            player3, master_player_dict, "FOULED_DEFENSIVE_NON_SHOOTING", 1)

                        players_on_court_update(
                            player1_players_on_court, master_player_dict, "FOUL_DEFENSIVE_NON_SHOOTING_CHANCE", 1)
                        players_on_court_update(
                            player3_players_on_court, master_player_dict, "FOULED_DEFENSIVE_NON_SHOOTING_CHANCE", 1)

            if isinstance(possession_event, FieldGoal):
                possession_length_update(
                    "FG", master_play_length_dict, possession_event_length)
                players_on_court_update(
                    offense_players, master_player_dict, "FG_TOTAL_CHANCE_OFFENSIVE", 1)
                players_on_court_update(
                    defense_players, master_player_dict, "FG_TOTAL_CHANCE_DEFENSIVE", 1)
                game_update(game_id, master_game_dict,
                            "FG", 1)
                game_update(game_id, master_game_dict,
                            "FG_INCLUDING_SHOOTING_FOULS_MISSED", 1)

                if hasattr(possession_event, 'player1_id') and possession_event.player1_id != 0:
                    player = possession_event.player1_id
                    is_2 = possession_event.shot_value == 2
                    is_3 = possession_event.shot_value == 3
                    is_and_1 = possession_event.is_and1
                    is_arc_3 = possession_event.shot_type == "Arc3"
                    is_at_rim = possession_event.shot_type == "AtRim"
                    is_corner_3 = possession_event.shot_type == "Corner3"
                    is_long_mid_range = possession_event.shot_type == "LongMidRange"
                    is_made = possession_event.is_made
                    is_short_mid_range = possession_event.shot_type == "ShortMidRange"
                    is_block = possession_event.is_blocked
                    is_assist = possession_event.is_assisted

                    if is_assist:
                        game_update(game_id, master_game_dict,
                                    "ASSIST", 1)
                        players_on_court_update(
                            offense_players, master_player_dict, "ASSIST_CHANCE", 1)
                        player = possession_event.player2_id
                        player_update(
                            player, master_player_dict, "ASSIST", 1)

                    shot_type_field_string = ""

                    if is_arc_3:
                        shot_type_field_string = "ARC_3"
                        players_on_court_update(
                            offense_players, master_player_dict, "FG_ARC_3_CHANCE_OFFENSIVE", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "FG_ARC_3_CHANCE_DEFENSIVE", 1)
                        game_update(game_id, master_game_dict,
                                    "FG_ARC_3", 1)
                    elif is_at_rim:
                        shot_type_field_string = "AT_RIM"
                        players_on_court_update(
                            offense_players, master_player_dict, "FG_AT_RIM_CHANCE_OFFENSIVE", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "FG_AT_RIM_CHANCE_DEFENSIVE", 1)
                        game_update(game_id, master_game_dict,
                                    "FG_AT_RIM", 1)
                    elif is_corner_3:
                        shot_type_field_string = "CORNER_3"
                        players_on_court_update(
                            offense_players, master_player_dict, "FG_CORNER_3_CHANCE_OFFENSIVE", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "FG_CORNER_3_CHANCE_DEFENSIVE", 1)
                        game_update(game_id, master_game_dict,
                                    "FG_CORNER_3", 1)
                    elif is_long_mid_range:
                        shot_type_field_string = "LONG_MID_RANGE"
                        players_on_court_update(
                            offense_players, master_player_dict, "FG_LONG_MID_RANGE_CHANCE_OFFENSIVE", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "FG_LONG_MID_RANGE_CHANCE_DEFENSIVE", 1)
                        game_update(game_id, master_game_dict,
                                    "FG_LONG_MID_RANGE", 1)
                    elif is_short_mid_range:
                        shot_type_field_string = "SHORT_MID_RANGE"
                        players_on_court_update(
                            offense_players, master_player_dict, "FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "FG_SHORT_MID_RANGE_CHANCE_DEFENSIVE", 1)
                        game_update(game_id, master_game_dict,
                                    "FG_SHORT_MID_RANGE", 1)
                    else:
                        raise("Don't know what this is")

                    shot_x = possession_event.shot_data["X"]
                    shot_y = possession_event.shot_data["Y"]

                    shot_x_y_key = f'{shot_x}|{shot_y}'

                    if shot_x_y_key in master_x_y_dict[shot_type_field_string]:
                        master_x_y_dict[shot_type_field_string][shot_x_y_key] += 1
                    else:
                        master_x_y_dict[shot_type_field_string][shot_x_y_key] = 1

                    if shot_x_y_key in master_game_dict[game_id]["FG_XY"][shot_type_field_string]:
                        master_game_dict[game_id]["FG_XY"][shot_type_field_string][shot_x_y_key] += 1
                    else:
                        master_game_dict[game_id]["FG_XY"][shot_type_field_string][shot_x_y_key] = 1

                    if shot_x_y_key in master_player_dict[player]["FG_XY"][shot_type_field_string]:
                        master_player_dict[player]["FG_XY"][shot_type_field_string][shot_x_y_key] += 1
                    else:
                        master_player_dict[player]["FG_XY"][shot_type_field_string][shot_x_y_key] = 1

                    field_string = "FG_" + shot_type_field_string + "_"

                    player_update(player, master_player_dict,
                                  field_string + "ATTEMPT", 1)

                    player_update(player, master_player_dict,
                                  "FG_TOTAL_ATTEMPT", 1)

                    if is_block:
                        game_update(game_id, master_game_dict,
                                    "BLOCK", 1)
                        field_string += "BLOCK"
                        player_update(player, master_player_dict,
                                      field_string, 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "BLOCK_CHANCE", 1)
                        blocking_player = possession_event.player3_id
                        player_update(blocking_player, master_player_dict,
                                      "BLOCK", 1)

                    if is_made:
                        game_update(game_id, master_game_dict,
                                    "FG_MADE", 1)
                        field_string += "MADE"
                        player_update(player, master_player_dict,
                                      field_string, 1)
                        player_update(player, master_player_dict,
                                      "FG_TOTAL_MADE", 1)
                        if is_and_1:
                            player_update(player, master_player_dict,
                                          field_string + "_FOUL", 1)
                            player_update(player, master_player_dict,
                                          "FG_TOTAL_MADE_FOUL", 1)

                else:
                    raise("We have a field goal with no shooter")

possession_outcome_total = 0
possession_outcome_field_goal = 0
possession_outcome_foul_defensive_non_shooting = 0
possession_outcome_jump_ball = 0
possession_outcome_offensive_foul = 0
possession_outcome_turnover = 0
possession_outcome_violation_def_goaltend = 0
possession_outcome_violation_def_kick_ball = 0


total_arc3 = 0
total_assist = 0
total_at_rim = 0
total_block = 0
total_corner3 = 0
total_def_team_reb = 0
total_fg = 0
total_fg_made = 0
total_fg_including_shooting_foul_missed = 0
total_foul = 0
total_foul_away_from_play = 0
total_foul_clear_path = 0
total_foul_count_as_personal = 0
total_foul_count_toward_penalty = 0
total_foul_def_non_shooting = 0
total_foul_double = 0
total_foul_double_technical = 0
total_foul_flagrant = 0
total_foul_flagrant_1 = 0
total_foul_flagrant_2 = 0
total_foul_inbound = 0
total_foul_in_play = 0
total_foul_loose_ball = 0
total_foul_off_charge = 0
total_foul_off_other = 0
total_foul_off_total = 0
total_foul_personal = 0
total_foul_personal_block = 0
total_foul_personal_take = 0
total_foul_shooting = 0
total_foul_shooting_block = 0
total_foul_technical = 0
total_foul_technical_non_player = 0
total_foul_shooting = 0
total_long_mid_range = 0
total_off_team_reb = 0
total_possession = 0
total_reb = 0
total_reb_off = 0
total_reb_def = 0
total_short_mid_range = 0
total_steal = 0
total_turnover = 0
total_turnover_3_second = 0
total_turnover_bad_pass = 0
total_turnover_bad_pass_out_of_bounds = 0
total_turnover_kick_ball = 0
total_turnover_lane_violation = 0
total_turnover_lost_ball = 0
total_turnover_lost_ball_out_of_bounds = 0
total_turnover_off_goaltend = 0
total_turnover_shot_clock = 0
total_turnover_step_out_of_bounds = 0
total_turnover_travel = 0
total_violation_possession = 0
total_violation_def_kick_ball = 0
total_violation_def_goaltend = 0


for game_id in master_game_dict.keys():
    game = master_game_dict[game_id]

    possession_outcome_total += game["FG"] + game["FOUL_OFFENSIVE_TOTAL"] + game["TURNOVER"] + game["FOUL_DEFENSIVE_NON_SHOOTING"] + \
        game["JUMP_BALL"] + game["VIOLATION_DEFENSIVE_GOALTENDING"] + \
        game["VIOLATION_DEFENSIVE_KICK_BALL"]

    possession_outcome_field_goal += game["FG"]
    possession_outcome_foul_defensive_non_shooting += game["FOUL_DEFENSIVE_NON_SHOOTING"]
    possession_outcome_jump_ball += game["JUMP_BALL"]
    possession_outcome_offensive_foul += game["FOUL_OFFENSIVE_TOTAL"]
    possession_outcome_turnover += game["TURNOVER"]
    possession_outcome_violation_def_goaltend += game["VIOLATION_DEFENSIVE_GOALTENDING"]
    possession_outcome_violation_def_kick_ball += game["VIOLATION_DEFENSIVE_KICK_BALL"]

    total_foul += game["FOUL"]
    total_foul_away_from_play += game["FOUL_AWAY_FROM_PLAY"]
    total_foul_clear_path += game["FOUL_CLEAR_PATH"]
    total_foul_count_as_personal += game["FOUL_COUNT_AS_PERSONAL"]
    total_foul_count_toward_penalty += game["FOUL_COUNT_TOWARD_PENALTY"]
    total_foul_def_non_shooting += game["FOUL_DEFENSIVE_NON_SHOOTING"]
    total_foul_double += game["FOUL_DOUBLE"]
    total_foul_double_technical += game["FOUL_TECHNICAL"]
    total_foul_flagrant += game["FOUL_FLAGRANT"]
    total_foul_flagrant_1 += game["FOUL_FLAGRANT_1"]
    total_foul_flagrant_2 += game["FOUL_FLAGRANT_2"]
    total_foul_inbound += game["FOUL_INBOUND"]
    total_foul_in_play += game["FOUL"] - game["FOUL_TECHNICAL"]
    total_foul_loose_ball += game["FOUL_LOOSE_BALL"]
    total_foul_personal += game["FOUL_PERSONAL"]
    total_foul_personal_block += game["FOUL_PERSONAL_BLOCK"]
    total_foul_personal_take += game["FOUL_PERSONAL_TAKE"]
    total_foul_off_total += game["FOUL_OFFENSIVE_TOTAL"]
    total_foul_off_charge += game["FOUL_OFFENSIVE_CHARGE"]
    total_foul_off_other += game["FOUL_OFFENSIVE_OTHER"]
    total_foul_shooting += game["FOUL_SHOOTING"]
    total_foul_shooting_block += game["FOUL_SHOOTING_BLOCK"]
    total_foul_technical += game["FOUL_TECHNICAL"]
    total_foul_technical_non_player += game["FOUL_TECHNICAL_NON_PLAYER"]

    total_fg_including_shooting_foul_missed += game["FG_INCLUDING_SHOOTING_FOULS_MISSED"]

    total_fg += game["FG"]
    total_fg_made += game["FG_MADE"]
    total_assist += game["ASSIST"]
    total_arc3 += game["FG_ARC_3"]
    total_at_rim += game["FG_AT_RIM"]
    total_corner3 += game["FG_CORNER_3"]
    total_long_mid_range += game["FG_LONG_MID_RANGE"]
    total_short_mid_range += game["FG_SHORT_MID_RANGE"]
    total_block += game["BLOCK"]

    total_reb += game["REBOUND"]
    total_reb_off += game["REBOUND_OFFENSIVE"]
    total_reb_def += game["REBOUND_DEFENSIVE"]
    total_def_team_reb += game["REBOUND_DEFENSIVE_TEAM"]
    total_off_team_reb += game["REBOUND_OFFENSIVE_TEAM"]

    total_steal += game["STEAL"]
    total_turnover += game["TURNOVER"]
    total_turnover_3_second += game["TURNOVER_3_SECOND"]
    total_turnover_bad_pass += game["TURNOVER_BAD_PASS"]
    total_turnover_bad_pass_out_of_bounds += game["TURNOVER_BAD_PASS_OUT_OF_BOUNDS"]
    total_turnover_kick_ball += game["TURNOVER_KICK_BALL"]
    total_turnover_lane_violation += game["TURNOVER_LANE_VIOLATION"]
    total_turnover_lost_ball += game["TURNOVER_LOST_BALL"]
    total_turnover_lost_ball_out_of_bounds += game["TURNOVER_LOST_BALL_OUT_OF_BOUNDS"]
    total_turnover_off_goaltend += game["TURNOVER_OFFENSIVE_GOALTENDING"]
    total_turnover_shot_clock += game["TURNOVER_SHOT_CLOCK"]
    total_turnover_step_out_of_bounds += game["TURNOVER_STEP_OUT_OF_BOUNDS"]
    total_turnover_travel += game["TURNOVER_TRAVEL"]

    total_violation_possession += game["VIOLATION_DEFENSIVE_KICK_BALL"] + \
        game["VIOLATION_DEFENSIVE_GOALTENDING"]

    total_violation_def_kick_ball += game["VIOLATION_DEFENSIVE_KICK_BALL"]
    total_violation_def_goaltend += game["VIOLATION_DEFENSIVE_GOALTENDING"]


general_probabilities = {
    "ASSIST": total_assist / total_fg_made,
    "BLOCK": total_block / total_fg,
    "FG_SHOOTING_FOUL": total_foul_shooting / total_fg_including_shooting_foul_missed,
    # "FOUL_AWAY_FROM_PLAY": total_foul_away_from_play / total_foul_def_non_shooting,
    "FOUL_CLEAR_PATH": total_foul_clear_path / total_foul_def_non_shooting,
    "FOUL_DOUBLE": total_foul_double / total_foul_def_non_shooting,
    "FOUL_FLAGRANT": total_foul_flagrant / total_foul_in_play,
    "FOUL_FLAGRANT_1": total_foul_flagrant_1 / total_foul_flagrant,
    "FOUL_FLAGRANT_2": total_foul_flagrant_2 / total_foul_flagrant,
    "FOUL_INBOUND": total_foul_inbound / total_foul_def_non_shooting,
    "FOUL_LOOSE_BALL": total_foul_loose_ball / total_foul_def_non_shooting,
    "FOUL_OFF_CHARGE": total_foul_off_charge / total_foul_off_total,
    "FOUL_OFF_OTHER": total_foul_off_other / total_foul_off_total,
    "FOUL_PERSONAL": total_foul_personal / total_foul_def_non_shooting,
    "FOUL_PERSONAL_BLOCK": total_foul_personal_block / total_foul_def_non_shooting,
    "FOUL_PERSONAL_TAKE": total_foul_personal_take / total_foul_def_non_shooting,
    "FOUL_TECHNICAL_PER_POSSESSION_OUTCOME": total_foul_technical / possession_outcome_total,
    "FOUL_TECHNICAL_DOUBLE": total_foul_double_technical / total_foul_technical,
    "FOUL_TECHNICAL_NON_PLAYER": total_foul_technical_non_player / total_foul_technical,
    "REBOUND_DEFENSIVE": total_reb_def / total_reb,
    "REBOUND_DEFENSIVE_TEAM": total_def_team_reb / total_reb,
    "REBOUND_OFFENSIVE": total_reb_off / total_reb,
    "REBOUND_OFFENSIVE_TEAM": total_off_team_reb / total_reb,
    "TURNOVER_3_SECOND": total_turnover_3_second / total_turnover,
    "TURNOVER_BAD_PASS": total_turnover_bad_pass / total_turnover,
    "TURNOVER_BAD_PASS_OUT_OF_BOUNDS": total_turnover_bad_pass_out_of_bounds / total_turnover,
    "TURNOVER_KICK_BALL": total_turnover_kick_ball / total_turnover,
    "TURNOVER_LANE_VIOLATION": total_turnover_lane_violation / total_turnover,
    "TURNOVER_LOST_BALL": total_turnover_lost_ball / total_turnover,
    "TURNOVER_LOST_BALL_OUT_OF_BOUNDS": total_turnover_lost_ball_out_of_bounds / total_turnover,
    "TURNOVER_OFFENSIVE_GOALTENDING": total_turnover_off_goaltend / total_turnover,
    "TURNOVER_STEP_OUT_OF_BOUNDS": total_turnover_step_out_of_bounds / total_turnover,
    "TURNOVER_SHOT_CLOCK": total_turnover_shot_clock / total_turnover,
    "TURNOVER_TRAVEL": total_turnover_travel / total_turnover,
    "VIOLATION_DEFENSIVE_GOALTENDING": total_violation_def_goaltend / total_violation_possession,
    "VIOLATION_DEFENSIVE_KICK_BALL": total_violation_def_kick_ball / total_violation_possession,
}


with open('../server/src/data/probabilities/general.json', 'w') as outfile:
    json.dump(general_probabilities, outfile)
print("Finished general probabilities")

fg_x_y_probabilities = {
    "ARC_3": {},
    "AT_RIM": {},
    "CORNER_3": {},
    "LONG_MID_RANGE": {},
    "SHORT_MID_RANGE": {}
}

for shot_type in master_x_y_dict.keys():
    for x_y in master_x_y_dict[shot_type]:
        if shot_type == "ARC_3":
            fg_x_y_probabilities["ARC_3"][x_y] = master_x_y_dict[shot_type][x_y] / total_arc3
        elif shot_type == "AT_RIM":
            fg_x_y_probabilities["AT_RIM"][x_y] = master_x_y_dict[shot_type][x_y] / total_at_rim
        elif shot_type == "CORNER_3":
            fg_x_y_probabilities["CORNER_3"][x_y] = master_x_y_dict[shot_type][x_y] / total_corner3
        elif shot_type == "LONG_MID_RANGE":
            fg_x_y_probabilities["LONG_MID_RANGE"][x_y] = master_x_y_dict[shot_type][x_y] / \
                total_long_mid_range
        elif shot_type == "SHORT_MID_RANGE":
            fg_x_y_probabilities["SHORT_MID_RANGE"][x_y] = master_x_y_dict[shot_type][x_y] / \
                total_short_mid_range
        else:
            raise("Don't know what this is")

with open('../server/src/data/probabilities/fgXY.json', 'w') as outfile:
    json.dump(fg_x_y_probabilities, outfile)

print("Finished FG XY probabilities")


possession_outcome_probabilities = {
    "FIELD_GOAL": possession_outcome_field_goal / possession_outcome_total,
    "FOUL_DEFENSIVE_NON_SHOOTING": possession_outcome_foul_defensive_non_shooting / possession_outcome_total,
    "FOUL_OFFENSIVE": possession_outcome_offensive_foul / possession_outcome_total,
    "JUMP_BALL": possession_outcome_jump_ball / possession_outcome_total,
    "TURNOVER": possession_outcome_turnover / possession_outcome_total,
    "VIOLATION_DEFENSIVE_GOALTENDING": possession_outcome_violation_def_goaltend / possession_outcome_total,
    "VIOLATION_DEFENSIVE_KICK_BALL": possession_outcome_violation_def_kick_ball / possession_outcome_total
}

with open('../server/src/data/probabilities/possessionOutcomes.json', 'w') as outfile:
    json.dump(possession_outcome_probabilities, outfile)

print("Finished possession outcome probabilities")

counter = 1
for player_id in master_player_dict.keys():
    print("Processing player probability ", player_id, " ", counter,
          " of ", len(master_player_dict.keys()))
    counter += 1

    player_stats = master_player_dict[player_id]
    player_probabilities = {
        "ASSIST": player_stats["ASSIST"] / player_stats["ASSIST_CHANCE"] if player_stats["ASSIST_CHANCE"] != 0 else 0.0,
        "BLOCK": player_stats["BLOCK"] / player_stats["BLOCK_CHANCE"] if player_stats["BLOCK_CHANCE"] != 0 else 0.0,
        "FG_ARC_3_ATTEMPT": player_stats["FG_ARC_3_ATTEMPT"] / player_stats["FG_ARC_3_CHANCE_OFFENSIVE"] if player_stats["FG_ARC_3_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_ARC_3_BLOCK": player_stats["FG_ARC_3_BLOCK"] / player_stats["FG_ARC_3_CHANCE_OFFENSIVE"] if player_stats["FG_ARC_3_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_ARC_3_MADE": player_stats["FG_ARC_3_MADE"] / player_stats["FG_ARC_3_ATTEMPT"] if player_stats["FG_ARC_3_ATTEMPT"] != 0 else 0.0,
        "FG_ARC_3_MADE_FOUL": player_stats["FG_ARC_3_MADE_FOUL"] / player_stats["FG_ARC_3_CHANCE_OFFENSIVE"] if player_stats["FG_ARC_3_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_AT_RIM_ATTEMPT": player_stats["FG_AT_RIM_ATTEMPT"] / player_stats["FG_AT_RIM_CHANCE_OFFENSIVE"] if player_stats["FG_AT_RIM_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_AT_RIM_BLOCK": player_stats["FG_AT_RIM_BLOCK"] / player_stats["FG_AT_RIM_CHANCE_OFFENSIVE"] if player_stats["FG_AT_RIM_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_AT_RIM_MADE": player_stats["FG_AT_RIM_MADE"] / player_stats["FG_AT_RIM_ATTEMPT"] if player_stats["FG_AT_RIM_ATTEMPT"] != 0 else 0.0,
        "FG_AT_RIM_MADE_FOUL": player_stats["FG_AT_RIM_MADE_FOUL"] / player_stats["FG_AT_RIM_CHANCE_OFFENSIVE"] if player_stats["FG_AT_RIM_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_CORNER_3_ATTEMPT": player_stats["FG_CORNER_3_ATTEMPT"] / player_stats["FG_CORNER_3_CHANCE_OFFENSIVE"] if player_stats["FG_CORNER_3_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_CORNER_3_BLOCK": player_stats["FG_CORNER_3_BLOCK"] / player_stats["FG_CORNER_3_CHANCE_OFFENSIVE"] if player_stats["FG_CORNER_3_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_CORNER_3_MADE": player_stats["FG_CORNER_3_MADE"] / player_stats["FG_CORNER_3_ATTEMPT"] if player_stats["FG_CORNER_3_ATTEMPT"] != 0 else 0.0,
        "FG_CORNER_3_MADE_FOUL": player_stats["FG_CORNER_3_MADE_FOUL"] / player_stats["FG_CORNER_3_CHANCE_OFFENSIVE"] if player_stats["FG_CORNER_3_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_LONG_MID_RANGE_ATTEMPT": player_stats["FG_LONG_MID_RANGE_ATTEMPT"] / player_stats["FG_LONG_MID_RANGE_CHANCE_OFFENSIVE"] if player_stats["FG_LONG_MID_RANGE_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_LONG_MID_RANGE_BLOCK": player_stats["FG_LONG_MID_RANGE_BLOCK"] / player_stats["FG_LONG_MID_RANGE_CHANCE_OFFENSIVE"] if player_stats["FG_LONG_MID_RANGE_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_LONG_MID_RANGE_MADE": player_stats["FG_LONG_MID_RANGE_MADE"] / player_stats["FG_LONG_MID_RANGE_ATTEMPT"] if player_stats["FG_LONG_MID_RANGE_ATTEMPT"] != 0 else 0.0,
        "FG_LONG_MID_RANGE_MADE_FOUL": player_stats["FG_LONG_MID_RANGE_MADE_FOUL"] / player_stats["FG_LONG_MID_RANGE_CHANCE_OFFENSIVE"] if player_stats["FG_LONG_MID_RANGE_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_SHORT_MID_RANGE_ATTEMPT": player_stats["FG_SHORT_MID_RANGE_ATTEMPT"] / player_stats["FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE"] if player_stats["FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_SHORT_MID_RANGE_BLOCK": player_stats["FG_SHORT_MID_RANGE_BLOCK"] / player_stats["FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE"] if player_stats["FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_SHORT_MID_RANGE_MADE": player_stats["FG_SHORT_MID_RANGE_MADE"] / player_stats["FG_SHORT_MID_RANGE_ATTEMPT"] if player_stats["FG_SHORT_MID_RANGE_ATTEMPT"] != 0 else 0.0,
        "FG_SHORT_MID_RANGE_MADE_FOUL": player_stats["FG_SHORT_MID_RANGE_MADE_FOUL"] / player_stats["FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE"] if player_stats["FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "FG_XY": {
            "ARC_3": {},
            "AT_RIM": {},
            "CORNER_3": {},
            "LONG_MID_RANGE": {},
            "SHORT_MID_RANGE": {}
        },
        "FOUL_AWAY_FROM_PLAY": player_stats["FOUL_AWAY_FROM_PLAY"] / player_stats["FOUL_AWAY_FROM_PLAY_CHANCE"] if player_stats["FOUL_AWAY_FROM_PLAY_CHANCE"] != 0 else 0.0,
        "FOULED_AWAY_FROM_PLAY": player_stats["FOULED_AWAY_FROM_PLAY"] / player_stats["FOULED_AWAY_FROM_PLAY_CHANCE"] if player_stats["FOULED_AWAY_FROM_PLAY_CHANCE"] != 0 else 0.0,
        "FOUL_CLEAR_PATH": player_stats["FOUL_CLEAR_PATH"] / player_stats["FOUL_CLEAR_PATH_CHANCE"] if player_stats["FOUL_CLEAR_PATH_CHANCE"] != 0 else 0.0,
        "FOULED_CLEAR_PATH": player_stats["FOULED_CLEAR_PATH"] / player_stats["FOULED_CLEAR_PATH_CHANCE"] if player_stats["FOULED_CLEAR_PATH_CHANCE"] != 0 else 0.0,
        "FOUL_COUNT_AS_PERSONAL": player_stats["FOUL_COUNT_AS_PERSONAL"] / player_stats["FOUL_COUNT_AS_PERSONAL_CHANCE"] if player_stats["FOUL_COUNT_AS_PERSONAL_CHANCE"] != 0 else 0.0,
        "FOULED_COUNT_AS_PERSONAL": player_stats["FOULED_COUNT_AS_PERSONAL"] / player_stats["FOULED_COUNT_AS_PERSONAL_CHANCE"] if player_stats["FOULED_COUNT_AS_PERSONAL_CHANCE"] != 0 else 0.0,
        "FOUL_COUNT_TOWARD_PENALTY": player_stats["FOUL_COUNT_TOWARD_PENALTY"] / player_stats["FOUL_COUNT_TOWARD_PENALTY_CHANCE"] if player_stats["FOUL_COUNT_TOWARD_PENALTY_CHANCE"] != 0 else 0.0,
        "FOULED_COUNT_TOWARD_PENALTY": player_stats["FOULED_COUNT_TOWARD_PENALTY"] / player_stats["FOULED_COUNT_TOWARD_PENALTY_CHANCE"] if player_stats["FOULED_COUNT_TOWARD_PENALTY_CHANCE"] != 0 else 0.0,
        "FOUL_DEFENSIVE_NON_SHOOTING": player_stats["FOUL_DEFENSIVE_NON_SHOOTING"] / player_stats["FOUL_DEFENSIVE_NON_SHOOTING_CHANCE"] if player_stats["FOUL_DEFENSIVE_NON_SHOOTING_CHANCE"] != 0 else 0.0,
        "FOULED_DEFENSIVE_NON_SHOOTING": player_stats["FOULED_DEFENSIVE_NON_SHOOTING"] / player_stats["FOULED_DEFENSIVE_NON_SHOOTING_CHANCE"] if player_stats["FOULED_DEFENSIVE_NON_SHOOTING_CHANCE"] != 0 else 0.0,
        "FOUL_DOUBLE": player_stats["FOUL_DOUBLE"] / player_stats["FOUL_DOUBLE_CHANCE"] if player_stats["FOUL_DOUBLE_CHANCE"] != 0 else 0.0,
        "FOUL_DOUBLE_TECHNICAL": player_stats["FOUL_DOUBLE_TECHNICAL"] / player_stats["FOUL_DOUBLE_TECHNICAL_CHANCE"] if player_stats["FOUL_DOUBLE_TECHNICAL_CHANCE"] != 0 else 0.0,
        "FOUL_FLAGRANT": player_stats["FOUL_FLAGRANT"] / player_stats["FOUL_FLAGRANT_CHANCE"] if player_stats["FOUL_FLAGRANT_CHANCE"] != 0 else 0.0,
        "FOULED_FLAGRANT": player_stats["FOULED_FLAGRANT"] / player_stats["FOULED_FLAGRANT_CHANCE"] if player_stats["FOULED_FLAGRANT_CHANCE"] != 0 else 0.0,
        "FOUL_FLAGRANT_1": player_stats["FOUL_FLAGRANT_1"] / player_stats["FOUL_FLAGRANT_1_CHANCE"] if player_stats["FOUL_FLAGRANT_1_CHANCE"] != 0 else 0.0,
        "FOULED_FLAGRANT_1": player_stats["FOULED_FLAGRANT_1"] / player_stats["FOULED_FLAGRANT_1_CHANCE"] if player_stats["FOULED_FLAGRANT_1_CHANCE"] != 0 else 0.0,
        "FOUL_FLAGRANT_2": player_stats["FOUL_FLAGRANT_2"] / player_stats["FOUL_FLAGRANT_2_CHANCE"] if player_stats["FOUL_FLAGRANT_2_CHANCE"] != 0 else 0.0,
        "FOULED_FLAGRANT_2": player_stats["FOULED_FLAGRANT_2"] / player_stats["FOULED_FLAGRANT_2_CHANCE"] if player_stats["FOULED_FLAGRANT_2_CHANCE"] != 0 else 0.0,
        "FOUL_INBOUND": player_stats["FOUL_INBOUND"] / player_stats["FOUL_INBOUND_CHANCE"] if player_stats["FOUL_INBOUND_CHANCE"] != 0 else 0.0,
        "FOULED_INBOUND": player_stats["FOULED_INBOUND"] / player_stats["FOULED_INBOUND_CHANCE"] if player_stats["FOULED_INBOUND_CHANCE"] != 0 else 0.0,
        "FOUL_LOOSE_BALL": player_stats["FOUL_LOOSE_BALL"] / player_stats["FOUL_LOOSE_BALL_CHANCE"] if player_stats["FOUL_LOOSE_BALL_CHANCE"] != 0 else 0.0,
        "FOULED_LOOSE_BALL": player_stats["FOULED_LOOSE_BALL"] / player_stats["FOULED_LOOSE_BALL_CHANCE"] if player_stats["FOULED_LOOSE_BALL_CHANCE"] != 0 else 0.0,
        "FOUL_OFFENSIVE_CHARGE": player_stats["FOUL_OFFENSIVE_CHARGE"] / player_stats["FOUL_OFFENSIVE_CHARGE_CHANCE"] if player_stats["FOUL_OFFENSIVE_CHARGE_CHANCE"] != 0 else 0.0,
        "FOULED_OFFENSIVE_CHARGE": player_stats["FOULED_OFFENSIVE_CHARGE"] / player_stats["FOULED_OFFENSIVE_CHARGE_CHANCE"] if player_stats["FOULED_OFFENSIVE_CHARGE_CHANCE"] != 0 else 0.0,
        "FOUL_OFFENSIVE_OTHER": player_stats["FOUL_OFFENSIVE_OTHER"] / player_stats["FOUL_OFFENSIVE_OTHER_CHANCE"] if player_stats["FOUL_OFFENSIVE_OTHER_CHANCE"] != 0 else 0.0,
        "FOULED_OFFENSIVE_OTHER": player_stats["FOULED_OFFENSIVE_OTHER"] / player_stats["FOULED_OFFENSIVE_OTHER_CHANCE"] if player_stats["FOULED_OFFENSIVE_OTHER_CHANCE"] != 0 else 0.0,
        "FOUL_OFFENSIVE_TOTAL": player_stats["FOUL_OFFENSIVE_TOTAL"] / player_stats["FOUL_OFFENSIVE_TOTAL_CHANCE"] if player_stats["FOUL_OFFENSIVE_TOTAL_CHANCE"] != 0 else 0.0,
        "FOULED_OFFENSIVE_TOTAL": player_stats["FOULED_OFFENSIVE_TOTAL"] / player_stats["FOULED_OFFENSIVE_TOTAL_CHANCE"] if player_stats["FOULED_OFFENSIVE_TOTAL_CHANCE"] != 0 else 0.0,
        "FOUL_PERSONAL": player_stats["FOUL_PERSONAL"] / player_stats["FOUL_PERSONAL_CHANCE"] if player_stats["FOUL_PERSONAL_CHANCE"] != 0 else 0.0,
        "FOULED_PERSONAL": player_stats["FOULED_PERSONAL"] / player_stats["FOULED_PERSONAL_CHANCE"] if player_stats["FOULED_PERSONAL_CHANCE"] != 0 else 0.0,
        "FOUL_PERSONAL_BLOCK": player_stats["FOUL_PERSONAL_BLOCK"] / player_stats["FOUL_PERSONAL_BLOCK_CHANCE"] if player_stats["FOUL_PERSONAL_BLOCK_CHANCE"] != 0 else 0.0,
        "FOULED_PERSONAL_BLOCK": player_stats["FOULED_PERSONAL_BLOCK"] / player_stats["FOULED_PERSONAL_BLOCK_CHANCE"] if player_stats["FOULED_PERSONAL_BLOCK_CHANCE"] != 0 else 0.0,
        "FOUL_PERSONAL_TAKE": player_stats["FOUL_PERSONAL_TAKE"] / player_stats["FOUL_PERSONAL_TAKE_CHANCE"] if player_stats["FOUL_PERSONAL_TAKE_CHANCE"] != 0 else 0.0,
        "FOULED_PERSONAL_TAKE": player_stats["FOULED_PERSONAL_TAKE"] / player_stats["FOULED_PERSONAL_TAKE_CHANCE"] if player_stats["FOULED_PERSONAL_TAKE_CHANCE"] != 0 else 0.0,
        "FOUL_SHOOTING": player_stats["FOUL_SHOOTING"] / player_stats["FOUL_SHOOTING_CHANCE"] if player_stats["FOUL_SHOOTING_CHANCE"] != 0 else 0.0,
        "FOULED_SHOOTING": player_stats["FOULED_SHOOTING"] / player_stats["FOULED_SHOOTING_CHANCE"] if player_stats["FOULED_SHOOTING_CHANCE"] != 0 else 0.0,
        "FOUL_SHOOTING_BLOCK": player_stats["FOUL_SHOOTING_BLOCK"] / player_stats["FOUL_SHOOTING_BLOCK_CHANCE"] if player_stats["FOUL_SHOOTING_BLOCK_CHANCE"] != 0 else 0.0,
        "FOULED_SHOOTING_BLOCK": player_stats["FOULED_SHOOTING_BLOCK"] / player_stats["FOULED_SHOOTING_BLOCK_CHANCE"] if player_stats["FOULED_SHOOTING_BLOCK_CHANCE"] != 0 else 0.0,
        "FOUL_TECHNICAL": player_stats["FOUL_TECHNICAL"] / player_stats["FOUL_TECHNICAL_CHANCE"] if player_stats["FOUL_TECHNICAL_CHANCE"] != 0 else 0.0,
        "FT": player_stats["FT_MADE"] / player_stats["FT_ATTEMPT"] if player_stats["FT_ATTEMPT"] != 0 else 0.0,
        "REBOUND_DEFENSIVE": player_stats["REBOUND_DEFENSIVE"] / player_stats["REBOUND_DEFENSIVE_CHANCE"] if player_stats["REBOUND_DEFENSIVE_CHANCE"] != 0 else 0.0,
        "REBOUND_OFFENSIVE": player_stats["REBOUND_OFFENSIVE"] / player_stats["REBOUND_OFFENSIVE_CHANCE"] if player_stats["REBOUND_OFFENSIVE_CHANCE"] != 0 else 0.0,
        "STEAL": player_stats["STEAL"] / player_stats["STEAL_CHANCE"] if player_stats["STEAL_CHANCE"] != 0 else 0.0,
        "SHOT_TYPE_ARC_3_OFFENSIVE": player_stats["FG_ARC_3_CHANCE_OFFENSIVE"] / player_stats["FG_TOTAL_CHANCE_OFFENSIVE"] if player_stats["FG_ARC_3_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_ARC_3_DEFENSIVE": player_stats["FG_ARC_3_CHANCE_DEFENSIVE"] / player_stats["FG_TOTAL_CHANCE_DEFENSIVE"] if player_stats["FG_ARC_3_CHANCE_DEFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_AT_RIM_OFFENSIVE": player_stats["FG_AT_RIM_CHANCE_OFFENSIVE"] / player_stats["FG_TOTAL_CHANCE_OFFENSIVE"] if player_stats["FG_AT_RIM_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_AT_RIM_DEFENSIVE": player_stats["FG_AT_RIM_CHANCE_DEFENSIVE"] / player_stats["FG_TOTAL_CHANCE_DEFENSIVE"] if player_stats["FG_AT_RIM_CHANCE_DEFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_CORNER_3_OFFENSIVE": player_stats["FG_CORNER_3_CHANCE_OFFENSIVE"] / player_stats["FG_TOTAL_CHANCE_OFFENSIVE"] if player_stats["FG_CORNER_3_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_CORNER_3_DEFENSIVE": player_stats["FG_CORNER_3_CHANCE_DEFENSIVE"] / player_stats["FG_TOTAL_CHANCE_DEFENSIVE"] if player_stats["FG_CORNER_3_CHANCE_DEFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_LONG_MID_RANGE_OFFENSIVE": player_stats["FG_LONG_MID_RANGE_CHANCE_OFFENSIVE"] / player_stats["FG_TOTAL_CHANCE_OFFENSIVE"] if player_stats["FG_LONG_MID_RANGE_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_LONG_MID_RANGE_DEFENSIVE": player_stats["FG_LONG_MID_RANGE_CHANCE_DEFENSIVE"] / player_stats["FG_TOTAL_CHANCE_DEFENSIVE"] if player_stats["FG_LONG_MID_RANGE_CHANCE_DEFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_SHORT_MID_RANGE_OFFENSIVE": player_stats["FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE"] / player_stats["FG_TOTAL_CHANCE_OFFENSIVE"] if player_stats["FG_SHORT_MID_RANGE_CHANCE_OFFENSIVE"] != 0 else 0.0,
        "SHOT_TYPE_SHORT_MID_RANGE_DEFENSIVE": player_stats["FG_SHORT_MID_RANGE_CHANCE_DEFENSIVE"] / player_stats["FG_TOTAL_CHANCE_DEFENSIVE"] if player_stats["FG_SHORT_MID_RANGE_CHANCE_DEFENSIVE"] != 0 else 0.0,
        "TURNOVER": player_stats["TURNOVER"] / player_stats["TURNOVER_CHANCE"] if player_stats["TURNOVER_CHANCE"] != 0 else 0.0,
        "VIOLATION_DEFENSIVE_GOALTENDING": player_stats["VIOLATION_DEFENSIVE_GOALTENDING"] / player_stats["VIOLATION_DEFENSIVE_GOALTENDING_CHANCE"] if player_stats["VIOLATION_DEFENSIVE_GOALTENDING_CHANCE"] != 0 else 0.0,
        "VIOLATION_DEFENSIVE_KICK_BALL": player_stats["VIOLATION_DEFENSIVE_KICK_BALL"] / player_stats["VIOLATION_DEFENSIVE_KICK_BALL_CHANCE"] if player_stats["VIOLATION_DEFENSIVE_KICK_BALL_CHANCE"] != 0 else 0.0,
        # "TOTALS": {
        #     **player_stats
        # }
    }

    for shot_type in player_stats["FG_XY"].keys():
        for x_y in player_stats["FG_XY"][shot_type]:
            if shot_type == "ARC_3":
                player_probabilities["FG_XY"]["ARC_3"][x_y] = player_stats["FG_XY"][shot_type][x_y] / \
                    player_stats["FG_ARC_3_ATTEMPT"]
            elif shot_type == "AT_RIM":
                player_probabilities["FG_XY"]["AT_RIM"][x_y] = player_stats["FG_XY"][shot_type][x_y] / \
                    player_stats["FG_AT_RIM_ATTEMPT"]
            elif shot_type == "CORNER_3":
                player_probabilities["FG_XY"]["CORNER_3"][x_y] = player_stats["FG_XY"][shot_type][x_y] / \
                    player_stats["FG_CORNER_3_ATTEMPT"]
            elif shot_type == "LONG_MID_RANGE":
                player_probabilities["FG_XY"]["LONG_MID_RANGE"][x_y] = player_stats["FG_XY"][shot_type][x_y] / \
                    player_stats["FG_LONG_MID_RANGE_ATTEMPT"]
            elif shot_type == "SHORT_MID_RANGE":
                player_probabilities["FG_XY"]["SHORT_MID_RANGE"][x_y] = player_stats["FG_XY"][shot_type][x_y] / \
                    player_stats["FG_SHORT_MID_RANGE_ATTEMPT"]
            else:
                raise("Don't know what this is")

    with open(f'../server/src/data/probabilities-player/{player_id}.json', 'w') as outfile:
        json.dump(player_probabilities, outfile)

    with open(f'../server/src/data/totals-player/{player_id}.json', 'w') as outfile:
        json.dump(player_stats, outfile)


play_length_output = {}

for key in master_play_length_dict.keys():
    total = 0
    play_length_output[key] = {}
    for nested_key in master_play_length_dict[key]:
        total += master_play_length_dict[key][nested_key]
    for nested_key in master_play_length_dict[key]:
        play_length_output[key][nested_key] = master_play_length_dict[key][nested_key] / total

with open(f'../server/src/data/probabilities/possessionLength.json', 'w') as outfile:
    json.dump(play_length_output, outfile)


df = pd.DataFrame.from_dict(master_foul_dict)
df.to_pickle("./output/foul-explorer.pkl")
df.to_json("./output/foul-explorer.json", orient="index")
