import { Context } from "../../types/general";

export const Test = {
  getServerTime: (): string => {
    return new Date().toISOString();
  },
};
