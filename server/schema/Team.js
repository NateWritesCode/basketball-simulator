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
      drillMembers: [id, homeName, nickname]
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    venue: {
      sql: `venue`,
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
    
    nickname: {
      sql: `nickname`,
      type: `string`
    },
    
    twitter: {
      sql: `twitter`,
      type: `string`
    },
    
    yearFounded: {
      sql: `year_founded`,
      type: `time`
    }
  },
  
  dataSource: `default`
});
