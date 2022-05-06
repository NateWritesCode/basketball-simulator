import fs from "fs";
import path from "path";
import csvdb from "csv-database";

class CsvDb {
  columnTypes: any;
  delimiter: string;
  filePaths: any;
  fileType: string;

  constructor() {
    this.columnTypes = {
      standings: ["teamId", "w", "l"],
    };
    this.delimiter = "|";
    this.filePaths = {
      standings: "./src/data/standings/",
    };
    this.fileType = "txt";
  }

  add = async (
    filename: string,
    columnType: string,
    data: Object | Object[]
  ) => {
    try {
      const db = await this.getDb(filename, columnType);
      await db.add(data);
    } catch (error) {
      throw new Error(error);
    }
  };

  deleteFile = (filePath: string | string[]) => {
    if (typeof filePath === "string") {
      fs.unlinkSync(filePath);
    } else {
      filePath.forEach((str) => {
        fs.unlinkSync(str);
      });
    }
  };

  deleteFilesInFolder = (directory: string) => {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      fs.unlinkSync(path.join(directory, file));
    });
  };

  edit = async (
    filename: string,
    columnType: string,
    filter: Object,
    data: Object
  ) => {
    const db = await this.getDb(filename, columnType);
    await db.edit(convertObjValuesToString(filter), data);
  };

  getColumns = (columnType: string) => {
    return this.columnTypes[columnType];
  };

  getDb = async (filename: string, columnType: string) => {
    return await csvdb(
      this.getFilePath(columnType, filename),
      this.getColumns(columnType),
      this.delimiter
    );
  };

  getFilePath = (columnType: string, filename: string) => {
    return `${this.filePaths[columnType]}${filename}.${this.fileType}`;
  };

  incrementOneRow = async (
    filename: string,
    columnType: string,
    filter: Object,
    data: any
  ) => {
    const db = await this.getDb(filename, columnType);

    const rowDataGet = await db.get(convertObjValuesToString(filter));
    if (rowDataGet.length === 0 || rowDataGet.length > 1) {
      throw new Error("Get received wrong value");
    }
    const rowData: any = (await db.get(filter))[0];

    const dataKeys = Object.keys(data);
    dataKeys.forEach((key) => {
      if (rowData[key]) {
        rowData[key] = Number(rowData[key]) + data[key];
      } else {
        throw new Error(`Can't increment key ${key}`);
      }
    });

    await db.edit(convertObjValuesToString(filter), rowData);
    const test = await db.get();
    console.log("test", test);
  };
}

const csvDbClient = new CsvDb();

export { csvDbClient };

const convertObjValuesToString = (obj: any) => {
  const objKeys = Object.keys(obj);
  objKeys.forEach((key) => {
    obj[key] = String(obj[key]);
  });

  return obj;
};
