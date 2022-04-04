from nba_api.stats.static import players
from nba_api.stats.endpoints import commonplayerinfo
import pandas as pd
import time

all_players = players.get_players()
# all_players = all_players[0:5]

players_df = pd.DataFrame()

num_of_players = len(all_players)
counter = 0
for player in all_players:
    counter += 1
    print("Processing player", counter, "of", num_of_players)
    # time.sleep(1)
    player_info = commonplayerinfo.CommonPlayerInfo(player_id=player["id"])
    player_df = player_info.common_player_info.get_data_frame()
    if players_df.empty:
        players_df = player_df
    else:
        players_df = pd.concat([players_df, player_df])


players_df.to_pickle("./output/players.pkl")
players_df.to_csv("./output/players.csv", index=False)
players_df.to_json("../server/src/data/players.json", index=False)
