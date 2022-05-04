import fs from "fs";
import path from "path";
import csvdb from "csv-database";

class CsvDb {
  columnTypes: any;

  constructor() {
    this.columnTypes = {
      standings: ["teamId", "w", "l"],
    };
  }

  add = async (
    filename: string,
    columnType: string,
    data: Object | Object[]
  ) => {
    try {
      const db = await csvdb(filename, this.columnTypes[columnType], "|");
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
}

const csvDbClient = new CsvDb();

export { csvDbClient };
