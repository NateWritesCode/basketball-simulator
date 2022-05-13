SELECT
    offplayer1,
    COUNT(*) AS total
FROM 
    game_events
WHERE
    gameevent=? 
GROUP BY
    gameid,
    offplayer1
ORDER BY
    total DESC
