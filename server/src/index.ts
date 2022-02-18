// import bulls from "./data/bulls.json";
// import knicks from "./data/knicks.json";
// import teamsJson from "./data/teams.json";
// import { Team, GameSim, Player } from "./entities";
// import {
//   GameTotalTime,
//   GameTypeTimeSegments,
//   OvertimeLength,
//   ShotClockLength,
// } from "./types";

import startServer from "./startServer";

// const players = [...bulls, ...knicks].map((player) => new Player(player));
// const teams = teamsJson.map(
//   (team) =>
//     new Team({
//       ...team,
//       players: players.filter((player) => player.teamId === team.id),
//     })
// );

// const gameSim = new GameSim({
//   foulPenaltySettings: {
//     doublePenaltyThreshold: 10,
//     penaltyThreshold: 6,
//   },
//   gameType: {
//     overtimeOptions: {
//       overtimeLength: OvertimeLength.NBA,
//       type: "time",
//     },
//     segment: GameTypeTimeSegments.Quarter,
//     totalTime: GameTotalTime.NBA,
//     type: "time",
//   },
//   id: 1,
//   possessionTossupMethod: "jumpBall",
//   shotClock: ShotClockLength.NBA,
//   teams: [teams[0], teams[1]],
//   timeouts: 7,
// });

// gameSim.start();

(async () => {
  try {
    await startServer();
  } catch (e) {
    console.error(e);
  }
})();
