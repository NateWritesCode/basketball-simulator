cube(`Player`, {
  sql: `SELECT * FROM public."Player"`,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },
  
  joins: {
    Team: {
      sql: `${CUBE}.team_id = ${Team}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, country, familyName, givenName, birthdate]
    },
    
    draftNumber: {
      sql: `draft_number`,
      type: `sum`
    },
    
    jerseyNumber: {
      sql: `jersey_number`,
      type: `sum`
    }
  },
  
  dimensions: {
    active: {
      sql: `active`,
      type: `string`
    },
    
    greatest75: {
      sql: `greatest_75`,
      type: `string`,
      title: `Greatest 75`
    },
    
    hasPlayedDLeague: {
      sql: `has_played_d_league`,
      type: `string`
    },
    
    hasPlayedGames: {
      sql: `has_played_games`,
      type: `string`
    },
    
    hasPlayedNba: {
      sql: `has_played_nba`,
      type: `string`
    },
    
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    country: {
      sql: `country`,
      type: `string`
    },
    
    familyName: {
      sql: `family_name`,
      type: `string`
    },
    
    givenName: {
      sql: `given_name`,
      type: `string`
    },
    
    playerCode: {
      sql: `player_code`,
      type: `string`
    },
    
    position: {
      sql: `position`,
      type: `string`
    },
    
    school: {
      sql: `school`,
      type: `string`
    },
    
    slug: {
      sql: `slug`,
      type: `string`
    },
    
    birthdate: {
      sql: `birthdate`,
      type: `time`
    },
    
    draftYear: {
      sql: `draft_year`,
      type: `time`
    },
    
    fromYear: {
      sql: `from_year`,
      type: `time`
    },
    
    toYear: {
      sql: `to_year`,
      type: `time`
    }
  },
  
  dataSource: `default`
});
