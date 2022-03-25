SELECT
    COUNT(*) as steals
    def_player_1_id,
    family_name,
    given_name
FROM 
    "GameEvent"
RIGHT JOIN 
    "Player"
ON
    "GameEvent".def_player_1_id = "Player".id
WHERE
    game_event='STEAL'
-- GROUP BY
--     def_player_1_id
-- ORDER BY
--     steals DESC
