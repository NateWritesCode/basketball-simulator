import { PrismaClient } from "@prisma/client";
import teams from "../src/data/teams.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.team.createMany({
    data: teams,
  });

  await prisma.player.createMany({
    data: [
      {
        id: 1,
        givenName: "Zach",
        familyName: "Lavine",
        height: 77,
        jumping: 80,
        teamId: 1,
      },
      {
        id: 2,
        givenName: "Javonte",
        familyName: "Green",
        height: 77,
        jumping: 80,
        teamId: 1,
      },
      {
        id: 3,
        givenName: "DeMar",
        familyName: "DeRozan",
        height: 78,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 4,
        givenName: "Ayo",
        familyName: "Dosunmu",
        height: 76,
        jumping: 80,
        teamId: 1,
      },
      {
        id: 5,
        givenName: "Nikola",
        familyName: "Vucevic",
        height: 84,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 6,
        givenName: "Alex",
        familyName: "Caruso",
        height: 76,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 7,
        givenName: "Lonzo",
        familyName: "Ball",
        height: 78,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 8,
        givenName: "Coby",
        familyName: "White",
        height: 76,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 9,
        givenName: "Patrick",
        familyName: "Williams",
        height: 79,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 10,
        givenName: "Troy",
        familyName: "Brown Jr.",
        height: 78,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 11,
        givenName: "Tony",
        familyName: "Bradley",
        height: 82,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 12,
        givenName: "Malcolm",
        familyName: "Hill",
        height: 78,
        jumping: 75,
        teamId: 1,
      },
      {
        id: 13,
        givenName: "Kemba",
        familyName: "Walker",
        height: 72,
        jumping: 70,
        teamId: 2,
      },
      {
        id: 14,
        givenName: "Derrick",
        familyName: "Rose",
        height: 74,
        jumping: 75,
        teamId: 2,
      },
      {
        id: 15,
        givenName: "Immanuel",
        familyName: "Quickley",
        height: 75,
        jumping: 85,
        teamId: 2,
      },
      {
        id: 16,
        givenName: "Julius",
        familyName: "Randle",
        height: 80,
        jumping: 75,
        teamId: 2,
      },
      {
        id: 17,
        givenName: "Nerlens",
        familyName: "Noel",
        height: 83,
        jumping: 85,
        teamId: 2,
      },
      {
        id: 18,
        givenName: "RJ",
        familyName: "Barrett",
        height: 78,
        jumping: 75,
        teamId: 2,
      },
      {
        id: 19,
        givenName: "Taj",
        familyName: "Gibson",
        height: 81,
        jumping: 75,
        teamId: 2,
      },
      {
        id: 20,
        givenName: "Cam",
        familyName: "Reddish",
        height: 80,
        jumping: 75,
        teamId: 2,
      },
      {
        id: 21,
        givenName: "Obi",
        familyName: "Toppin",
        height: 81,
        jumping: 75,
        teamId: 2,
      },
      {
        id: 22,
        givenName: "Ryan",
        familyName: "Arcidiacono",
        height: 75,
        jumping: 75,
        teamId: 2,
      },
      {
        id: 23,
        givenName: "Alec",
        familyName: "Burks",
        height: 78,
        jumping: 75,
        teamId: 2,
      },
      {
        id: 24,
        givenName: "Luka",
        familyName: "Samanic",
        height: 82,
        jumping: 75,
        teamId: 2,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
