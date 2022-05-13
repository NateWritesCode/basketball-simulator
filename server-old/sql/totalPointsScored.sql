SELECT
    SUM(int0) 
FROM 
    "GameEvent"
WHERE 
    game_event=ANY('{2FG_MADE, 3FG_MADE, 2FG_MADE_FOUL, 3FG_MADE_FOUL}')
OR
    game_event='FREE_THROW' AND bool1=TRUE
;