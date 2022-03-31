import { camelCase } from "lodash";

export default (s: string) => {
  const camelCased = camelCase(s);

  return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
};
