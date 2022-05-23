import { storage } from "@serverless/cloud";
import lodash from "lodash";
import { stringify } from "csv-stringify/sync";
import { parseCsv } from "./parseCsv";
const { isEqual } = lodash;

class CsvDb {
  private model: any;
  constructor() {
    this.model = {
      conference: {
        filePath: "/data/conference",
        fileType: "txt",
      },
      division: {
        filePath: "/data/division",
        fileType: "txt",
      },
      league: {
        filePath: "/data/league",
        fileType: "txt",
      },
      player: {
        filePath: "/data/player",
        fileType: "txt",
      },
      "player-game": {
        filePath: "/data/player-game",
        fileType: "txt",
      },
      "player-game-group": {
        filePath: "/data/player-game-group",
        fileType: "txt",
      },
      schedule: {
        filePath: "/data/schedule",
        fileType: "txt",
      },
      standings: {
        columns: {
          teamId: { dataType: "id" },
          w: { dataType: "int" },
          l: { dataType: "int" },
        },
        filePath: "/data/standings",
        fileType: "txt",
      },
      team: {
        filePath: "/data/team",
        fileType: "txt",
      },
      "team-game": {
        filePath: "/data/team-game",
        fileType: "txt",
      },
      "team-game-group": {
        filePath: "/data/team-game-group",
        fileType: "txt",
      },
    };
  }

  public add = async (
    filename: string | number,
    modelType: string,
    data: Object | Object[]
  ) => {
    const filePath = this.getFilePath(filename, modelType);
    const fileExists = await storage.exists(filePath);

    if (fileExists) {
      const csvString = stringify(Array.isArray(data) ? data : [data], {
        header: false,
        delimiter: "|",
      });
      await this.writeTextToFile(filePath, csvString);
    } else {
      const csvString = stringify(Array.isArray(data) ? data : [data], {
        delimiter: "|",
        header: true,
      });
      await this.writeTextToFile(filePath, csvString);
    }
  };

  private checkIfDataObjMatchesColumns = (
    modelType: string,
    dataObj: Object
  ) => {
    const { columns } = this.model[modelType];
    const columnKeys = Object.keys(columns);

    if (!columns) {
      throw new Error(`Need columns to build headers for ${modelType}`);
    }

    const dataKeys = Object.keys(dataObj);

    if (!isEqual(columnKeys, dataKeys)) {
      console.log("columnKeys", columnKeys);
      console.log("dataKeys", dataKeys);
      throw new Error("Columns and data keys don't match");
    }
  };

  public delete = async (filename: string | number, modelType: string) => {
    const filePath = this.getFilePath(filename, modelType);

    await storage.remove(filePath);

    console.log(`File is removed from ${filePath}`);
  };

  private getFilePath = (filename: string | number, modelType: string) => {
    return `${this.model[modelType].filePath}/${filename}.${this.model[modelType].fileType}`;
  };

  public getOne = async (
    filename: string | number,
    modelType: string,
    filter: any
  ) => {
    const filePath = this.getFilePath(filename, modelType);
    const dataFromExistingFile = await storage.readBuffer(filePath);
    if (dataFromExistingFile) {
      const filterKey = Object.keys(filter)[0];
      const parsedData = await parseCsv(dataFromExistingFile);
      const rowIndex = parsedData.findIndex(
        (obj) => obj[filterKey] === filter[filterKey]
      );

      if (rowIndex >= 0) {
        return parsedData[rowIndex];
      }

      console.log(`${modelType} ${JSON.stringify(filter)} does not exist`);
      return null;
    }
  };

  public getAll = async (filename: string | number, modelType: string) => {
    const filePath = this.getFilePath(filename, modelType);
    const buffer = await storage.readBuffer(filePath);

    if (buffer) {
      return await parseCsv(buffer);
    } else {
      throw new Error("Could not find a file to read");
    }
  };

  private getDataFromExistingFile = async (filePath: string) => {
    const buffer = await storage.readBuffer(filePath);

    if (!buffer) {
      throw new Error(`File does not exist at path ${filePath}`);
    }

    return buffer.toString();
  };

  private incrementRow = (parsedData: any[], filter: any, data: any) => {
    const filterKey = Object.keys(filter)[0];

    const rowIndex = parsedData.findIndex(
      (obj) => obj[filterKey] === filter[filterKey]
    );

    if (rowIndex >= 0) {
      const dataKeys = Object.keys(data);
      dataKeys.forEach((key) => {
        parsedData[rowIndex][key] = parsedData[rowIndex][key] + data[key];
      });
    }
  };

  public increment = async (
    filename: string | number,
    modelType: string,
    incrementObj: CsvDbDataAndFilter | CsvDbDataAndFilter[]
  ) => {
    const filePath = this.getFilePath(filename, modelType);
    const dataFromExistingFile = await storage.readBuffer(filePath);
    if (dataFromExistingFile) {
      const parsedData = await parseCsv(dataFromExistingFile);

      if (Array.isArray(incrementObj)) {
        incrementObj.forEach((incrementItem) => {
          const { filter, data } = incrementItem;
          this.incrementRow(parsedData, filter, data);
        });
      } else {
        const { filter, data } = incrementObj;
        this.incrementRow(parsedData, filter, data);
      }

      const csvString = stringify(parsedData, { delimiter: "|", header: true });

      await storage.write(filePath, csvString);
    } else {
      const dataToWrite: any[] = Array.isArray(incrementObj)
        ? incrementObj.map((obj) => obj.data)
        : [incrementObj.data];

      const csvString = stringify(dataToWrite, {
        delimiter: "|",
        header: true,
      });

      await storage.write(filePath, csvString);
    }
  };

  public deleteSimFiles = async () => {
    const pages = await storage.list("/", { recursive: true, pageSize: 1000 });
    let files = [];

    for await (const page of pages) {
      files.push(...page);
    }

    const filesToKeep = [
      "data/conference/conference.txt",
      "data/division/division.txt",
      "data/league/league.txt",
      "data/player/player.txt",
      "data/schedule/1.txt",
      "data/team/team.txt",
    ];

    files = files.filter((file) => !filesToKeep.includes(file));

    console.log("deleting files", files);

    for await (const file of files) {
      try {
        await storage.remove(`/${file}`);
      } catch (error) {
        throw new Error(error);
      }
    }
  };

  public listFiles = async () => {
    const pages = await storage.list("/", { recursive: true, pageSize: 1000 });
    const files = [];
    for await (const page of pages) {
      files.push(...page);
    }
    console.log("Listing files", files);
  };

  public read = async (
    filename: string | number,
    modelType: string
  ): Promise<any> => {
    const filePath = this.getFilePath(filename, modelType);
    const buffer = await storage.readBuffer(filePath);

    if (buffer) {
      return await parseCsv(buffer);
    } else {
      throw new Error("Could not find a file to read");
    }
  };

  private writeTextToFile = async (filePath: string, dataString: string) => {
    await storage.write(filePath, dataString);
  };
}

const csvDb = new CsvDb();

export { csvDb };

type CsvDbDataAndFilter = {
  data: any;
  filter: any;
};
