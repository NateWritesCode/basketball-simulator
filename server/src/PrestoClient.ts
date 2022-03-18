import presto from "presto-client-ts";
import SqlString from "sqlstring";
import { map, zipObj, prop, concat } from "ramda";

class PrestoClient {
  client: presto.Client;

  constructor() {
    this.client = new presto.Client({
      host: "localhost",
      port: 8080,
      catalog: "hive",
      user: "root",
      schema: "default",
    });
  }

  query(query: string, values?: any[]) {
    const queryWithParams = SqlString.format(query, values);
    return this.queryPromised(queryWithParams);
  }

  queryPromised(query: any) {
    return new Promise((resolve, reject) => {
      let fullData: any[] = [];

      this.client.execute({
        query,
        data: (error, data, columns) => {
          const normalData = this.normalizeResultOverColumns(data, columns);
          fullData = concat(normalData, fullData);
        },
        success: () => {
          resolve(fullData);
        },
        error: (error) => {
          reject(new Error(`${error.message}\n${error.error}`));
        },
      });
    });
  }

  normalizeResultOverColumns(data: any, columns: any) {
    //TODO: Get rid of this functional programming library or learn it
    const columnNames: any = map(prop("name"), columns || []);
    const arrayToObject: any = zipObj(columnNames);
    return map(arrayToObject, data || []);
  }
}

export default PrestoClient;
