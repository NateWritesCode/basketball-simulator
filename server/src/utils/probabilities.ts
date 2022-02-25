import { randomWeightedChoice } from ".";
import {
  FgType,
  FgTypesCoded,
  GameEventPossessionOutcomes,
  ShotTypes,
  TurnoverTypes,
  ViolationTypes,
} from "../types";
import arc3X from "../data/probabilities/arc3X.json";
import arc3Y from "../data/probabilities/arc3Y.json";
import atRimX from "../data/probabilities/atRimX.json";
import atRimY from "../data/probabilities/atRimY.json";
import corner3X from "../data/probabilities/corner3X.json";
import corner3Y from "../data/probabilities/corner3Y.json";
import fgProbability from "../data/probabilities/fg.json";
import longMidRangeX from "../data/probabilities/longMidRangeX.json";
import longMidRangeY from "../data/probabilities/longMidRangeY.json";
import possessionOutcomesProbability from "../data/probabilities/possessionOutcomes.json";
import shortMidRangeX from "../data/probabilities/shortMidRangeX.json";
import shortMidRangeY from "../data/probabilities/shortMidRangeY.json";
import shotTypeProbability from "../data/probabilities/shotType.json";
import turnoverProbability from "../data/probabilities/turnover.json";
import violationProbability from "../data/probabilities/violation.json";

const buildXYArray = (probObj: {
  [key: string]: number;
}): [number, number][] => {
  const returnArray: [number, number][] = [];
  const keys = Object.keys(probObj);

  keys.forEach((key) => {
    const pushArray: [number, number] = [Number(key), probObj[key]];
    returnArray.push(pushArray);
  });

  return returnArray;
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

export const get2PointShotType = (): ShotTypes => {
  return randomWeightedChoice([
    ["AT_RIM", getShotTypeProbability("AT_RIM")],
    ["SHORT_MID_RANGE", getShotTypeProbability("SHORT_MID_RANGE")],
    ["LONG_MID_RANGE", getShotTypeProbability("LONG_MID_RANGE")],
  ]) as ShotTypes;
};

export const get3PointShotType = (): ShotTypes => {
  return randomWeightedChoice([
    ["ARC_3", getShotTypeProbability("ARC_3")],
    ["CORNER_3", getShotTypeProbability("CORNER_3")],
  ]) as ShotTypes;
};

const parseFgTypeString = (str: string): FgType => {
  const bools = str.substring(str.length - 5);
  const shotType = str.substring(0, str.length - 5) as ShotTypes;

  const isAnd1 = bools[0] === "1";
  const isAssist = bools[1] === "1";
  const isBlock = bools[2] === "1";
  const isMade = bools[3] === "1";
  const isPutback = bools[4] === "1";

  return {
    isAnd1,
    isAssist,
    isBlock,
    isMade,
    isPutback,
    shotType,
  };
};

export const getFgType = (): FgType => {
  const choice = randomWeightedChoice(
    FgTypesCoded.options.map((fgType) => {
      return [fgType, fgProbability[fgType]];
    })
  );

  return parseFgTypeString(choice);
};

export const getPossessionOutcome = (): GameEventPossessionOutcomes => {
  return randomWeightedChoice(
    GameEventPossessionOutcomes.options.map((possessionOutcome) => {
      return [
        possessionOutcome,
        possessionOutcomesProbability[possessionOutcome],
      ];
    })
  );
};

const getShotTypeProbability = (shotType: ShotTypes): number => {
  const keyConverter: { [key in ShotTypes]: string } = {
    ARC_3: "Arc3",
    AT_RIM: "AtRim",
    CORNER_3: "Corner3",
    LONG_MID_RANGE: "LongMidRange",
    SHORT_MID_RANGE: "ShortMidRange",
  };

  const key = keyConverter[shotType];

  return shotTypeProbability[
    key as "Arc3" | "AtRim" | "Corner3" | "LongMidRange" | "ShortMidRange"
  ];
};

const getShotTypeProbabilityTotal = (shotTypes: ShotTypes[]): number => {
  let total = 0;

  shotTypes.forEach((shotType) => {
    total += getShotTypeProbability(shotType);
  });

  return total;
};

export const getShotXByShotType = (shotType: ShotTypes): number => {
  switch (shotType) {
    case "ARC_3": {
      return randomWeightedChoice(buildXYArray(arc3X));
    }
    case "AT_RIM": {
      return randomWeightedChoice(buildXYArray(atRimX));
    }
    case "CORNER_3": {
      return randomWeightedChoice(buildXYArray(corner3X));
    }
    case "LONG_MID_RANGE": {
      return randomWeightedChoice(buildXYArray(longMidRangeX));
    }
    case "SHORT_MID_RANGE": {
      return randomWeightedChoice(buildXYArray(shortMidRangeX));
    }
    default:
      const exhaustiveCheck: never = shotType;
      throw new Error(exhaustiveCheck);
  }
};

export const getShotYByShotType = (shotType: ShotTypes): number => {
  switch (shotType) {
    case "ARC_3": {
      return randomWeightedChoice(buildXYArray(arc3Y));
    }
    case "AT_RIM": {
      return randomWeightedChoice(buildXYArray(atRimY));
    }
    case "CORNER_3": {
      return randomWeightedChoice(buildXYArray(corner3Y));
    }
    case "LONG_MID_RANGE": {
      return randomWeightedChoice(buildXYArray(longMidRangeY));
    }
    case "SHORT_MID_RANGE": {
      return randomWeightedChoice(buildXYArray(shortMidRangeY));
    }
    default:
      const exhaustiveCheck: never = shotType;
      throw new Error(exhaustiveCheck);
  }
};

export const getTurnoverType = (): TurnoverTypes => {
  return randomWeightedChoice(
    TurnoverTypes.options.map((turnoverType) => {
      return [turnoverType, turnoverProbability[turnoverType]];
    })
  );
};

export const getViolationType = (): ViolationTypes => {
  return randomWeightedChoice(
    ViolationTypes.options.map((violationType) => {
      return [violationType, violationProbability[violationType]];
    })
  );
};
