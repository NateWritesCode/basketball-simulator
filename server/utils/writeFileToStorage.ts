import fs from "fs";
import { storage } from "@serverless/cloud";

export const writeFileToStorage = async (filePath: string) => {
  const data = fs.readFileSync(`.${filePath}`);
  try {
    await storage.write(filePath, data);
  } catch (error) {
    throw new Error(error);
  }
};
