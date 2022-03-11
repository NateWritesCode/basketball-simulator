import { randomWeightedChoice } from ".";
import {
  GameEventPossessionOutcomes,
  ShotTypes,
  TurnoverTypes,
  ViolationTypes,
} from "../types";
import general from "../data/probabilities/general.json";
import possessionLength from "../data/probabilities/possessionLength.json";
import possessionOutcomes from "../data/probabilities/possessionOutcomes.json";
import fgXY from "../data/probabilities/fgXY.json";
import Player from "../entities/Player";
import getAverage from "./getAverage";
import random from "random";

interface TypeSafeColDef<T extends object> extends Player {
  field: Extract<keyof T, number>;
}

export const get2or3Pointer = (shotType: ShotTypes): 2 | 3 => {
  switch (shotType) {
    case "Arc3":
    case "Corner3": {
      return 3;
    }
    case "AtRim":
    case "LongMidRange":
    case "ShortMidRange": {
      return 2;
    }
    default:
      const exhaustiveCheck: never = shotType;
      throw new Error(exhaustiveCheck);
  }
};

export const getShotType = ([offPlayersOnCourt, defPlayersOnCourt]: [
  Player[],
  Player[]
]): ShotTypes => {
  const shotTypes = ShotTypes.options;
  const probabilityArray: [ShotTypes, number][] = [];

  shotTypes.forEach((shotType: ShotTypes) => {
    const holder: number[] = [];

    offPlayersOnCourt.forEach((player) =>
      holder.push(player[`shotType${shotType}`])
    );
    defPlayersOnCourt.forEach((player) =>
      holder.push(player[`shotType${shotType}Def`])
    );

    probabilityArray.push([shotType, getAverage(holder)]);
  });

  return randomWeightedChoice(probabilityArray) as ShotTypes;
};

export const getFgXYByShotType = (shotType: ShotTypes): [number, number] => {
  const probabilityObj = fgXY[shotType];

  const choice = randomWeightedChoice(
    Object.keys(probabilityObj).map((key) => [
      key,
      probabilityObj[key as keyof typeof probabilityObj],
    ])
  );

  const choiceSplit = choice.split("|");

  return [Number(choiceSplit[0]), Number(choiceSplit[1])];
};

const getPlayerFromUnevenChoiceByField = (
  players: any,
  field: any //TODO: FIX THIS TO BE A TYPE OF ONLY PROPERTIES OF THE PLAYER CLASS
): Player => {
  const probabilityArray: [Player, number][] = [];
  let total = 0;

  players.forEach((player: any) => {
    total += player[field];
  });

  players.forEach((player: any) => {
    probabilityArray.push([player, player[field] / total]);
  });

  return randomWeightedChoice(probabilityArray);
};

export const getFgAttemptPlayer = (
  offPlayersOnCourt: Player[],
  shotType: ShotTypes
): Player => {
  return getPlayerFromUnevenChoiceByField(
    offPlayersOnCourt,
    `fg${shotType}Attempt`
  );
};

export const getFgIsMadeByPlayer = (
  player: Player,
  shotType: ShotTypes
): Boolean => {
  //lower probability goes to team 0, higher probablity goes to team 1

  let value = player[`fg${shotType}Made`];

  if (value === 1) {
    value = 0.99;
  }

  const isMade = random.bernoulli(value);

  return isMade() === 1;
};

export const getIsOffensiveRebound = (): Boolean => {
  const isOffensiveRebound = random.bernoulli(general["OFF_REB"]);

  return isOffensiveRebound() === 1;
};

export const getOffensiveReboundPlayer = (offPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(offPlayersOnCourt, `rebOff`);
};
export const getDefensiveReboundPlayer = (defPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(defPlayersOnCourt, `rebDef`);
};

export const getIsTeamRebound = (isOffensiveRebound: Boolean): Boolean => {
  const isTeamRebound = random.bernoulli(
    general[isOffensiveRebound ? "OFF_REB_TEAM" : "DEF_REB_TEAM"]
  );

  return isTeamRebound() === 1;
};

export const getFtIsMadeByPlayer = (player: Player) => {
  let value = player.freeThrow;

  if (value === 1) {
    value = 0.99;
  }

  const isMade = random.bernoulli(value);

  return isMade() === 1;
};

export const getPossessionLength = (
  possessionType:
    | "fg"
    | "foul"
    | "jumpBall"
    | "rebound"
    | "turnover"
    | "violation"
): number => {
  switch (possessionType) {
    case "fg": {
      const probabilityObj = possessionLength["fg"];

      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "foul": {
      const probabilityObj = possessionLength["foul"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "jumpBall": {
      const probabilityObj = possessionLength["jumpBall"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "rebound": {
      const probabilityObj = possessionLength["rebound"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "turnover": {
      const probabilityObj = possessionLength["turnover"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "violation": {
      const probabilityObj = possessionLength["violation"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    default:
      const exhaustiveCheck: never = possessionType;
      throw new Error(exhaustiveCheck);
  }
};

export const getIsAssist = (): Boolean => {
  const isAssist = random.bernoulli(general["ASSIST"]);

  return isAssist() === 1;
};

export const getAssistPlayer = (offPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(offPlayersOnCourt, `assist`);
};

export const getIsBlock = (): Boolean => {
  const isBlock = random.bernoulli(general["BLOCK"]);

  return isBlock() === 1;
};

export const getBlockPlayer = (defPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(defPlayersOnCourt, `block`);
};
export const getTurnoverPlayer = (offPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(offPlayersOnCourt, `turnover`);
};

export const getStealPlayer = (defPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(defPlayersOnCourt, `steal`);
};

export const getIsShootingFoul = () => {
  const isShootingFoul = random.bernoulli(general["FG_SHOOTING_FOUL"]);

  return isShootingFoul() === 1;
};

export const getPossessionOutcome = (): GameEventPossessionOutcomes => {
  return randomWeightedChoice(
    GameEventPossessionOutcomes.options.map((possessionOutcome) => {
      return [
        possessionOutcome,
        possessionOutcomes[
          possessionOutcome as keyof typeof possessionOutcomes
        ],
      ];
    })
  );
};

export const getTurnoverType = (): TurnoverTypes => {
  return randomWeightedChoice(
    TurnoverTypes.options.map((turnoverType) => {
      return [turnoverType, general[turnoverType as keyof typeof general]];
    })
  );
};

export const getViolationType = (): ViolationTypes => {
  return randomWeightedChoice(
    ViolationTypes.options.map((violationType) => {
      return [violationType, general[violationType as keyof typeof general]];
    })
  );
};

//average across all offensive players
//figure out shot type
//p1 ar 0.25 c3 0.35
//p2 ar 0.27 c3 0.37
//p3 ar 0.11 c3 0.31
//p4 ar 0.31 c3 0.31
//p5 ar 0.41 c3 0.31

//      0.27    0.33

//defense

//p1 ar 0.25 c3 0.35
//p2 ar 0.27 c3 0.37
//p3 ar 0.11 c3 0.31
//p4 ar 0.31 c3 0.31
//p5 ar 0.41 c3 0.31

//      0.21    0.39

//0.23  0.36 select shot type using these probabilities, could build in a weights here

//have my shot type
// pick a player
// sum the percent, then divide by the sum
// sum array of values and then divide by the sum
// otherwise rely on general data, if i have a large enough sample go player xy
// 40 observations

//is made on shot type player
