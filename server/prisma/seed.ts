import { PrismaClient } from "@prisma/client";
import players from "../src/data/players.json";
import teams from "../src/data/teams.json";
import csvtojson from "csvtojson";
import fs from "fs";
import { generateSchedule } from "../src/utils";

const prisma = new PrismaClient();
const nbaLeagueId = 1;
const easternConferenceId = 1;
const westernConferenceId = 2;
const atlanticDivisionId = 1;
const centralDivisionId = 2;
const southeastDivisionId = 3;
const northwesternDivisonId = 4;
const pacificDivisionId = 5;
const southwestDivisionId = 6;

async function main() {
  await prisma.league.create({
    data: {
      abbrev: "NBA",
      id: nbaLeagueId,
      date: new Date().toISOString(),
      name: "National Basketball Association",
    },
  });

  await prisma.conference.createMany({
    data: [
      {
        abbrev: "EAST",
        id: easternConferenceId,
        leagueId: nbaLeagueId,
        name: "Eastern",
      },
      {
        abbrev: "WEST",
        id: westernConferenceId,
        leagueId: nbaLeagueId,
        name: "Western",
      },
    ],
  });

  await prisma.division.createMany({
    data: [
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
    ],
  });

  await prisma.team.createMany({
    data: teams.map((team: any) => {
      team.leagueId = teamIdsObj[team.id].leagueId;
      team.conferenceId = teamIdsObj[team.id].conferenceId;
      team.divisionId = teamIdsObj[team.id].divisionId;

      return team;
    }),
  });

  await prisma.player.createMany({
    data: players.map((player: any) => {
      player.leagueId = teamIdsObj[player.teamId].leagueId;
      player.conferenceId = teamIdsObj[player.teamId].conferenceId;
      player.divisionId = teamIdsObj[player.teamId].divisionId;
      return player;
    }),
  });

  const gameEventFiles = fs.readdirSync("./src/data/game-events");
  for (const [_, file] of gameEventFiles.entries()) {
    let gameEvents = await csvtojson({
      checkType: true,
      colParser: {
        defPlayersOnCourt: (item) => {
          return item.split(",").map((v) => Number(v));
        },
        offPlayersOnCourt: (item) => {
          return item.split(",").map((v) => Number(v));
        },
      },
      delimiter: "|",
      ignoreEmpty: true,
    }).fromFile(`./src/data/game-events/${file}`);

    gameEvents = gameEvents.map((gameEvent) => {
      if (gameEvent.player0) {
        gameEvent.player0Id = gameEvent.player0;
        delete gameEvent.player0;
      }
      if (gameEvent.player1) {
        gameEvent.player1Id = gameEvent.player1;
        delete gameEvent.player1;
      }
      if (gameEvent.player2) {
        gameEvent.player2Id = gameEvent.player2;
        delete gameEvent.player2;
      }
      if (gameEvent.defTeam) {
        gameEvent.defTeamId = gameEvent.defTeam;
        delete gameEvent.defTeam;
      }
      if (gameEvent.offTeam) {
        gameEvent.offTeamId = gameEvent.offTeam;
        delete gameEvent.offTeam;
      }
      if (gameEvent.homeTeam) {
        gameEvent.homeTeamId = gameEvent.homeTeam;
        delete gameEvent.homeTeam;
      }
      if (gameEvent.awayTeam) {
        gameEvent.awayTeamId = gameEvent.awayTeam;
        delete gameEvent.awayTeam;
      }
      if (gameEvent.team0) {
        gameEvent.team0Id = gameEvent.team0;
        delete gameEvent.team0;
      }
      if (gameEvent.team1) {
        gameEvent.team1Id = gameEvent.team1;
        delete gameEvent.team1;
      }

      delete gameEvent.defPlayersOnCourt;
      delete gameEvent.offPlayersOnCourt;

      return gameEvent;
    });

    await prisma.gameEvent.createMany({
      data: gameEvents,
    });

    //   // for (const [_, testItem] of test.entries()) {
    //   //   const { offPlayersOnCourt, defPlayersOnCourt, id } = testItem;

    //   //   await prisma.gameEvent.update({
    //   //     data: {
    //   //       offPlayersOnCourt: {
    //   //         connect: offPlayersOnCourt.map((id: number) => {
    //   //           return { id };
    //   //         }),
    //   //       },
    //   //       defPlayersOnCourt: {
    //   //         connect: defPlayersOnCourt.map((id: number) => {
    //   //           return { id };
    //   //         }),
    //   //       },
    //   //     },
    //   //     where: {
    //   //       id,
    //   //     },
    //   //   });
    //   // }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const teamIdsObj: any = {
  1610612737: {
    abbrev: "ATL",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: southeastDivisionId,
  },
  1610612751: {
    abbrev: "BKN",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: atlanticDivisionId,
  },
  1610612738: {
    abbrev: "BOS",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: atlanticDivisionId,
  },
  1610612766: {
    abbrev: "CHA",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: southeastDivisionId,
  },
  1610612741: {
    abbrev: "CHI",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: centralDivisionId,
  },
  1610612739: {
    abbrev: "CLE",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: centralDivisionId,
  },
  1610612742: {
    abbrev: "DAL",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: southwestDivisionId,
  },
  1610612743: {
    abbrev: "DEN",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: northwesternDivisonId,
  },
  1610612765: {
    abbrev: "DET",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: centralDivisionId,
  },
  1610612744: {
    abbrev: "GSW",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: pacificDivisionId,
  },
  1610612745: {
    abbrev: "HOU",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: southwestDivisionId,
  },
  1610612754: {
    abbrev: "IND",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: centralDivisionId,
  },
  1610612746: {
    abbrev: "LAC",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: pacificDivisionId,
  },
  1610612747: {
    abbrev: "LAL",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: pacificDivisionId,
  },
  1610612763: {
    abbrev: "MEM",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: southwestDivisionId,
  },
  1610612748: {
    abbrev: "MIA",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: southeastDivisionId,
  },
  1610612749: {
    abbrev: "MIL",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: centralDivisionId,
  },
  1610612750: {
    abbrev: "MIN",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: northwesternDivisonId,
  },
  1610612740: {
    abbrev: "NOP",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: southwestDivisionId,
  },
  1610612752: {
    abbrev: "NYK",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: atlanticDivisionId,
  },
  1610612760: {
    abbrev: "OKC",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: northwesternDivisonId,
  },
  1610612753: {
    abbrev: "ORL",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: southeastDivisionId,
  },
  1610612755: {
    abbrev: "PHI",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: atlanticDivisionId,
  },
  1610612756: {
    abbrev: "PHX",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: pacificDivisionId,
  },
  1610612757: {
    abbrev: "POR",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: northwesternDivisonId,
  },
  1610612758: {
    abbrev: "SAC",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: pacificDivisionId,
  },
  1610612759: {
    abbrev: "SAS",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: southwestDivisionId,
  },
  1610612761: {
    abbrev: "TOR",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: atlanticDivisionId,
  },
  1610612762: {
    abbrev: "UTA",
    leagueId: nbaLeagueId,
    conferenceId: westernConferenceId,
    divisionId: northwesternDivisonId,
  },
  1610612764: {
    abbrev: "WAS",
    leagueId: nbaLeagueId,
    conferenceId: easternConferenceId,
    divisionId: southeastDivisionId,
  },
};
