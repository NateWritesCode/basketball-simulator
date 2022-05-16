import { storage } from "@serverless/cloud";
import parseCsv from "./parseCsv";

class CsvDb {
  model: any;
  constructor() {
    this.model = {
      player: {
        filePath: "/data/player",
        fileType: "txt",
      },
      schedule: {
        filePath: "/data/schedule",
        fileType: "txt",
      },
      team: {
        filePath: "/data/team",
        fileType: "txt",
      },
    };
  }

  public getMany = async (
    filename: string,
    modelType: string
  ): Promise<any[]> => {
    try {
      console.log("filename", filename);
      console.log("modelType", modelType);
      const filePath = `${this.model[modelType].filePath}/${filename}.${this.model[modelType].fileType}`;
      console.log("filePath", filePath);

      const stream = await storage.readBuffer(filePath);
      if (stream) {
        return await parseCsv(stream);
      } else {
        throw new Error("Could not get stream in getMany");
      }
    } catch (error) {
      throw new Error(error);
    }
  };
}

const csvDb = new CsvDb();

export { csvDb };
