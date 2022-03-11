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

master_game_dict = {}
master_player_dict = {}
master_team_dict = {}
master_x_y_dict = {
    "Arc3": {},
    "AtRim": {},
    "Corner3": {},
    "LongMidRange": {},
    "ShortMidRange": {}
}
master_play_length_dict = {
    "fg": {},
    "foul": {},
    "jumpBall": {},
    "rebound": {},
    "turnover": {},
    "violation": {}
}


def players_on_court_update(players_on_court, dict, field, value):
    for player in players_on_court:
        dict[player][field] += value


def player_update(player_id, dict, field, value):
    dict[player_id][field] += value


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


for season_game in season.games.items[:100]:
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
        "assist": 0,
        "block": 0,
        "ejection": 0,
        "fg": 0,
        "fgIncludingShootingFoulsMissed": 0,
        "fgArc3": 0,
        "fgAtRim": 0,
        "fgCorner3": 0,
        "fgLongMidRange": 0,
        "fgShortMidRange": 0,
        "fgMade": 0,
        "fgXY": {
            "Arc3": {},
            "AtRim": {},
            "Corner3": {},
            "LongMidRange": {},
            "ShortMidRange": {}
        },
        "foul": 0,
        "foulAwayFromPlay": 0,
        "foulClearPath": 0,
        "foulCountAsPersonal": 0,
        "foulCountTowardPenalty": 0,
        "foulDefNonShooting": 0,
        "foulDouble": 0,
        "foulDoubleTechnical": 0,
        "foulFlagrant": 0,
        "foulFlagrant1": 0,
        "foulFlagrant2": 0,
        "foulInbound": 0,
        "foulLooseBall": 0,
        "foulOffCharge": 0,
        "foulOffOther": 0,
        "foulOffTotal": 0,
        "foulPersonal": 0,
        "foulPersonalBlock": 0,
        "foulPersonalTake": 0,
        "foulShooting": 0,
        "foulShootingBlock": 0,
        "foulTechnical": 0,
        "jumpBall": 0,
        "possession": 0,
        "reb": 0,
        "rebDef": 0,
        "rebOff": 0,
        "rebDefTeam": 0,
        "rebOffTeam": 0,
        "replay": 0,
        "steal": 0,
        "substitution": 0,
        "timeout": 0,
        "turnover": 0,
        "turnover3Second": 0,
        "turnoverBadPass": 0,  # steal
        "turnoverBadPassOutOfBounds": 0,
        "turnoverKickBall": 0,
        "turnoverLaneViolation": 0,
        "turnoverLostBall": 0,  # steal
        "turnoverLostBallOutOfBounds": 0,
        "turnoverOffGoaltend": 0,
        "turnoverShotClock": 0,
        "turnoverStepOutOfBounds": 0,
        "turnoverTravel": 0,
        "violation": 0,
        "violationDelayOfGame": 0,  # FG after usually
        "violationDoubleLane": 0,  # FREE THROW
        "violationDefGoaltend": 0,  # POSSESSION - FG awarded
        "violationJumpBall": 0,  # JUMP BALL
        "violationDefKickBall": 0,  # POSSESSION - Defense kicked ball
        "violationLane": 0,  # FREE THROW
    }

    for item in game.boxscore.player_items:
        if item["player_id"] not in master_player_dict:
            master_player_dict[item["player_id"]] = {
                "assist": 0,
                "assistChance": 0,
                "defBlock": 0,
                "defBlockChance": 0,
                "defSteal": 0,
                "defStealChance": 0,
                "fgArc3Attempt": 0,
                "fgArc3Block": 0,
                "fgArc3Chance": 0,
                "fgArc3DefChance": 0,
                "fgArc3Made": 0,
                "fgArc3MadeFoul": 0,
                "fgAtRimAttempt": 0,
                "fgAtRimBlock": 0,
                "fgAtRimChance": 0,
                "fgAtRimDefChance": 0,
                "fgAtRimMade": 0,
                "fgAtRimMadeFoul": 0,
                "fgCorner3Attempt": 0,
                "fgCorner3Block": 0,
                "fgCorner3Chance": 0,
                "fgCorner3DefChance": 0,
                "fgCorner3Made": 0,
                "fgCorner3MadeFoul": 0,
                "fgLongMidRangeAttempt": 0,
                "fgLongMidRangeBlock": 0,
                "fgLongMidRangeChance": 0,
                "fgLongMidRangeDefChance": 0,
                "fgLongMidRangeMade": 0,
                "fgLongMidRangeMadeFoul": 0,
                "fgShortMidRangeAttempt": 0,
                "fgShortMidRangeBlock": 0,
                "fgShortMidRangeChance": 0,
                "fgShortMidRangeDefChance": 0,
                "fgShortMidRangeMade": 0,
                "fgShortMidRangeMadeFoul": 0,
                "fgTotalAttempt": 0,
                "fgTotalBlock": 0,
                "fgTotalChance": 0,
                "fgTotalDefChance": 0,
                "fgTotalMade": 0,
                "fgTotalMadeFoul": 0,
                "fgTotalMissFoul2": 0,
                "fgTotalMissFoul3": 0,
                "fgXY": {
                    "Arc3": {},
                    "AtRim": {},
                    "Corner3": {},
                    "LongMidRange": {},
                    "ShortMidRange": {}
                },
                "ftAttempt": 0,
                "ftMade": 0,
                "rebDef": 0,
                "rebDefChance": 0,
                "rebOff": 0,
                "rebOffChance": 0,
                "turnover": 0,
                "turnoverChance": 0,
                "violationDefGoaltend": 0,
                "violationDefGoaltendChance": 0,
                "violationDefKickBall": 0,
                "violationDefKickBallChance": 0,
            }

    for possession in game.possessions.items:
        for possession_event in possession.events:
            possession_event_length = possession_event.seconds_since_previous_event
            if possession_event.count_as_possession:
                game_update(game_id, master_game_dict, "possession", 1)

            offense_team_id = possession_event.get_offense_team_id()
            defense_team_id = team_0 if team_0 != offense_team_id else team_1
            offense_players = possession_event.current_players[offense_team_id]
            defense_players = possession_event.current_players[defense_team_id]

            if isinstance(possession_event, EndOfPeriod):
                continue

            if isinstance(possession_event, StartOfPeriod):
                continue

            if isinstance(possession_event, Ejection):
                game_update(game_id, master_game_dict, "ejection", 1)
                continue

            if isinstance(possession_event, JumpBall):
                is_jump_ball_starts_period = False
                for event in possession_event.get_all_events_at_current_time():
                    if isinstance(event, StartOfPeriod):
                        is_jump_ball_starts_period = True
                if is_jump_ball_starts_period != True:
                    game_update(game_id, master_game_dict, "jumpBall", 1)
                    possession_length_update(
                        "jumpBall", master_play_length_dict, possession_event_length)
                continue

            if isinstance(possession_event, Replay):
                game_update(game_id, master_game_dict, "replay", 1)
                continue

            if isinstance(possession_event, Substitution):
                game_update(game_id, master_game_dict, "substitution", 1)
                continue

            if isinstance(possession_event, Timeout):
                game_update(game_id, master_game_dict, "timeout", 1)
                continue

            if isinstance(possession_event, Violation):
                game_update(game_id, master_game_dict, "violation", 1)
                if possession_event.is_delay_of_game:
                    game_update(game_id, master_game_dict,
                                "violationDelayOfGame", 1)
                if possession_event.is_double_lane_violation:
                    game_update(game_id, master_game_dict,
                                "violationDoubleLane", 1)
                if possession_event.is_goaltend_violation:
                    game_update(game_id, master_game_dict,
                                "violationDefGoaltend", 1)
                    players_on_court_update(
                        defense_players, master_player_dict, "violationDefGoaltendChance", 1)
                    player = possession_event.player1_id
                    player_update(player, master_player_dict,
                                  "violationDefGoaltend", 1)

                    possession_length_update(
                        "violation", master_play_length_dict, possession_event_length)

                if possession_event.is_jumpball_violation:
                    game_update(game_id, master_game_dict,
                                "violationJumpBall", 1)
                if possession_event.is_kicked_ball_violation:
                    game_update(game_id, master_game_dict,
                                "violationDefKickBall", 1)
                    players_on_court_update(
                        defense_players, master_player_dict, "violationDefKickBallChance", 1)
                    player = possession_event.player1_id
                    player_update(player, master_player_dict,
                                  "violationDefKickBall", 1)
                    possession_length_update(
                        "violation", master_play_length_dict, possession_event_length)
                if possession_event.is_lane_violation:
                    game_update(game_id, master_game_dict,
                                "violationLane", 1)

            if isinstance(possession_event, Turnover) and not possession_event.is_no_turnover:
                possession_length_update(
                    "turnover", master_play_length_dict, possession_event_length)
                players_on_court_update(
                    offense_players, master_player_dict, "turnoverChance", 1)
                offense_player = possession_event.player1_id
                if offense_player != 0:
                    player_update(offense_player,
                                  master_player_dict, "turnover", 1)

                game_update(game_id, master_game_dict, "turnover", 1)
                if possession_event.is_steal:
                    players_on_court_update(
                        defense_players, master_player_dict, "defStealChance", 1)
                    player = possession_event.player3_id
                    player_update(player, master_player_dict, "defSteal", 1)
                    game_update(game_id, master_game_dict,
                                "steal", 1)

                if possession_event.is_3_second_violation:
                    game_update(game_id, master_game_dict,
                                "turnover3Second", 1)
                if possession_event.is_bad_pass:
                    game_update(game_id, master_game_dict,
                                "turnoverBadPass", 1)
                if possession_event.is_bad_pass_out_of_bounds:
                    game_update(game_id, master_game_dict,
                                "turnoverBadPassOutOfBounds", 1)
                if possession_event.is_kicked_ball:
                    game_update(game_id, master_game_dict,
                                "turnoverKickBall", 1)
                if possession_event.is_lane_violation:
                    game_update(game_id, master_game_dict,
                                "turnoverLaneViolation", 1)
                if possession_event.is_lost_ball:
                    game_update(game_id, master_game_dict,
                                "turnoverLostBall", 1)
                if possession_event.is_lost_ball_out_of_bounds:
                    game_update(game_id, master_game_dict,
                                "turnoverLostBallOutOfBounds", 1)
                if possession_event.is_offensive_goaltending:
                    game_update(game_id, master_game_dict,
                                "turnoverOffGoaltend", 1)
                if possession_event.is_shot_clock_violation:
                    game_update(game_id, master_game_dict,
                                "turnoverShotClock", 1)
                if possession_event.is_step_out_of_bounds:
                    game_update(game_id, master_game_dict,
                                "turnoverStepOutOfBounds", 1)
                if possession_event.is_travel:
                    game_update(game_id, master_game_dict,
                                "turnoverTravel", 1)

            if isinstance(possession_event, FreeThrow):
                player = possession_event.player1_id
                player_update(player, master_player_dict, "ftAttempt", 1)
                if possession_event.is_made:
                    player_update(player, master_player_dict, "ftMade", 1)
                if possession_event.foul_that_led_to_ft != None:
                    if possession_event.foul_that_led_to_ft.foul_type_string == "2pt Shooting Foul":
                        player_update(player, master_player_dict,
                                      "fgTotalMissFoul2", 1)
                        game_update(game_id, master_game_dict,
                                    "fgIncludingShootingFoulsMissed", 1)

                    if possession_event.foul_that_led_to_ft.foul_type_string == "3pt Shooting Foul":
                        player_update(player, master_player_dict,
                                      "fgTotalMissFoul3", 1)
                        game_update(game_id, master_game_dict,
                                    "fgIncludingShootingFoulsMissed", 1)

                continue

            if isinstance(possession_event, Rebound):
                if possession_event.is_real_rebound:
                    possession_length_update(
                        "rebound", master_play_length_dict, possession_event_length)
                    game_update(
                        game_id, master_game_dict, "reb", 1)
                    players_on_court_update(
                        offense_players, master_player_dict, "rebOffChance", 1)
                    players_on_court_update(
                        defense_players, master_player_dict, "rebDefChance", 1)
                    if hasattr(possession_event, 'player1_id') and possession_event.player1_id != 0:
                        player = possession_event.player1_id
                        if possession_event.oreb:
                            player_update(
                                player, master_player_dict, "rebOff", 1)
                            game_update(game_id, master_game_dict, "rebOff", 1)
                        else:
                            player_update(
                                player, master_player_dict, "rebDef", 1)
                            game_update(game_id, master_game_dict, "rebDef", 1)
                    else:  # is team rebound
                        if possession_event.oreb:
                            game_update(game_id, master_game_dict,
                                        "rebOffTeam", 1)
                        else:
                            game_update(game_id, master_game_dict,
                                        "rebDefTeam", 1)

            if isinstance(possession_event, Foul):
                game_update(game_id, master_game_dict,
                            "foul", 1)
                possession_length_update(
                    "foul", master_play_length_dict, possession_event_length)
                if possession_event.is_away_from_play_foul:
                    game_update(game_id, master_game_dict,
                                "foulAwayFromPlay", 1)

                if possession_event.counts_as_personal_foul:
                    game_update(game_id, master_game_dict,
                                "foulCountAsPersonal", 1)

                if possession_event.counts_towards_penalty:
                    game_update(game_id, master_game_dict,
                                "foulCountTowardPenalty", 1)

                if possession_event.is_charge:
                    game_update(game_id, master_game_dict, "foulOffCharge", 1)
                    game_update(game_id, master_game_dict, "foulOffTotal", 1)

                if possession_event.is_clear_path_foul:
                    game_update(game_id, master_game_dict, "foulClearPath", 1)

                if possession_event.is_double_foul:
                    game_update(game_id, master_game_dict, "foulDouble", 1)

                if possession_event.is_double_technical:
                    game_update(game_id, master_game_dict,
                                "foulDoubleTechnical", 1)

                if possession_event.is_flagrant:
                    game_update(game_id, master_game_dict,
                                "foulFlagrant", 1)

                if possession_event.is_flagrant1:
                    game_update(game_id, master_game_dict,
                                "foulFlagrant1", 1)

                if possession_event.is_flagrant2:
                    game_update(game_id, master_game_dict,
                                "foulFlagrant2", 1)

                if possession_event.is_inbound_foul:
                    game_update(game_id, master_game_dict,
                                "foulInbound", 1)

                if possession_event.is_loose_ball_foul:
                    game_update(game_id, master_game_dict,
                                "foulLooseBall", 1)

                if possession_event.is_offensive_foul:
                    game_update(game_id, master_game_dict,
                                "foulOffOther", 1)
                    game_update(game_id, master_game_dict,
                                "foulOffTotal", 1)

                if possession_event.is_personal_block_foul:
                    game_update(game_id, master_game_dict,
                                "foulPersonalBlock", 1)

                if possession_event.is_personal_foul:
                    game_update(game_id, master_game_dict,
                                "foulPersonal", 1)

                if possession_event.is_personal_take_foul:
                    game_update(game_id, master_game_dict,
                                "foulPersonalTake", 1)

                if possession_event.is_shooting_block_foul:
                    game_update(game_id, master_game_dict,
                                "foulShootingBlock", 1)

                if possession_event.is_shooting_foul:
                    game_update(game_id, master_game_dict,
                                "foulShooting", 1)

                if possession_event.is_technical:
                    game_update(game_id, master_game_dict,
                                "foulTechnical", 1)

                if possession_event.is_offensive_foul == False and possession_event.is_shooting_foul == False and possession_event.is_shooting_block_foul == False and possession_event.is_charge == False:
                    if (possession_event.is_away_from_play_foul or possession_event.is_clear_path_foul or possession_event.is_loose_ball_foul or possession_event.is_personal_block_foul or possession_event.is_personal_foul):
                        game_update(game_id, master_game_dict,
                                    "foulDefNonShooting", 1)

            if isinstance(possession_event, FieldGoal):
                possession_length_update(
                    "fg", master_play_length_dict, possession_event_length)
                players_on_court_update(
                    offense_players, master_player_dict, "fgTotalChance", 1)
                players_on_court_update(
                    defense_players, master_player_dict, "fgTotalDefChance", 1)
                game_update(game_id, master_game_dict,
                            "fg", 1)
                game_update(game_id, master_game_dict,
                            "fgIncludingShootingFoulsMissed", 1)

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
                                    "assist", 1)
                        players_on_court_update(
                            offense_players, master_player_dict, "assistChance", 1)
                        player = possession_event.player2_id
                        player_update(
                            player, master_player_dict, "assist", 1)

                    shot_type_field_string = ""

                    if is_arc_3:
                        shot_type_field_string = "Arc3"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgArc3Chance", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "fgArc3DefChance", 1)
                        game_update(game_id, master_game_dict,
                                    "fgArc3", 1)
                    elif is_at_rim:
                        shot_type_field_string = "AtRim"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgAtRimChance", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "fgAtRimDefChance", 1)
                        game_update(game_id, master_game_dict,
                                    "fgAtRim", 1)
                    elif is_corner_3:
                        shot_type_field_string = "Corner3"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgCorner3Chance", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "fgCorner3DefChance", 1)
                        game_update(game_id, master_game_dict,
                                    "fgCorner3", 1)
                    elif is_long_mid_range:
                        shot_type_field_string = "LongMidRange"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgLongMidRangeChance", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "fgLongMidRangeDefChance", 1)
                        game_update(game_id, master_game_dict,
                                    "fgLongMidRange", 1)
                    elif is_short_mid_range:
                        shot_type_field_string = "ShortMidRange"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgShortMidRangeChance", 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "fgShortMidRangeDefChance", 1)
                        game_update(game_id, master_game_dict,
                                    "fgShortMidRange", 1)
                    else:
                        raise("Don't know what this is")

                    shot_x = possession_event.shot_data["X"]
                    shot_y = possession_event.shot_data["Y"]

                    shot_x_y_key = f'{shot_x}|{shot_y}'

                    if shot_x_y_key in master_x_y_dict[shot_type_field_string]:
                        master_x_y_dict[shot_type_field_string][shot_x_y_key] += 1
                    else:
                        master_x_y_dict[shot_type_field_string][shot_x_y_key] = 1

                    if shot_x_y_key in master_game_dict[game_id]["fgXY"][shot_type_field_string]:
                        master_game_dict[game_id]["fgXY"][shot_type_field_string][shot_x_y_key] += 1
                    else:
                        master_game_dict[game_id]["fgXY"][shot_type_field_string][shot_x_y_key] = 1

                    if shot_x_y_key in master_player_dict[player]["fgXY"][shot_type_field_string]:
                        master_player_dict[player]["fgXY"][shot_type_field_string][shot_x_y_key] += 1
                    else:
                        master_player_dict[player]["fgXY"][shot_type_field_string][shot_x_y_key] = 1

                    field_string = "fg" + shot_type_field_string

                    player_update(player, master_player_dict,
                                  field_string + "Attempt", 1)

                    player_update(player, master_player_dict,
                                  "fgTotalAttempt", 1)

                    if is_block:
                        game_update(game_id, master_game_dict,
                                    "block", 1)
                        field_string += "Block"
                        player_update(player, master_player_dict,
                                      field_string, 1)
                        players_on_court_update(
                            defense_players, master_player_dict, "defBlockChance", 1)
                        blocking_player = possession_event.player3_id
                        player_update(blocking_player, master_player_dict,
                                      "defBlock", 1)

                    if is_made:
                        game_update(game_id, master_game_dict,
                                    "fgMade", 1)
                        field_string += "Made"
                        player_update(player, master_player_dict,
                                      field_string, 1)
                        player_update(player, master_player_dict,
                                      "fgTotalMade", 1)
                        if is_and_1:
                            player_update(player, master_player_dict,
                                          field_string + "Foul", 1)
                            player_update(player, master_player_dict,
                                          "fgTotalMadeFoul", 1)

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
total_foul_shooting = 0
total_long_mid_range = 0
total_off_foul = 0
total_off_foul_charge = 0
total_off_foul_other = 0
total_off_team_reb = 0
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

    possession_outcome_total += game["fg"] + game["foulOffTotal"] + game["turnover"] + game["foulDefNonShooting"] + \
        game["jumpBall"] + game["violationDefGoaltend"] + \
        game["violationDefKickBall"]

    possession_outcome_field_goal += game["fg"]
    possession_outcome_foul_defensive_non_shooting += game["foulDefNonShooting"]
    possession_outcome_jump_ball += game["jumpBall"]
    possession_outcome_offensive_foul += game["foulOffTotal"]
    possession_outcome_turnover += game["turnover"]
    possession_outcome_violation_def_goaltend += game["violationDefGoaltend"]
    possession_outcome_violation_def_kick_ball += game["violationDefKickBall"]

    total_off_foul += game["foulOffTotal"]
    total_off_foul_charge += game["foulOffCharge"]
    total_off_foul_other += game["foulOffOther"]

    total_foul_shooting += game["foulShooting"]

    total_fg_including_shooting_foul_missed += game["fgIncludingShootingFoulsMissed"]

    total_fg += game["fg"]
    total_fg_made += game["fgMade"]
    total_assist += game["assist"]
    total_arc3 += game["fgArc3"]
    total_at_rim += game["fgAtRim"]
    total_corner3 += game["fgCorner3"]
    total_long_mid_range += game["fgLongMidRange"]
    total_short_mid_range += game["fgShortMidRange"]
    total_block += game["block"]

    total_reb += game["reb"]
    total_reb_off += game["rebOff"]
    total_reb_def += game["rebDef"]
    total_def_team_reb += game["rebDefTeam"]
    total_off_team_reb += game["rebOffTeam"]

    total_steal += game["steal"]
    total_turnover += game["turnover"]
    total_turnover_3_second += game["turnover3Second"]
    total_turnover_bad_pass += game["turnoverBadPass"]
    total_turnover_bad_pass_out_of_bounds += game["turnoverBadPassOutOfBounds"]
    total_turnover_kick_ball += game["turnoverKickBall"]
    total_turnover_lane_violation += game["turnoverLaneViolation"]
    total_turnover_lost_ball += game["turnoverLostBall"]
    total_turnover_lost_ball_out_of_bounds += game["turnoverLostBallOutOfBounds"]
    total_turnover_off_goaltend += game["turnoverOffGoaltend"]
    total_turnover_shot_clock += game["turnoverShotClock"]
    total_turnover_step_out_of_bounds += game["turnoverStepOutOfBounds"]
    total_turnover_travel += game["turnoverTravel"]

    total_violation_possession += game["violationDefKickBall"] + \
        game["violationDefGoaltend"]

    total_violation_def_kick_ball += game["violationDefKickBall"]
    total_violation_def_goaltend += game["violationDefGoaltend"]


general_probabilities = {
    "ASSIST": total_assist / total_fg_made,
    "BLOCK": total_block / total_fg,
    "DEF_REB": total_reb_def / total_reb,
    "DEF_REB_TEAM": total_def_team_reb / total_reb,
    "FG_SHOOTING_FOUL": total_foul_shooting / total_fg_including_shooting_foul_missed,
    "OFF_FOUL_CHARGE": total_off_foul_charge / total_off_foul,
    "OFF_FOUL_OTHER": total_off_foul_other / total_off_foul,
    "OFF_REB": total_reb_off / total_reb,
    "OFF_REB_TEAM": total_off_team_reb / total_reb,
    "3_SECOND": total_turnover_3_second / total_turnover,
    "BAD_PASS": total_turnover_bad_pass / total_turnover,
    "BAD_PASS_OUT_OF_BOUNDS": total_turnover_bad_pass_out_of_bounds / total_turnover,
    "KICK_BALL": total_turnover_kick_ball / total_turnover,
    "LANE_VIOLATION": total_turnover_lane_violation / total_turnover,
    "LOST_BALL": total_turnover_lost_ball / total_turnover,
    "LOST_BALL_OUT_OF_BOUNDS": total_turnover_lost_ball_out_of_bounds / total_turnover,
    "OFF_GOALTEND": total_turnover_off_goaltend / total_turnover,
    "SHOT_CLOCK": total_turnover_shot_clock / total_turnover,
    "STEP_OUT_OF_BOUNDS": total_turnover_step_out_of_bounds / total_turnover,
    "TRAVEL": total_turnover_travel / total_turnover,
    "VIOLATION_DEF_GOALTEND": total_violation_def_goaltend / total_violation_possession,
    "VIOLATION_DEF_KICK_BALL": total_violation_def_kick_ball / total_violation_possession,
}


with open('../server/src/data/probabilities/general.json', 'w') as outfile:
    json.dump(general_probabilities, outfile)


fg_x_y_probabilities = {
    "Arc3": {},
    "AtRim": {},
    "Corner3": {},
    "LongMidRange": {},
    "ShortMidRange": {}
}

for shot_type in master_x_y_dict.keys():
    for x_y in master_x_y_dict[shot_type]:
        if shot_type == "Arc3":
            fg_x_y_probabilities["Arc3"][x_y] = master_x_y_dict[shot_type][x_y] / total_arc3
        elif shot_type == "AtRim":
            fg_x_y_probabilities["AtRim"][x_y] = master_x_y_dict[shot_type][x_y] / total_at_rim
        elif shot_type == "Corner3":
            fg_x_y_probabilities["Corner3"][x_y] = master_x_y_dict[shot_type][x_y] / total_corner3
        elif shot_type == "LongMidRange":
            fg_x_y_probabilities["LongMidRange"][x_y] = master_x_y_dict[shot_type][x_y] / \
                total_long_mid_range
        elif shot_type == "ShortMidRange":
            fg_x_y_probabilities["ShortMidRange"][x_y] = master_x_y_dict[shot_type][x_y] / \
                total_short_mid_range
        else:
            raise("Don't know what this is")

with open('../server/src/data/probabilities/fgXY.json', 'w') as outfile:
    json.dump(fg_x_y_probabilities, outfile)


possession_outcome_probabilities = {
    "FIELD_GOAL": possession_outcome_field_goal / possession_outcome_total,
    "FOUL_DEFENSIVE_NON_SHOOTING": possession_outcome_foul_defensive_non_shooting / possession_outcome_total,
    "JUMP_BALL": possession_outcome_jump_ball / possession_outcome_total,
    "OFFENSIVE_FOUL": possession_outcome_offensive_foul / possession_outcome_total,
    "TURNOVER": possession_outcome_turnover / possession_outcome_total,
    "VIOLATION_DEF_GOALTEND": possession_outcome_violation_def_goaltend / possession_outcome_total,
    "VIOLATION_DEF_KICK_BALL": possession_outcome_violation_def_kick_ball / possession_outcome_total
}

with open('../server/src/data/probabilities/possessionOutcomes.json', 'w') as outfile:
    json.dump(possession_outcome_probabilities, outfile)


for player_id in master_player_dict.keys():
    player_stats = master_player_dict[player_id]

    player_probabilities = {
        "assist": player_stats["assist"] / player_stats["assistChance"] if player_stats["assistChance"] != 0 else 0.0,
        "block": player_stats["defBlock"] / player_stats["defBlockChance"] if player_stats["defBlockChance"] != 0 else 0.0,
        "fgArc3Attempt": player_stats["fgArc3Attempt"] / player_stats["fgArc3Chance"] if player_stats["fgArc3Chance"] != 0 else 0.0,
        "fgArc3Block": player_stats["fgArc3Block"] / player_stats["fgArc3Chance"] if player_stats["fgArc3Chance"] != 0 else 0.0,
        "fgArc3Made": player_stats["fgArc3Made"] / player_stats["fgArc3Attempt"] if player_stats["fgArc3Attempt"] != 0 else 0.0,
        "fgArc3MadeFoul": player_stats["fgArc3MadeFoul"] / player_stats["fgArc3Chance"] if player_stats["fgArc3Chance"] != 0 else 0.0,
        "fgAtRimAttempt": player_stats["fgAtRimAttempt"] / player_stats["fgAtRimChance"] if player_stats["fgAtRimChance"] != 0 else 0.0,
        "fgAtRimBlock": player_stats["fgAtRimBlock"] / player_stats["fgAtRimChance"] if player_stats["fgAtRimChance"] != 0 else 0.0,
        "fgAtRimMade": player_stats["fgAtRimMade"] / player_stats["fgAtRimAttempt"] if player_stats["fgAtRimAttempt"] != 0 else 0.0,
        "fgAtRimMadeFoul": player_stats["fgAtRimMadeFoul"] / player_stats["fgAtRimChance"] if player_stats["fgAtRimChance"] != 0 else 0.0,
        "fgCorner3Attempt": player_stats["fgCorner3Attempt"] / player_stats["fgCorner3Chance"] if player_stats["fgCorner3Chance"] != 0 else 0.0,
        "fgCorner3Block": player_stats["fgCorner3Block"] / player_stats["fgCorner3Chance"] if player_stats["fgCorner3Chance"] != 0 else 0.0,
        "fgCorner3Made": player_stats["fgCorner3Made"] / player_stats["fgCorner3Attempt"] if player_stats["fgCorner3Attempt"] != 0 else 0.0,
        "fgCorner3MadeFoul": player_stats["fgCorner3MadeFoul"] / player_stats["fgCorner3Chance"] if player_stats["fgCorner3Chance"] != 0 else 0.0,
        "fgLongMidRangeAttempt": player_stats["fgLongMidRangeAttempt"] / player_stats["fgLongMidRangeChance"] if player_stats["fgLongMidRangeChance"] != 0 else 0.0,
        "fgLongMidRangeBlock": player_stats["fgLongMidRangeBlock"] / player_stats["fgLongMidRangeChance"] if player_stats["fgLongMidRangeChance"] != 0 else 0.0,
        "fgLongMidRangeMade": player_stats["fgLongMidRangeMade"] / player_stats["fgLongMidRangeAttempt"] if player_stats["fgLongMidRangeAttempt"] != 0 else 0.0,
        "fgLongMidRangeMadeFoul": player_stats["fgLongMidRangeMadeFoul"] / player_stats["fgLongMidRangeChance"] if player_stats["fgLongMidRangeChance"] != 0 else 0.0,
        "fgShortMidRangeAttempt": player_stats["fgShortMidRangeAttempt"] / player_stats["fgShortMidRangeChance"] if player_stats["fgShortMidRangeChance"] != 0 else 0.0,
        "fgShortMidRangeBlock": player_stats["fgShortMidRangeBlock"] / player_stats["fgShortMidRangeChance"] if player_stats["fgShortMidRangeChance"] != 0 else 0.0,
        "fgShortMidRangeMade": player_stats["fgShortMidRangeMade"] / player_stats["fgShortMidRangeAttempt"] if player_stats["fgShortMidRangeAttempt"] != 0 else 0.0,
        "fgShortMidRangeMadeFoul": player_stats["fgShortMidRangeMadeFoul"] / player_stats["fgShortMidRangeChance"] if player_stats["fgShortMidRangeChance"] != 0 else 0.0,
        "fgXY": {
            "Arc3": {},
            "AtRim": {},
            "Corner3": {},
            "LongMidRange": {},
            "ShortMidRange": {}
        },
        "freeThrow": player_stats["ftMade"] / player_stats["ftAttempt"] if player_stats["ftAttempt"] != 0 else 0.0,
        "rebDef": player_stats["rebDef"] / player_stats["rebDefChance"] if player_stats["rebDefChance"] != 0 else 0.0,
        "rebOff": player_stats["rebOff"] / player_stats["rebOffChance"] if player_stats["rebOffChance"] != 0 else 0.0,
        "steal": player_stats["defSteal"] / player_stats["defStealChance"] if player_stats["defStealChance"] != 0 else 0.0,
        "shotTypeArc3": player_stats["fgArc3Chance"] / player_stats["fgTotalChance"] if player_stats["fgArc3Chance"] != 0 else 0.0,
        "shotTypeArc3Def": player_stats["fgArc3DefChance"] / player_stats["fgTotalDefChance"] if player_stats["fgArc3DefChance"] != 0 else 0.0,
        "shotTypeAtRim": player_stats["fgAtRimChance"] / player_stats["fgTotalChance"] if player_stats["fgAtRimChance"] != 0 else 0.0,
        "shotTypeAtRimDef": player_stats["fgAtRimDefChance"] / player_stats["fgTotalDefChance"] if player_stats["fgAtRimDefChance"] != 0 else 0.0,
        "shotTypeCorner3": player_stats["fgCorner3Chance"] / player_stats["fgTotalChance"] if player_stats["fgCorner3Chance"] != 0 else 0.0,
        "shotTypeCorner3Def": player_stats["fgCorner3DefChance"] / player_stats["fgTotalDefChance"] if player_stats["fgCorner3DefChance"] != 0 else 0.0,
        "shotTypeLongMidRange": player_stats["fgLongMidRangeChance"] / player_stats["fgTotalChance"] if player_stats["fgLongMidRangeChance"] != 0 else 0.0,
        "shotTypeLongMidRangeDef": player_stats["fgLongMidRangeDefChance"] / player_stats["fgTotalDefChance"] if player_stats["fgLongMidRangeDefChance"] != 0 else 0.0,
        "shotTypeShortMidRange": player_stats["fgShortMidRangeChance"] / player_stats["fgTotalChance"] if player_stats["fgShortMidRangeChance"] != 0 else 0.0,
        "shotTypeShortMidRangeDef": player_stats["fgShortMidRangeDefChance"] / player_stats["fgTotalDefChance"] if player_stats["fgShortMidRangeDefChance"] != 0 else 0.0,
        "turnover": player_stats["turnover"] / player_stats["turnoverChance"] if player_stats["turnoverChance"] != 0 else 0.0,
        "violationDefGoaltend": player_stats["violationDefGoaltend"] / player_stats["violationDefGoaltendChance"] if player_stats["violationDefGoaltendChance"] != 0 else 0.0,
        "violationDefKickBall": player_stats["violationDefKickBall"] / player_stats["violationDefKickBallChance"] if player_stats["violationDefKickBallChance"] != 0 else 0.0,
        "totals": {
            **player_stats
        }
    }

    for shot_type in player_stats["fgXY"].keys():
        for x_y in player_stats["fgXY"][shot_type]:
            if shot_type == "Arc3":
                player_probabilities["fgXY"]["Arc3"][x_y] = player_stats["fgXY"][shot_type][x_y] / \
                    player_stats["fgArc3Attempt"]
            elif shot_type == "AtRim":
                player_probabilities["fgXY"]["AtRim"][x_y] = player_stats["fgXY"][shot_type][x_y] / \
                    player_stats["fgAtRimAttempt"]
            elif shot_type == "Corner3":
                player_probabilities["fgXY"]["Corner3"][x_y] = player_stats["fgXY"][shot_type][x_y] / \
                    player_stats["fgCorner3Attempt"]
            elif shot_type == "LongMidRange":
                player_probabilities["fgXY"]["LongMidRange"][x_y] = player_stats["fgXY"][shot_type][x_y] / \
                    player_stats["fgLongMidRangeAttempt"]
            elif shot_type == "ShortMidRange":
                player_probabilities["fgXY"]["ShortMidRange"][x_y] = player_stats["fgXY"][shot_type][x_y] / \
                    player_stats["fgShortMidRangeAttempt"]
            else:
                raise("Don't know what this is")

    with open(f'../server/src/data/probabilities-player/{player_id}.json', 'w') as outfile:
        json.dump(player_probabilities, outfile)


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
