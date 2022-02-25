import { objectType } from "nexus";
import { Player, Team } from "nexus-prisma";

export const GameObjectType = objectType({
  name: "Game",
  description: "Game description",
  definition(t) {
    t.int("id");
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
