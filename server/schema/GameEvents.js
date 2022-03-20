cube(`GameEvents`, {
  sql: `SELECT * FROM default.game_events`,

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
  },

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [],
    },

    shotvalue: {
      sql: `shotvalue`,
      type: `sum`,
    },
  },

  dimensions: {
    bonus: {
      sql: `bonus`,
      type: `boolean`,
    },

    offplayer1: {
      sql: `offplayer1`,
      type: `number`,
    },

    gameevent: {
      sql: `gameevent`,
      type: `string`,
    },

    gametype: {
      sql: `gametype`,
      type: `string`,
    },

    isplayerfouledout: {
      sql: `isplayerfouledout`,
      type: `boolean`,
    },

    ischarge: {
      sql: `ischarge`,
      type: `boolean`,
    },

    isneutralfloor: {
      sql: `isneutralfloor`,
      type: `boolean`,
    },

    shottype: {
      sql: `shottype`,
      type: `string`,
    },

    turnovertype: {
      sql: `turnovertype`,
      type: `string`,
    },

    violationtype: {
      sql: `violationtype`,
      type: `string`,
    },
  },

  dataSource: `analytics`,
});
