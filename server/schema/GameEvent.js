cube(`GameEvent`, {
  sql: `SELECT * FROM public."GameEvent"`,

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
  },

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [id],
    },
  },

  dimensions: {
    defPlayersOnCourt: {
      sql: `def_players_on_court`,
      type: `string`,
    },

    isBonus: {
      sql: `is_bonus`,
      type: `boolean`,
    },

    isCharge: {
      sql: `is_charge`,
      type: `boolean`,
    },

    isNeutralFloor: {
      sql: `is_neutral_floor`,
      type: `boolean`,
    },

    isPlayerFouledOut: {
      sql: `is_player_fouled_out`,
      type: `boolean`,
    },

    offPlayersOnCourt: {
      sql: `off_players_on_court`,
      type: `string`,
    },

    offTeam: {
      sql: "off_team",
      type: "number",
      format: "id",
    },

    gameEvent: {
      sql: `game_event`,
      type: `string`,
    },

    gameType: {
      sql: `game_type`,
      type: `string`,
    },

    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },

    shotType: {
      sql: `shot_type`,
      type: `string`,
    },

    turnoverType: {
      sql: `turnover_type`,
      type: `string`,
    },

    violationType: {
      sql: `violation_type`,
      type: `string`,
    },
  },

  dataSource: `default`,
});
