import { Options, parse } from "csv-parse";
import { finished } from "stream/promises";
import { Readable } from "stream";

export const parseCsv = async (buffer: Buffer, parseOptions?: Options) => {
  try {
    const records: any[] = [];
    const stream = Readable.from(buffer);
    const parser = stream.pipe(
      parse(
        parseOptions
          ? parseOptions
          : {
              cast: true,
              columns: true,
              delimiter: "|",
              groupColumnsByName: true,
            }
      )
    );
    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    await finished(parser);
    return records;
  } catch (error) {
    console.log("parseCsv error", error);
    throw new Error(error);
  }
};
