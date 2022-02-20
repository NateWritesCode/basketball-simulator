import pandas as pd

pbp_df = pd.DataFrame(pd.read_pickle("./output/pbp.pkl"))
fg_df = pd.DataFrame(pd.read_pickle("./output/fg.pkl"))
foul_df = pd.DataFrame(pd.read_pickle("./output/foul.pkl"))
ft_df = pd.DataFrame(pd.read_pickle("./output/ft.pkl"))
jump_ball_df = pd.DataFrame(pd.read_pickle("./output/jump_ball.pkl"))
rebound_df = pd.DataFrame(pd.read_pickle("./output/rebound.pkl"))
substitution_df = pd.DataFrame(pd.read_pickle("./output/substitution.pkl"))
turnover_df = pd.DataFrame(pd.read_pickle("./output/turnover.pkl"))
violation_df = pd.DataFrame(pd.read_pickle("./output/violation.pkl"))


one_game_df = violation_df[
    (violation_df["pbp_id"].str.contains("0022000567"))
]

one_game_df.to_json("../server/src/pbp/violation.json", orient="index")

# SHOT TYPE PROBABILITY AND X, Y LOCATION PROBABILITY
# Shot types ['LongMidRange' 'AtRim' 'ShortMidRange' 'Corner3' 'Arc3']
# shot_type_probs = fg_df.groupby(["shot_type"]).size().div(len(fg_df))

# arc_3 = fg_df[fg_df["shot_type"].str.contains("Arc3")]
# at_rim = fg_df[fg_df["shot_type"].str.contains("AtRim")]
# corner_3 = fg_df[fg_df["shot_type"].str.contains("Corner3")]
# long_mid_range = fg_df[fg_df["shot_type"].str.contains("LongMidRange")]
# short_mid_range = fg_df[fg_df["shot_type"].str.contains("ShortMidRange")]


# arc_3_x = arc_3.groupby(["x"]).size().div(len(arc_3))
# arc_3_y = arc_3.groupby(["y"]).size().div(len(arc_3))
# at_rim_x = at_rim.groupby(["x"]).size().div(len(at_rim))
# at_rim_y = at_rim.groupby(["y"]).size().div(len(at_rim))
# corner_3_x = corner_3.groupby(["x"]).size().div(len(corner_3))
# corner_3_y = corner_3.groupby(["y"]).size().div(len(corner_3))
# long_mid_range_x = long_mid_range.groupby(
#     ["x"]).size().div(len(long_mid_range))
# long_mid_range_y = long_mid_range.groupby(
#     ["y"]).size().div(len(long_mid_range))
# short_mid_range_x = short_mid_range.groupby(
#     ["x"]).size().div(len(short_mid_range))
# short_mid_range_y = short_mid_range.groupby(
#     ["y"]).size().div(len(short_mid_range))

# shot_type_probs.to_json("../server/src/data/probabilities/shotType.json")
# arc_3_x.to_json("../server/src/data/probabilities/arc3X.json")
# arc_3_y.to_json("../server/src/data/probabilities/arc3Y.json")
# at_rim_x.to_json("../server/src/data/probabilities/atRimX.json")
# at_rim_y.to_json("../server/src/data/probabilities/atRimY.json")
# corner_3_x.to_json("../server/src/data/probabilities/corner3X.json")
# corner_3_y.to_json("../server/src/data/probabilities/corner3Y.json")
# long_mid_range_x.to_json("../server/src/data/probabilities/longMidRangeX.json")
# long_mid_range_y.to_json("../server/src/data/probabilities/longMidRangeY.json")
# short_mid_range_x.to_json("../server/src/data/probabilities/shortMidRangeX.json")
# short_mid_range_y.to_json("../server/src/data/probabilities/shortMidRangeY.json")
