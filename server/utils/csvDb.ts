import { storage } from "@serverless/cloud";
import lodash from "lodash";
import { stringify } from "csv-stringify/sync";
import { parseCsv } from "./parseCsv";
const { isEqual } = lodash;

class CsvDb {
  private model: any;
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
    };
  }

  public add = async (
    filename: string,
    modelType: string,
    data: Object | Object[]
  ) => {
    const filePath = this.getFilePath(filename, modelType);
    const fileExists = await storage.exists(filePath);

    console.log("fileExists", fileExists);

    const dataObj = Array.isArray(data) ? data[0] : data;

    // this.checkIfDataObjMatchesColumns(modelType, dataObj);

    if (fileExists) {
      const csvString = stringify(Array.isArray(data) ? data : [data], {
        header: false,
      });
      console.log("csvString", csvString);
      await this.writeTextToFile(filePath, csvString);
    } else {
      const csvString = stringify(Array.isArray(data) ? data : [data], {
        header: true,
      });
      console.log("csvString", csvString);
      await this.writeTextToFile(filePath, csvString);
    }
  };

  private buildDataString = (
    modelType: string,
    data: Object | Object[]
  ): string => {
    let dataString = "";
    const { columns } = this.model[modelType];
    const columnKeys = Object.keys(columns);

    if (Array.isArray(data)) {
      data.forEach((dataObj: any) => {
        columnKeys.forEach((column: string, i) => {
          const isLastKey = i + 1 === columnKeys.length;
          const value = dataObj[column];
          dataString += `${value}${isLastKey ? "" : "|"}\n`;
        });
      });
    } else {
      columnKeys.forEach((column: string, i) => {
        const isLastKey = i + 1 === columnKeys.length;
        //@ts-ignore
        const value = data[column];
        dataString += `${value}${isLastKey ? "" : "|"}\n`;
      });
    }
    console.log("dataString", dataString);
    return dataString;
  };

  private buildHeaderString = (modelType: string) => {
    const { columns } = this.model[modelType];

    if (!columns) {
      throw new Error(`Need columns to build headers for ${modelType}`);
    }

    let headerString = "";
    const columnKeys = Object.keys(columns);
    columnKeys.forEach((pipeSettingKey, i) => {
      const isLastKey = i + 1 === columnKeys.length;
      const value = pipeSettingKey;
      headerString += `${value}${isLastKey ? "" : "|"}\n`;
    });

    console.log("headerString", headerString);
    return headerString;
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

  public delete = async (filename: string, modelType: string) => {
    const filePath = this.getFilePath(filename, modelType);

    await storage.remove(filePath);

    console.log(`File is removed from ${filePath}`);
  };

  private getFilePath = (filename: string, modelType: string) => {
    return `${this.model[modelType].filePath}/${filename}.${this.model[modelType].fileType}`;
  };

  public getMany = async (
    filename: string,
    modelType: string
  ): Promise<any[]> => {
    try {
      const filePath = this.getFilePath(filename, modelType);

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
        parsedData[rowIndex] = parsedData[rowIndex][key] + data[key];
      });
    }
  };

  public increment = async (
    filename: string,
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

      console.log("parsedData", parsedData);

      await storage.write(filePath, stringify(parsedData, { delimiter: "|" }));
    }
  };

  public read = async (filename: string, modelType: string): Promise<any> => {
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
