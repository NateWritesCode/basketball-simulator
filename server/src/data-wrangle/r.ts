import fgProbability from "../data/r/fgProbability.json";
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
