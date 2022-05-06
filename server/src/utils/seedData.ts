import players from "../data/players.json";
import teams from "../data/teams.json";
import Papa from "papaparse";
import fs from "fs";
import { csvDbClient } from "../csvDbClient";

const nbaLeagueId = 1;
const easternConferenceId = 1;
const westernConferenceId = 2;
const atlanticDivisionId = 1;
const centralDivisionId = 2;
const southeastDivisionId = 3;
const northwesternDivisonId = 4;
const pacificDivisionId = 5;
const southwestDivisionId = 6;

export default async () => {
  const foldersToEmpty = [
    "conference",
    "division",
    "game-events",
    "game-logs",
    "league",
    "player-game",
    "player-game-group",
    "standings",
    "team-game",
    "team-game-group",
  ];
  foldersToEmpty.forEach((folderToEmpty) => {
    csvDbClient.deleteFilesInFolder(`./src/data/${folderToEmpty}`);
  });

  await csvDbClient.add("league", "league", {
    abbrev: "NBA",
    conferences: [easternConferenceId, westernConferenceId].toString(),
    divisions: [
      atlanticDivisionId,
      centralDivisionId,
      southeastDivisionId,
      northwesternDivisonId,
      pacificDivisionId,
      southwestDivisionId,
    ].toString(),
    id: nbaLeagueId,
    name: "National Basketball Association",
  });

  await csvDbClient.add("conference", "conference", [
    {
      abbrev: "EAST",
      divisions: [
        atlanticDivisionId,
        centralDivisionId,
        southeastDivisionId,
      ].toString(),
      leagueId: nbaLeagueId,
      id: easternConferenceId,
      name: "Eastern",
    },
    {
      abbrev: "WEST",
      divisions: [
        northwesternDivisonId,
        pacificDivisionId,
        southwestDivisionId,
      ].toString(),
      id: westernConferenceId,
      leagueId: nbaLeagueId,
      name: "Western",
    },
  ]);

  await csvDbClient.add("division", "division", [
    {
      abbrev: "ATL",
      conferenceId: easternConferenceId,
      id: atlanticDivisionId,
      leagueId: nbaLeagueId,
      name: "Atlantic",
    },
    {
      abbrev: "CTL",
      conferenceId: easternConferenceId,
      id: centralDivisionId,
      leagueId: nbaLeagueId,
      name: "Central",
    },
    {
      abbrev: "SE",
      conferenceId: easternConferenceId,
      id: southeastDivisionId,
      leagueId: nbaLeagueId,
      name: "Southeast",
    },
    {
      abbrev: "NW",
      conferenceId: westernConferenceId,
      id: northwesternDivisonId,
      leagueId: nbaLeagueId,
      name: "Northwest",
    },
    {
      abbrev: "PCF",
      conferenceId: westernConferenceId,
      id: pacificDivisionId,
      leagueId: nbaLeagueId,
      name: "Pacific",
    },
    {
      abbrev: "SW",
      conferenceId: westernConferenceId,
      id: southwestDivisionId,
      leagueId: nbaLeagueId,
      name: "Southwest",
    },
  ]);

  const test = await csvDbClient.getAllDataTest("league", "league");

  console.log(JSON.stringify(test, null, 4));

  // const playersCsv = await Papa.unparse(players, { delimiter: "|" });
  // const teamsCsv = await Papa.unparse(teams, { delimiter: "|" });
  // console.log("teamsCsv", teamsCsv.split("\n"));
  // fs.writeFileSync("./src/data/player/player.txt", playersCsv);
  // fs.writeFileSync("./src/data/teams.txt", teamsCsv);
};
