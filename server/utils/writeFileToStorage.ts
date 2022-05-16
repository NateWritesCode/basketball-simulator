import fs from "fs";
import { storage } from "@serverless/cloud";

export default async (filePath: string) => {
  const data = fs.readFileSync(`.${filePath}`);
  try {
    await storage.write(filePath, data);
  } catch (error) {
    throw new Error(error);
  }
};
