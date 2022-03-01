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
import traceback


def get_game_id(string):
    return string.split("_")[1].replace(".json", "")


# game_ids = list(map(get_game_id, listdir("./response_data/pbp")))
# game_ids = game_ids[1440:1441]
game_ids = ["0022000632", "0022000636"]


for game_id in game_ids:
    print(game_id)
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

    print(game)

    for possession in game.possessions.items:
        possession_stats = possession.possession_stats
        print(possession_stats)

    # for possession_event in possession.events:
    #     print(possession_event)
