import players from "../data/players.json";
import teams from "../data/teams.json";
import Papa from "papaparse";
import fs from "fs";
import { csvDbClient } from "../csvDbClient";
import Scheduler from "../entities/Scheduler";

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
  // emptyFolders();
  // await addLeague();
  // await addConferences();
  // await addDivisions();
  // await createTeams();
  // await createPlayers();
  // await createSchedule();
};

const emptyFolders = () => {
  const foldersToEmpty = [
    // "conference",
    // "division",
    "game-events",
    "game-logs",
    // "league",
    "player-game",
    "player-game-group",
    // "schedule",
    "standings",
    "team-game",
    "team-game-group",
  ];
  foldersToEmpty.forEach((folderToEmpty) => {
    csvDbClient.deleteFilesInFolder(`./src/data/${folderToEmpty}`);
  });
};

const createSchedule = async () => {
  const conferences = await csvDbClient.getMany("conference", "conference");
  const divisions = await csvDbClient.getMany("division", "division");
  const teams = await csvDbClient.getMany("team", "team");
  const scheduler = new Scheduler(
    conferences as any,
    divisions as any,
    teams as any
  );

  scheduler.createNbaSchedule();

  await csvDbClient.add("1", "schedule", scheduler.schedule);
};

const createPlayers = async () => {
  const playersCsv = await Papa.unparse(players, { delimiter: "|" });
  fs.writeFileSync("./src/data/player/player.txt", playersCsv);
};

const createTeams = async () => {
  teams.map((team) => {
    getOrgIds(team);
  });

  const teamsCsv = await Papa.unparse(teams, { delimiter: "|" });
  fs.writeFileSync("./src/data/team/team.txt", teamsCsv);
};

const addLeague = async () => {
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
};

const addConferences = async () => {
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
};

const addDivisions = async () => {
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
};

function getOrgIds(team: any): void {
  const { abbrev } = team;

  switch (abbrev) {
    case "ATL": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = southeastDivisionId;

      break;
    }
    case "BKN": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = atlanticDivisionId;

      break;
    }
    case "BOS": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = atlanticDivisionId;

      break;
    }
    case "CHA": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = southeastDivisionId;

      break;
    }
    case "CHI": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = centralDivisionId;

      break;
    }
    case "CLE": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = centralDivisionId;

      break;
    }
    case "DAL": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = southwestDivisionId;

      break;
    }
    case "DEN": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = northwesternDivisonId;

      break;
    }
    case "DET": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = centralDivisionId;

      break;
    }
    case "GSW": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = pacificDivisionId;

      break;
    }
    case "HOU": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = southwestDivisionId;

      break;
    }
    case "IND": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = centralDivisionId;

      break;
    }
    case "LAC": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = pacificDivisionId;

      break;
    }
    case "LAL": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = pacificDivisionId;

      break;
    }
    case "MEM": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = southwestDivisionId;

      break;
    }
    case "MIA": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = southeastDivisionId;

      break;
    }
    case "MIL": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = centralDivisionId;

      break;
    }
    case "MIN": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = northwesternDivisonId;

      break;
    }
    case "NOP": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = southwestDivisionId;

      break;
    }
    case "NYK": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = atlanticDivisionId;

      break;
    }
    case "OKC": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = northwesternDivisonId;

      break;
    }
    case "ORL": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = southeastDivisionId;

      break;
    }
    case "PHI": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = atlanticDivisionId;

      break;
    }
    case "PHX": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = pacificDivisionId;

      break;
    }
    case "POR": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = northwesternDivisonId;

      break;
    }
    case "SAC": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = pacificDivisionId;

      break;
    }
    case "SAS": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = southwestDivisionId;

      break;
    }
    case "TOR": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = atlanticDivisionId;

      break;
    }
    case "UTA": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = westernConferenceId;
      team.divisionId = northwesternDivisonId;

      break;
    }
    case "WAS": {
      team.leagueId = nbaLeagueId;
      team.conferenceId = easternConferenceId;
      team.divisionId = atlanticDivisionId;

      break;
    }
    default:
      console.log("abbrev", abbrev);
      throw new Error("Team not included");
  }
}
