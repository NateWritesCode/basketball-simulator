import nbaApiPlayers from "../data/nba-api/players.json";
import fs from "fs";

interface NbaApiPlayer {
  FIRST_NAME: string;
  LAST_NAME: string;
  DISPLAY_FIRST_LAST: string;
  DISPLAY_LAST_COMMA_FIRST: string;
  DISPLAY_FI_LAST: string;
  PLAYER_SLUG: string;
  BIRTHDATE: Date;
  SCHOOL: string;
  COUNTRY: string;
  LAST_AFFILIATION: string;
  HEIGHT: string;
  WEIGHT: string;
  SEASON_EXP: number;
  JERSEY: string;
  POSITION: string;
  ROSTERSTATUS: string;
  GAMES_PLAYED_CURRENT_SEASON_FLAG: string;
  TEAM_ID: number;
  TEAM_NAME: string;
  TEAM_ABBREVIATION: string;
  TEAM_CODE: string;
  TEAM_CITY: string;
  PLAYERCODE: string;
  FROM_YEAR: number;
  TO_YEAR: number;
  DLEAGUE_FLAG: string;
  NBA_FLAG: string;
  GAMES_PLAYED_FLAG: string;
  DRAFT_YEAR: string;
  DRAFT_ROUND: string;
  DRAFT_NUMBER: string;
  GREATEST_75_FLAG: string;
}

//Only add team if they are a current NBA team for now
const nbaTeamIds = [
  1610612737, 1610612738, 1610612739, 1610612740, 1610612741, 1610612742,
  1610612743, 1610612744, 1610612745, 1610612746, 1610612747, 1610612748,
  1610612749, 1610612750, 1610612751, 1610612752, 1610612753, 1610612754,
  1610612755, 1610612756, 1610612757, 1610612758, 1610612759, 1610612760,
  1610612761, 1610612762, 1610612763, 1610612764, 1610612765, 1610612766,
];

const convertFtToInches = (height: string): number | null => {
  if (!height) {
    return null;
  }

  const splitHeight = height.split("-");
  const feet = Number(splitHeight[0]);
  const inches = Number(splitHeight[1]);

  return 12 * feet + inches;
};

export const startPlayersParse = () => {
  const players: any[] = [];
  const playersObj: { [key: string]: NbaApiPlayer } = JSON.parse(
    JSON.stringify(nbaApiPlayers)
  );
  const playerIds = Object.keys(playersObj);

  playerIds.forEach((playerId) => {
    const player = playersObj[playerId];
    let active = false;

    if (player.ROSTERSTATUS === "Active") {
      active = true;
    }

    if (!active) return;

    const playerObj = {
      active,
      birthdate: player.BIRTHDATE
        ? new Date(player.BIRTHDATE).toISOString()
        : null,
      country: player.COUNTRY ? player.COUNTRY : null,
      draftNumber: player.DRAFT_NUMBER ? Number(player.DRAFT_NUMBER) : null,
      draftRound: player.DRAFT_ROUND ? Number(player.DRAFT_ROUND) : null,
      draftYear:
        player.DRAFT_YEAR && player.DRAFT_YEAR !== "Undrafted"
          ? new Date(`${player.DRAFT_YEAR}-01-01`).toISOString()
          : null,
      familyName: player.LAST_NAME,
      fromYear: player.FROM_YEAR
        ? new Date(`${player.FROM_YEAR}-01-01`).toISOString()
        : null,
      givenName: player.FIRST_NAME,
      greatest75: player.GREATEST_75_FLAG === "Y" ? true : false,
      hasPlayedDLeague: player.DLEAGUE_FLAG === "Y" ? true : false,
      hasPlayedGames: player.GAMES_PLAYED_FLAG === "Y" ? true : false,
      hasPlayedNba: player.NBA_FLAG === "Y" ? true : false,
      height: player.HEIGHT ? convertFtToInches(player.HEIGHT) : null,
      id: Number(playerId),
      jerseyNumber: player.JERSEY ? Number(player.JERSEY) : null,
      playerCode: player.PLAYERCODE ? player.PLAYERCODE : null,
      position: player.POSITION ? player.POSITION : null,
      school: player.SCHOOL ? player.SCHOOL : null,
      seasonsExperience: Number.isInteger(player.SEASON_EXP)
        ? player.SEASON_EXP
        : null,
      slug: player.PLAYER_SLUG ? player.PLAYER_SLUG : null,
      teamId:
        player.TEAM_ID && nbaTeamIds.includes(player.TEAM_ID)
          ? player.TEAM_ID
          : null,
      toYear: player.TO_YEAR
        ? new Date(`${player.TO_YEAR}-01-01`).toISOString()
        : null,
      weight: player.WEIGHT ? Number(player.WEIGHT) : null,
    };

    players.push(playerObj);
  });

  fs.writeFileSync("./src/data/players.json", JSON.stringify(players));
  console.log(`Finished writing players file!`);
};
