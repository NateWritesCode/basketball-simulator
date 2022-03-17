CREATE TABLE gameEvent (
    bonus BOOLEAN,
    defPlayer1 BIGINT,
    defPlayer2 BIGINT,
    defPlayersOnCourt ARRAY(BIGINT),
    defTeam BIGINT,
    gameEvent VARCHAR,
    gameId BIGINT,
    gameType VARCHAR,
    incomingPlayer BIGINT,
    isPlayerFouledOut BOOLEAN,
    isCharge BOOLEAN,
    isNeutralFloor BOOLEAN,
    offPlayer1 BIGINT,
    offPlayer2 BIGINT,
    offPlayersOnCourt ARRAY(BIGINT),
    offTeam BIGINT,  
    outgoingPlayer BIGINT,
    possessionLength DOUBLE,
    segment BIGINT,
    shotType VARCHAR,
    shotValue BIGINT,
    team0 BIGINT,
    team1 BIGINT,
    turnoverType VARCHAR,
    valueToAdd BIGINT,
    x BIGINT,
    y BIGINT
)
WITH (
    EXTERNAL_LOCATION = 'hdfs://namenode/test/',
    format = 'PARQUET'
);