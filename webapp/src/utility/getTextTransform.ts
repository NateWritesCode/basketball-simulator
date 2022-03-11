export default (textTransformType: "positionAbbrev", value: string): string => {
  switch (textTransformType) {
    case "positionAbbrev": {
      //TODO: Make types for the different position values
      const positions = {
        Center: "C",
        Forward: "F",
        Guard: "G",
        "Guard-Forward": "G/F",
      };

      const returnValue = positions[value as keyof typeof positions];

      if (returnValue) {
        return returnValue;
      } else {
        throw new Error(
          `Don't know how to handle textTransform ${textTransformType} ${value}`
        );
      }
    }
    default:
      const exhaustiveCheck: never = textTransformType;
      throw new Error(exhaustiveCheck);
  }
};
