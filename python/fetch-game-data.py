from pbpstats.client import Client
import time

settings = {
    "Games": {"dir": "response_data", "source": "web", "data_provider": "stats_nba"},
}
client = Client(settings)
time.sleep(3)
season = client.Season("nba", "2020-21", "Regular Season")
time.sleep(3)
game_ids_with_errors = []


new_client_settings = {
    "dir": "response_data",
    "Boxscore": {"source": "web", "data_provider": "stats_nba"},
    "Possessions": {"source": "web", "data_provider": "stats_nba"},
}


for final_game in season.games.final_games:
    game = None
    print(final_game)
    print(final_game["game_id"])
    new_client = Client(new_client_settings)
    try:
        time.sleep(3)
        game = new_client.Game(final_game["game_id"])
        time.sleep(3)

    except Exception as e:
        print("We have an error with game id ", final_game["game_id"])
        print(type(e))
        game_ids_with_errors.append(f"{final_game['game_id']}")
        continue


file1 = open("game_id_errors.txt", "w")
for id in game_ids_with_errors:
    file1.write(f"{id} \n")
file1.close()  # to change file access modes

# Maybe use the retrying library to RETRY
