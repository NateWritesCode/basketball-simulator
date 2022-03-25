import fs from "fs";
export default (sqlFile: "test") => {
  const result = fs
    .readFileSync(`./sql/${sqlFile}.sql`)
    .toString()
    .split("\n")
    .filter((line) => line.indexOf("--") !== 0)
    .join("\n")
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/\s+/g, " "); // excess white space
  // .split(";");

  console.log("result", result);

  return result;
};
