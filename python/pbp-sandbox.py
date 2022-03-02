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
from os import listdir
import pandas as pd


season_settings = {
    "dir": "/response_data",
    "Games": {"source": "web", "data_provider": "stats_nba"}
}
season_client = Client(season_settings)
season = season_client.Season("nba", "2020-21", "Regular Season")

game_settings = {
    "dir": "response_data",
    "Boxscore": {"source": "file", "data_provider": "stats_nba"},
    "Possessions": {"source": "file", "data_provider": "stats_nba"},
}
game_client = Client(game_settings)

master_game_dict = {}

master_player_dict = {}


def players_on_court_update(players_on_court, dict, field, value):
    for player in players_on_court:
        dict[player][field] += value


def player_update(player, dict, field, value):
    dict[player][field] += value


def game_update(game, dict, field, value):
    dict[game][field] += value


for season_game in season.games.items[:1]:
    game_id = season_game.game_id
    print(game_id)
    game = None
    try:
        game = game_client.Game(game_id)
    except Exception as e:
        print("Game problem with gameID", game_id, e)
        continue

    team_0 = game.boxscore.team_items[0]["team_id"]  # think this is away team
    team_1 = game.boxscore.team_items[1]["team_id"]  # think this is home team

    master_game_dict[game_id] = {
        "ejection": 0,
        "jumpBall": 0,
        "possession": 0,
        "rebDefTeam": 0,
        "rebOffTeam": 0,
        "replay": 0,
        "substitution": 0,
        "timeout": 0
    }

    print("team_0", team_0)
    print("team_1", team_1)

    for item in game.boxscore.player_items:

        if item["player_id"] not in master_player_dict:
            master_player_dict[item["player_id"]] = {
                "defBlockChance": 0,
                "defBlock": 0,
                "fgArc3Attempt": 0,
                "fgArc3Chance": 0,
                "fgArc3Made": 0,
                "fgArc3MadeFoul": 0,
                "fgAtRimAttempt": 0,
                "fgAtRimChance": 0,
                "fgAtRimMade": 0,
                "fgAtRimMadeFoul": 0,
                "fgCorner3Attempt": 0,
                "fgCorner3Chance": 0,
                "fgCorner3Made": 0,
                "fgCorner3MadeFoul": 0,
                "fgLongMidRangeAttempt": 0,
                "fgLongMidRangeChance": 0,
                "fgLongMidRangeMade": 0,
                "fgLongMidRangeMadeFoul": 0,
                "fgShortMidRangeAttempt": 0,
                "fgShortMidRangeChance": 0,
                "fgShortMidRangeMade": 0,
                "fgShortMidRangeMadeFoul": 0,
                "fgTotalAttempt": 0,
                "fgTotalChance": 0,
                "fgTotalMade": 0,
                "fgTotalMadeFoul": 0,
                "fgTotalMissFoul2": 0,
                "fgTotalMissFoul3": 0,
                "ftAttempt": 0,
                "ftMade": 0,
                "rebDef": 0,
                "rebDefChance": 0,
                "rebOff": 0,
                "rebOffChance": 0,
            }

    for possession in game.possessions.items:
        for possession_event in possession.events:
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
                game_update(game_id, master_game_dict, "jumpBall", 1)
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

            if isinstance(possession_event, FreeThrow):
                player = possession_event.player1_id
                player_update(player, master_player_dict, "ftAttempt", 1)
                if possession_event.is_made:
                    player_update(player, master_player_dict, "ftMade", 1)
                if possession_event.foul_that_led_to_ft.shot_type == "2pt Shooting Foul":
                    player_update(player, master_player_dict,
                                  "fgTotalMissFoul2", 1)

                if possession_event.foul_that_led_to_ft.shot_type == "3pt Shooting Foul":
                    player_update(player, master_player_dict,
                                  "fgTotalMissFoul3", 1)

                continue

            if isinstance(possession_event, Rebound):
                if possession_event.is_real_rebound:
                    players_on_court_update(
                        offense_players, master_player_dict, "rebOffChance", 1)
                    players_on_court_update(
                        defense_players, master_player_dict, "rebDefChance", 1)
                    if hasattr(possession_event, 'player1_id') and possession_event.player1_id != 0:
                        player = possession_event.player1_id
                        if possession_event.oreb:
                            player_update(
                                player, master_player_dict, "rebOff", 1)
                        else:
                            player_update(
                                player, master_player_dict, "rebDef", 1)
                    else:
                        if possession_event.oreb:
                            game_update(game_id, master_game_dict,
                                        "rebOffTeam", 1)
                        else:
                            game_update(game_id, master_game_dict,
                                        "rebDefTeam", 1)

            if isinstance(possession_event, FieldGoal):
                players_on_court_update(
                    offense_players, master_player_dict, "fgTotalChance", 1)

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

                    shot_type_field_string = ""

                    if is_arc_3:
                        shot_type_field_string = "Arc3"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgArc3Chance", 1)
                    elif is_at_rim:
                        shot_type_field_string = "AtRim"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgAtRimChance", 1)
                    elif is_corner_3:
                        shot_type_field_string = "Corner3"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgCorner3Chance", 1)
                    elif is_long_mid_range:
                        shot_type_field_string = "LongMidRange"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgLongMidRangeChance", 1)
                    elif is_short_mid_range:
                        shot_type_field_string = "ShortMidRange"
                        players_on_court_update(
                            offense_players, master_player_dict, "fgShortMidRangeChance", 1)
                    else:
                        raise("Don't know what this is")

                    field_string = "fg" + shot_type_field_string

                    player_update(player, master_player_dict,
                                  field_string + "Attempt", 1)

                    player_update(player, master_player_dict,
                                  "fgTotalAttempt", 1)

                    if is_made:
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


# print(master_player_dict)
print(master_game_dict)
