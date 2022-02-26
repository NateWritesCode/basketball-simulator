import fgProbability from "../data/r/fgProbability.json";
import fgLengthProbability from "../data/r/fgLengthProbability.json";
import foulLengthProbability from "../data/r/foulLengthProbability.json";
import generalLengthProbability from "../data/r/foulLengthProbability.json";
import reboundLengthProbability from "../data/r/foulLengthProbability.json";
import turnoverLengthProbability from "../data/r/foulLengthProbability.json";
import violationLengthProbability from "../data/r/foulLengthProbability.json";
import fs from "fs";

export const parseFgProbability = () => {
  const fgType: any = {};

  fgProbability.forEach((obj) => {
    let stringHolder = obj.shot_type;

    if (obj.is_and1) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    if (obj.is_assisted) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    if (obj.is_blocked) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    if (obj.is_made) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    if (obj.is_putback) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    fgType[stringHolder] = obj.probability;
  });

  fs.writeFileSync("./src/data/probabilities/fg.json", JSON.stringify(fgType));
};

export const parsePossessionLengthProbability = () => {
  const fg = possessionLengthBuilder(fgLengthProbability);
  const foul = possessionLengthBuilder(foulLengthProbability);
  const general = possessionLengthBuilder(generalLengthProbability);
  const rebound = possessionLengthBuilder(reboundLengthProbability);
  const turnover = possessionLengthBuilder(turnoverLengthProbability);
  const violation = possessionLengthBuilder(violationLengthProbability);

  fs.writeFileSync(
    "./src/data/probabilities/fgLength.json",
    JSON.stringify(fg)
  );
  fs.writeFileSync(
    "./src/data/probabilities/foulLength.json",
    JSON.stringify(foul)
  );
  fs.writeFileSync(
    "./src/data/probabilities/generalLength.json",
    JSON.stringify(general)
  );
  fs.writeFileSync(
    "./src/data/probabilities/reboundLength.json",
    JSON.stringify(rebound)
  );
  fs.writeFileSync(
    "./src/data/probabilities/turnoverLength.json",
    JSON.stringify(turnover)
  );
  fs.writeFileSync(
    "./src/data/probabilities/violationLength.json",
    JSON.stringify(violation)
  );
};

const possessionLengthBuilder = (obj: any) => {
  const returnObj: any = {};
  obj.forEach((obj: any) => {
    returnObj[obj.possessionLength] = obj.prob;
  });
  return returnObj;
};
