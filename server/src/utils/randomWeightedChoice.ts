import random from "random";

type WeightedChoiceTuple = [string | number, number];

export default (data: WeightedChoiceTuple[]): any => {
  // First, we loop the main dataset to count up the total weight.
  // We're starting the counter at one because the upper boundary
  // of Math.random() is exclusive.
  let total = 0;
  for (let i = 0; i < data.length; ++i) {
    total += data[i][1];
  }

  // Total in hand, we can now pick a random value akin to our
  // random index from before.
  const threshold = random.float(0, 1) * total;

  // Now we just need to loop through the main data one more time
  // until we discover which value would live within this
  // particular threshold. We need to keep a running count of
  // weights as we go, so let's just reuse the "total" variable
  // since it was already declared.
  total = 0;
  for (let i = 0; i < data.length - 1; ++i) {
    // Add the weight to our running total.
    total += data[i][1];

    // If this value falls within the threshold, we're done!
    if (total >= threshold) {
      return data[i][0];
    }
  }

  // Wouldn't you know it, we needed the very last entry!
  return data[data.length - 1][0];
};
