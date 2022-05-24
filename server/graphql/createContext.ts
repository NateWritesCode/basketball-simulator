import { csvDb } from "../utils/csvDb";
import { data } from "@serverless/cloud";
export const createContext = () => {
  return {
    csvDb,
    data,
  };
};
