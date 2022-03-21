from sqlalchemy import *
from sqlalchemy.engine import create_engine
import pandas as pd

mock_hive_engine = create_engine('hive://localhost:10000')
mock_presto_engine = create_engine('presto://localhost:8080/hive')

mock_hive_engine.execute("DROP TABLE IF EXISTS game_events")

mock_hive_engine.execute("""
    CREATE EXTERNAL TABLE IF NOT EXISTS game_events(
      def_player_1 int,
      def_player_2 int,
      def_players_on_court array<int>,
      def_team int,
      game_event string,
      game_id int,
      game_type string,
      id string,
      incoming_player int,
      is_bonus boolean,
      is_charge boolean,
      is_neutral_floor boolean,
      is_player_fouled_out boolean,
      off_player_1 int,
      off_player_2 int,
      off_players_on_court array<int>,
      off_team int,
      outgoing_player int,
      possession_length int,
      segment int,
      shot_type string,
      shot_value int,
      team_0 int,
      team_1 int,
      turnover_type string,
      value_to_add int,
      violation_type string,
      x int,
      y int
    )
    ROW FORMAT DELIMITED 
    FIELDS TERMINATED BY '|'
    COLLECTION ITEMS TERMINATED BY ','
    STORED AS TEXTFILE 
    LOCATION 's3a://mothena/gameEvents'
    TBLPROPERTIES ('skip.header.line.count'='1', 'serialization.null.format'='')
    """
                         )
mock_hive_engine.execute("MSCK REPAIR TABLE game_events")
