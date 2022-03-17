import pandas as pd
import numpy as np

# read file as pandas dataframe
df = pd.read_csv(
    "../server/src/data/game-event-store/1.txt",
    sep='|',
    dtype={
        "defPlayer1": "Int64",
        "defPlayer2": "Int64",
        "defTeam": "Int64",
        "defPlayersOnCourt": str,
        "gameId": "Int64",
        "incomingPlayer": "Int64",
        "offPlayer1": "Int64",
        "offPlayer2": "Int64",
        "offTeam": "Int64",
        "outgoingPlayer": "Int64",
        "offPlayersOnCourt": str,
        "segment": "Int64",
        "shotValue": "Int64",
        "valueToAdd": "Int64",
        "x": "Int64",
        "y": "Int64",
    })
df = df.fillna(pd.NA)


def makeArray(text):
    return np.fromstring(text, sep=',', dtype=int)


df['defPlayersOnCourt'] = df['defPlayersOnCourt'].apply(
    makeArray)
df['offPlayersOnCourt'] = df['offPlayersOnCourt'].apply(
    makeArray)

df["bonus"] = np.nan
df["bonus"] = df["bonus"].astype('boolean')
df["isCharge"] = np.nan
df["isCharge"] = df["isCharge"].astype('boolean')
df["isPlayerFouledOut"] = np.nan
df["isPlayerFouledOut"] = df["isPlayerFouledOut"].astype('boolean')
df["bonus"] = np.nan
df["bonus"] = df["bonus"].astype('boolean')


df.to_parquet("../presto/data/gameEvent.parquet")
