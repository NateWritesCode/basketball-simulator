from sqlalchemy import *
from sqlalchemy.engine import create_engine
import pandas as pd

mock_hive_engine = create_engine('hive://localhost:10000')
mock_presto_engine = create_engine('presto://localhost:8080/hive')

mock_hive_engine.execute("DROP TABLE IF EXISTS game_events")

mock_hive_engine.execute("""
    CREATE EXTERNAL TABLE IF NOT EXISTS game_events(
      bonus boolean,
      defPlayer1 int,
      defPlayer2 int,
      defPlayersOnCourt array<int>,
      defTeam int,
      gameEvent string,
      gameId int,
      gameType string,
      incomingPlayer int,
      isPlayerFouledOut boolean,
      isCharge boolean,
      isNeutralFloor boolean,
      offPlayer1 int,
      offPlayer2 int,
      offPlayersOnCourt array<int>,
      offTeam int,
      outgoingPlayer int,
      possessionLength int,
      segment int,
      shotType string,
      shotValue int,
      team0 int,
      team1 int,
      turnoverType string,
      valueToAdd int,
      violationType string,
      x int,
      y int
    )
    ROW FORMAT DELIMITED 
    FIELDS TERMINATED BY '|'
    COLLECTION ITEMS TERMINATED BY ','
    STORED AS TEXTFILE 
    LOCATION 's3a://mothena/gameEvents'
    TBLPROPERTIES ('skip.header.line.count'='1')
    """
                         )
mock_hive_engine.execute("MSCK REPAIR TABLE game_events")
