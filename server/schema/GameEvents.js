// cube(`GameEvents`, {
//   sql: `SELECT * FROM default.game_events`,
//   measures: {
//     count: {
//       type: `count`,
//     },
//     isBonusCount: {
//       filters: [{ sql: `${CUBE}.bonus = true` }],
//       type: "count",
//     },
//     isChargeCount: {
//       filters: [{ sql: `${CUBE}.is_charge = true` }],
//       type: "count",
//     },
//     isNeutralFloorCount: {
//       filters: [{ sql: `${CUBE}.is_neutral_floor = true` }],
//       type: "count",
//     },
//     isPlayerFouledOutCount: {
//       filters: [{ sql: `${CUBE}.is_player_fouled_out = true` }],
//       type: "count",
//     },
//   },
//   segments: {
//     steals: {
//       sql: `${CUBE}.turnover_type = 'BAD_PASS' OR ${CUBE}.turnover_type = 'LOST_BALL'`,
//     },
//   },
//   dimensions: {
//     defPlayer1: {
//       sql: "def_player_1",
//       format: "id",
//       type: "number",
//     },
//     defPlayer2: {
//       sql: "def_player_1",
//       format: "id",
//       type: "number",
//     },
//     defTeam: {
//       sql: "def_team",
//       format: "id",
//       type: `number`,
//     },
//     gameEvent: {
//       sql: `game_event`,
//       type: `string`,
//     },
//     gameId: {
//       sql: `game_id`,
//       format: `id`,
//       type: "number",
//     },
//     gameType: {
//       sql: `game_type`,
//       type: `string`,
//     },
//     id: {
//       primaryKey: true,
//       sql: "id",
//       type: "string",
//     },
//     incomingPlayer: {
//       sql: `incoming_player`,
//       format: `id`,
//       type: "number",
//     },
//     isCharge: {
//       sql: "is_charge",
//       type: "boolean",
//     },
//     isNeutralFloor: {
//       sql: "is_neutral_floot",
//       type: "boolean",
//     },
//     isPlayerFouledOut: {
//       sql: "is_player_fouled_out",
//       type: "boolean",
//     },
//     offPlayer1: {
//       sql: "off_player_1",
//       format: "id",
//       type: "number",
//     },
//     offPlayer2: {
//       sql: "off_player_1",
//       format: "id",
//       type: "number",
//     },
//     offTeam: {
//       sql: "off_team",
//       format: `id`,
//       type: "number",
//     },
//     outgoingPlayer: {
//       sql: `outgoing_player`,
//       format: `id`,
//       type: "number",
//     },
//     possessionLength: {
//       sql: "possession_length",
//       type: "number",
//     },
//     shotType: {
//       sql: "shot_type",
//       type: "string",
//     },
//     shotValue: {
//       sql: "shot_value",
//       type: "number",
//     },
//     team0: {
//       sql: "team_0",
//       format: "id",
//       type: "number",
//     },
//     team1: {
//       sql: "team_1",
//       format: "id",
//       type: "number",
//     },
//     turnoverType: {
//       sql: "turnover_type",
//       type: "string",
//     },
//     valueToAdd: {
//       sql: "value_to_add",
//       type: "number",
//     },
//     violationType: {
//       sql: "violation_type",
//       type: "string",
//     },
//   },
//   dataSource: `analytics`,
// });

// defPlayer1: "def_player_1",
// defPlayer2: "def_player2",
// defPlayersOnCourt: "def_players_on_court",
// defTeam: "def_team",
// gameEvent: "game_event",
// gameId: "game_id",
// gameType: "game_type",
// incomingPlayer: "incoming_player",
// isCharge: "is_charge",
// isNeutralFloor: "is_neutral_floor",
// isPlayerFouledOut: "is_player_fouled_out",
// offPlayer1: "off_player_1",
// offPlayer2: "off_player2",
// offPlayersOnCourt: "off_players_on_court",
// offTeam: "off_team",
// outgoingPlayer: "outgoing_player",
// possessionLength: "possession_length",
// shotType: "shot_type",
// shotValue: "shot_value",
// team0: "team_0",
// team1: "team_1",
// turnoverType: "turnover_type",
// valueToAdd: "value_to_add",
// violationType: "violation_type",
