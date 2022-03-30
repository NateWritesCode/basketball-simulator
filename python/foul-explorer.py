import pandas as pd
from itertools import product

df = pd.read_pickle("./output/foul-explorer.pkl")
df = df.groupby(['counts_as_personal_foul', 'counts_towards_penalty',
                 'is_away_from_play_foul', 'is_charge', 'is_clear_path_foul',
                 'is_defensive_3_seconds', 'is_delay_of_game', 'is_double_foul',
                 'is_double_technical', 'is_flagrant', 'is_flagrant1', 'is_flagrant2',
                 'is_inbound_foul', 'is_loose_ball_foul', 'is_offensive_foul',
                 'is_personal_foul', 'is_personal_block_foul', 'is_personal_take_foul',
                 'is_shooting_foul', 'is_shooting_block_foul', 'is_technical']).size().reset_index(name="counts").sort_values("counts", ascending=False)
df.to_json("./output/foul-explorer-results.json", orient="index")
