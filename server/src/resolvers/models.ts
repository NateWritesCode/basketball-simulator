import { objectType } from "nexus";
import { Player } from "nexus-prisma";

export const PlayerObjectType = objectType({
  name: Player.$name,
  description: Player.$description,
  definition(t) {
    t.field(Player.familyName.name, Player.familyName);
    t.field(Player.givenName.name, Player.givenName);
    t.field(Player.id.name, Player.id);
  },
});
