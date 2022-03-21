cube(`Team`, {
  sql: `SELECT * FROM public."Team"`,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, nickname, homeName]
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    nickname: {
      sql: `nickname`,
      type: `string`
    },
    
    abbrev: {
      sql: `abbrev`,
      type: `string`
    },
    
    facebook: {
      sql: `facebook`,
      type: `string`
    },
    
    homeName: {
      sql: `home_name`,
      type: `string`
    },
    
    instagram: {
      sql: `instagram`,
      type: `string`
    },
    
    twitter: {
      sql: `twitter`,
      type: `string`
    },
    
    venue: {
      sql: `venue`,
      type: `string`
    },
    
    yearFounded: {
      sql: `year_founded`,
      type: `time`
    }
  },
  
  dataSource: `default`
});
