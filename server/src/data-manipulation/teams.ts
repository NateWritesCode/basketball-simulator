import teamDetails from "../data/nba-api/teamdetails.json";
import fs from "fs";

export const startTeamDetailsParse = () => {
  //TODO: Handle 0 venue capacity
  const teams: any[] = [];
  teamDetails.forEach((teamDetails) => {
    const team: any = {};
    if (teamDetails.TeamBackground.length === 1) {
      const teamBackground = teamDetails.TeamBackground[0];
      team.abbrev = teamBackground.ABBREVIATION;
      team.homeName = teamBackground.CITY;
      team.id = teamBackground.TEAM_ID;
      team.nickname = teamBackground.NICKNAME;
      team.venue = teamBackground.ARENA;
      team.venueCapacity = Number(teamBackground.ARENACAPACITY);
      team.yearFounded = new Date(
        `${teamBackground.YEARFOUNDED}-01-01`
      ).toISOString();
    } else {
      throw new Error("Ut oh!!!");
    }

    // if (teamDetails.TeamHistory.length > 0) {
    //   team.history = teamDetails.TeamHistory.map((obj) => ({
    //     nbaId: obj.TEAM_ID,
    //     homeName: obj.CITY,
    //     nickname: obj.NICKNAME,
    //     yearFounded: new Date(`${obj.YEARFOUNDED}-01-01`).toISOString(),
    //     yearActiveUntil: new Date(`${obj.YEARACTIVETILL}-01-01`).toISOString(),
    //   }));
    // }

    if (teamDetails.TeamSocialSites.length > 0) {
      teamDetails.TeamSocialSites.forEach(({ ACCOUNTTYPE, WEBSITE_LINK }) => {
        if (ACCOUNTTYPE === "Facebook") {
          team.facebook = WEBSITE_LINK;
        } else if (ACCOUNTTYPE === "Instagram") {
          team.instagram = WEBSITE_LINK;
        } else if (ACCOUNTTYPE === "Twitter") {
          team.twitter = WEBSITE_LINK;
        } else {
          throw new Error("Ut oh!");
        }
      });
    }

    teams.push(team);
  });

  fs.writeFileSync("./src/data/teams.json", JSON.stringify(teams));
  console.log("Finished writing file");
};
