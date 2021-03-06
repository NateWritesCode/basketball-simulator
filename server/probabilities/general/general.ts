import general from "./general.json";
import possessionLength from "./possessionLength.json";
import possessionOutcomes from "./possessionOutcomes.json";
import fgXY from "./fgXY.json";
import { Player } from "../../entities/Player";
import random from "random";
import lodash from "lodash";
import {
  ShotTypes,
  FoulTypesDefensiveNonShooting,
  GameEventPossessionOutcomes,
  TurnoverTypes,
  ViolationTypes,
} from "../../types/enums";
import { camelCaseAndCapitalize } from "../../utils/camelCaseAndCapitalize";
import { getAverage } from "../../utils/getAverage";
import { randomWeightedChoice } from "../../utils/randomWeightedChoice";
const { sample } = lodash;

export const convertShotType = (shotType: ShotTypes) => {
  switch (shotType) {
    case "ARC_3": {
      return "Arc3";
    }
    case "AT_RIM": {
      return "AtRim";
    }
    case "CORNER_3": {
      return "Corner3";
    }
    case "LONG_MID_RANGE": {
      return "LongMidRange";
    }
    case "SHORT_MID_RANGE": {
      return "ShortMidRange";
    }
    default:
      const exhaustiveCheck: never = shotType;
      throw new Error(exhaustiveCheck);
  }
};

export const get2or3Pointer = (shotType: ShotTypes): 2 | 3 => {
  switch (shotType) {
    case "ARC_3":
    case "CORNER_3": {
      return 3;
    }
    case "AT_RIM":
    case "LONG_MID_RANGE":
    case "SHORT_MID_RANGE": {
      return 2;
    }
    default:
      const exhaustiveCheck: never = shotType;
      throw new Error(exhaustiveCheck);
  }
};

export const getAssistPlayer = (offPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(offPlayersOnCourt, `assist`);
};

export const getBlockPlayer = (defPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(defPlayersOnCourt, `block`);
};

export const getDefensiveReboundPlayer = (defPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(defPlayersOnCourt, `rebDef`);
};

export const getFgAttemptPlayer = (
  offPlayersOnCourt: Player[],
  shotType: ShotTypes
): Player => {
  return getPlayerFromUnevenChoiceByField(
    offPlayersOnCourt,
    `fg${convertShotType(shotType)}Attempt`
  );
};

export const getFgIsMadeByPlayer = (
  player: Player,
  shotType: ShotTypes
): Boolean => {
  //lower probability goes to team 0, higher probablity goes to team 1

  let value = player[`fg${convertShotType(shotType)}Made`];

  if (value === 1) {
    value = 0.99;
  }

  const isMade = random.bernoulli(value);

  return isMade() === 1;
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

export const getFoulTypeDefensiveNonShooting =
  (): FoulTypesDefensiveNonShooting => {
    return randomWeightedChoice(
      FoulTypesDefensiveNonShooting.options.map((foulType) => {
        return [foulType, general[`FOUL_${foulType}`]];
      })
    );
  };

export const getFoulingPlayerDefensiveNonShooting = ({
  defPlayersOnCourt,
  foulType,
}: {
  defPlayersOnCourt: Player[];
  foulType: FoulTypesDefensiveNonShooting;
}) => {
  return getPlayerFromUnevenChoiceByField(
    defPlayersOnCourt,
    `foul${camelCaseAndCapitalize(foulType)}`
  );
};

export const getFouledPlayerDefensiveNonShooting = ({
  offPlayersOnCourt,
  foulType,
}: {
  offPlayersOnCourt: Player[];
  foulType: FoulTypesDefensiveNonShooting;
}) => {
  return getPlayerFromUnevenChoiceByField(
    offPlayersOnCourt,
    `fouled${camelCaseAndCapitalize(foulType)}`
  );
};

export const getFtIsMadeByPlayer = (player: Player) => {
  let value = player.freeThrow;

  if (value === 1) {
    value = 0.99;
  }

  const isMade = random.bernoulli(value);

  return isMade() === 1;
};

export const getIsAssist = (): boolean => {
  const isAssist = random.bernoulli(general["ASSIST"]);

  return isAssist() === 1;
};

export const getIsBlock = (): boolean => {
  const isBlock = random.bernoulli(general["BLOCK"]);

  return isBlock() === 1;
};

export const getIsCharge = (): boolean => {
  const isCharge = random.bernoulli(general["FOUL_OFF_CHARGE"]);

  return isCharge() === 1;
};

export const getIsDoubleTechnical = () => {
  const isDoubleTechnical = random.bernoulli(general["FOUL_TECHNICAL_DOUBLE"]);

  return isDoubleTechnical() === 1;
};

export const getIsOffensiveRebound = (): Boolean => {
  const isOffensiveRebound = random.bernoulli(general["REBOUND_OFFENSIVE"]);

  return isOffensiveRebound() === 1;
};

export const getIsShootingFoul = () => {
  const isShootingFoul = random.bernoulli(general["FG_SHOOTING_FOUL"]);

  return isShootingFoul() === 1;
};

export const getIsTechnical = () => {
  const isTechnical = random.bernoulli(
    general["FOUL_TECHNICAL_PER_POSSESSION_OUTCOME"]
  );

  return isTechnical() === 1;
};

export const getIsTeamRebound = (isOffensiveRebound: Boolean): Boolean => {
  const isTeamRebound = random.bernoulli(
    general[
      isOffensiveRebound ? "REBOUND_OFFENSIVE_TEAM" : "REBOUND_DEFENSIVE_TEAM"
    ]
  );

  return isTeamRebound() === 1;
};

export const getOffensiveFoulPlayer = ({
  isCharge,
  offPlayersOnCourt,
}: {
  isCharge: boolean;
  offPlayersOnCourt: Player[];
}): Player => {
  const field = isCharge ? "foulOffensiveCharge" : "foulOffensiveOther";
  return getPlayerFromUnevenChoiceByField(offPlayersOnCourt, field);
};

export const getOffensiveFouledPlayer = ({
  isCharge,
  defPlayersOnCourt,
}: {
  isCharge: boolean;
  defPlayersOnCourt: Player[];
}): Player => {
  const field = isCharge ? "fouledOffensiveCharge" : "fouledOffensiveOther";
  return getPlayerFromUnevenChoiceByField(defPlayersOnCourt, field);
};

export const getOffensiveReboundPlayer = (offPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(offPlayersOnCourt, `rebOff`);
};

const getPlayerFromUnevenChoiceByField = (
  players: any,
  field: any //TODO: FIX THIS TO BE A TYPE OF ONLY PROPERTIES OF THE PLAYER CLASS,
): Player => {
  const probabilityArray: [Player, number][] = [];
  let total = 0;

  players.forEach((player: any) => {
    total += player[field];
  });

  if (isNaN(total)) {
    throw new Error(
      `Problem getPlayerFromUnenvenChoiceByField field NAN ${field}`
    );
  }

  if (total === 0) {
    //means no players have a total so just get a random player
    return sample(players);
  }

  players.forEach((player: any) => {
    probabilityArray.push([player, player[field] / total]);
  });

  return randomWeightedChoice(probabilityArray);
};

export const getPossessionLength = (
  possessionType:
    | "FG"
    | "FOUL"
    | "JUMP_BALL"
    | "REBOUND"
    | "TURNOVER"
    | "VIOLATION"
): number => {
  switch (possessionType) {
    case "FG": {
      const probabilityObj = possessionLength["FG"];

      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "FOUL": {
      const probabilityObj = possessionLength["FOUL"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "JUMP_BALL": {
      const probabilityObj = possessionLength["JUMP_BALL"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "REBOUND": {
      const probabilityObj = possessionLength["REBOUND"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "TURNOVER": {
      const probabilityObj = possessionLength["TURNOVER"];
      const choice = randomWeightedChoice(
        Object.keys(probabilityObj).map((key) => [
          Number(key),
          probabilityObj[key as keyof typeof probabilityObj],
        ])
      );
      return Math.round((choice + Number.EPSILON) * 100) / 100;
    }
    case "VIOLATION": {
      const probabilityObj = possessionLength["VIOLATION"];
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

export const getShotType = ([offPlayersOnCourt, defPlayersOnCourt]: [
  Player[],
  Player[]
]): ShotTypes => {
  const shotTypes = ShotTypes.options;
  const probabilityArray: [ShotTypes, number][] = [];

  shotTypes.forEach((shotType: ShotTypes) => {
    const holder: number[] = [];

    offPlayersOnCourt.forEach((player) =>
      holder.push(player[`shotType${convertShotType(shotType)}`])
    );
    defPlayersOnCourt.forEach((player) =>
      holder.push(player[`shotType${convertShotType(shotType)}Def`])
    );

    probabilityArray.push([shotType, getAverage(holder)]);
  });

  return randomWeightedChoice(probabilityArray) as ShotTypes;
};

export const getStealPlayer = (defPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(defPlayersOnCourt, `steal`);
};

export const getTurnoverPlayer = (offPlayersOnCourt: Player[]) => {
  return getPlayerFromUnevenChoiceByField(offPlayersOnCourt, `turnover`);
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
