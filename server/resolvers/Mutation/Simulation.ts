import { Context } from "../../types";
import { storage } from "@serverless/cloud";
import * as fs from "fs";
import * as dataForge from "data-forge";
import Papa from "papaparse";

export const Simulation = {
  simulate: (
    _parent: undefined,
    _args: undefined,
    context: Context
  ): boolean => {
    console.log("Simulating");
    return true;
  },
  simulateCleanup: (): boolean => {
    return true;
  },
  simulatePrep: async (): Promise<boolean> => {
    try {
      const conferencePath = "./data/conference/conference.txt";
      const conferenceData = fs.readFileSync(conferencePath);

      await storage.write(conferencePath, conferenceData);

      const stream = await storage.read(conferencePath);
      console.log("Papa", Papa);
      const test = await Papa.parse(stream, {
        complete: (results: any) => {
          console.log("results", results);
        },
      });

      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
