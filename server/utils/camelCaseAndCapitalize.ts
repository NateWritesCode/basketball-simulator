import lodash from "lodash";
const { camelCase } = lodash;

export const camelCaseAndCapitalize = (s: string) => {
  const camelCased = camelCase(s);

  return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
};
