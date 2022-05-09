import { list, nonNull, objectType } from "nexus";
import { Player, Team } from "nexus-prisma";

export const GameObjectType = objectType({
  name: "Game",
  description: "Game description",
  definition(t) {
    t.int("id");
  },
});

export const SimResult = objectType({
  name: "SimResult",
  description: "Sim result",
  definition(t) {
    t.nonNull.list.field("playerStats", { type: list(SimResultPlayer) });
    t.nonNull.list.field("teams", { type: TeamObjectType });
    t.nonNull.list.field("teamStats", { type: nonNull(SimResultTeam) });
  },
});

export const SimResultTeam = objectType({
  name: "SimResultTeam",
  description: "Sim result team",
  definition(t) {
    t.nonNull.int("andOne");
    t.nonNull.int("ast");
    t.nonNull.int("blk");
    t.nonNull.int("blkd");
    t.nonNull.int("drb");
    t.nonNull.int("dunks");
    t.nonNull.int("fga");
    t.nonNull.int("fgm");
    t.nonNull.int("fouls");
    t.nonNull.int("foulsOffensive");
    t.nonNull.int("foulsShooting");
    t.nonNull.int("fta");
    t.nonNull.int("ftm");
    t.nonNull.int("heaves");
    t.nonNull.int("id");
    t.nonNull.int("jumpBallsLost");
    t.nonNull.int("jumpBallsWon");
    t.nonNull.string("name");
    t.nonNull.int("offensiveFoul");
    t.nonNull.int("offensiveFoulCharge");
    t.nonNull.int("offensiveFoulOther");
    t.nonNull.int("orb");
    t.nonNull.int("pf");
    t.nonNull.int("pga");
    t.nonNull.int("pts");
    t.nonNull.int("stl");
    t.nonNull.int("teamDrb");
    t.nonNull.int("teamOrb");
    t.nonNull.int("timeouts");
    t.nonNull.int("tov");
    t.nonNull.int("tpa");
    t.nonNull.int("tpm");
  },
});

export const SimResultPlayer = objectType({
  name: "SimResultPlayer",
  description: "Sim result player",
  definition(t) {
    t.nonNull.int("andOne");
    t.nonNull.int("ast");
    t.nonNull.int("blk");
    t.nonNull.int("blkd");
    t.nonNull.int("drb");
    t.nonNull.int("dunks");
    t.nonNull.float("fatigue");
    t.nonNull.int("fga");
    t.nonNull.int("fgm");
    t.nonNull.int("fta");
    t.nonNull.int("ftm");
    t.nonNull.int("fouls");
    t.nonNull.int("foulsOffensive");
    t.nonNull.int("foulsShooting");
    t.nonNull.int("heaves");
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.int("inspiration");
    t.nonNull.int("jumpBallsLost");
    t.nonNull.int("jumpBallsWon");
    t.nonNull.int("offensiveFoul");
    t.nonNull.int("offensiveFoulCharge");
    t.nonNull.int("offensiveFoulOther");
    t.nonNull.int("orb");
    t.nonNull.int("pga");
    t.nonNull.int("plusMinus");
    t.nonNull.string("position");
    t.nonNull.int("pts");
    t.nonNull.int("secondsPlayed");
    t.nonNull.string("slug");
    t.nonNull.boolean("starter");
    t.nonNull.int("stl");
    t.nonNull.int("teamIndex");
    t.nonNull.int("teamId");
    t.nonNull.float("timePlayed");
    t.nonNull.int("tov");
    t.nonNull.int("tpa");
    t.nonNull.int("tpm");
  },
});

export const PlayerObjectType = objectType({
  name: Player.$name,
  description: Player.$description,
  definition(t) {
    t.field(Player.active.name, Player.active);
    t.field(Player.birthdate.name, Player.birthdate);
    t.field(Player.country.name, Player.country);
    t.field(Player.draftNumber.name, Player.draftNumber);
    t.field(Player.draftRound.name, Player.draftRound);
    t.field(Player.draftYear.name, Player.draftYear);
    t.field(Player.familyName.name, Player.familyName);
    t.field(Player.fromYear.name, Player.fromYear);
    t.field(Player.givenName.name, Player.givenName);
    t.field(Player.greatest75.name, Player.greatest75);
    t.field(Player.hasPlayedDLeague.name, Player.hasPlayedDLeague);
    t.field(Player.hasPlayedGames.name, Player.hasPlayedGames);
    t.field(Player.hasPlayedNba.name, Player.hasPlayedNba);
    t.field(Player.height.name, Player.height);
    t.field(Player.id.name, Player.id);
    t.field(Player.jerseyNumber.name, Player.jerseyNumber);
    t.field(Player.playerCode.name, Player.playerCode);
    t.field(Player.position.name, Player.position);
    t.field(Player.rebounding.name, Player.rebounding);
    t.field(Player.school.name, Player.school);
    t.field(Player.seasonsExperience.name, Player.seasonsExperience);
    t.field(Player.slug.name, Player.slug);
    t.field(Player.team.name, Player.team);
    t.field(Player.toYear.name, Player.toYear);
    t.field(Player.weight.name, Player.weight);
  },
});

export const StandingsObjectType = objectType({
  name: "Standings",
  description: "Standings description",
  definition(t) {
    t.field("l", { type: nonNull("Int") });
    t.nonNull.list.field("team", { type: nonNull(TeamObjectType) });
    t.field("w", { type: nonNull("Int") });
  },
});

export const ConferenceObjectType = objectType({
  name: "Conference",
  description: "",
  definition(t) {
    t.nonNull.string("abbrev");
    t.list.field("divisions", { type: nonNull(DivisionObjectType) });
    t.nonNull.id("id");
    t.field("league", { type: nonNull(LeagueObjectType) });
    t.nonNull.string("name");
  },
});
export const DivisionObjectType = objectType({
  name: "Division",
  description: "",
  definition(t) {
    t.nonNull.string("abbrev");
    t.field("conference", { type: ConferenceObjectType });
    t.nonNull.id("id");
    t.field("league", { type: nonNull(LeagueObjectType) });
    t.nonNull.string("name");
  },
});
export const LeagueObjectType = objectType({
  name: "League",
  description: "",
  definition(t) {
    t.nonNull.string("abbrev");
    t.list.field("conferences", { type: nonNull(ConferenceObjectType) });
    t.list.field("divisions", { type: nonNull(DivisionObjectType) });
    t.nonNull.id("id");
    t.nonNull.string("name");
  },
});

export const TeamObjectType = objectType({
  name: Team.$name,
  description: Team.$description,
  definition(t) {
    t.field(Team.abbrev.name, Team.abbrev);
    t.field(Team.facebook.name, Team.facebook);
    t.field(Team.homeName.name, Team.homeName);
    t.field(Team.id.name, Team.id);
    t.field(Team.instagram.name, Team.instagram);
    t.field(Team.nickname.name, Team.nickname);
    t.field(Team.players.name, Team.players);
    t.field(Team.twitter.name, Team.twitter);
    t.field(Team.venue.name, Team.venue);
    t.field(Team.venueCapacity.name, Team.venueCapacity);
    t.field(Team.yearFounded.name, Team.yearFounded);
  },
});
