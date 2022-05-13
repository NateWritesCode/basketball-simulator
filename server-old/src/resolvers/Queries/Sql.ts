import { nonNull, queryField, stringArg } from "nexus";
import { getSqlFile } from "../../utils";

export const sqlSandbox = queryField("sqlSandbox", {
  type: "String",
  args: {
    dbType: nonNull(stringArg()),
    sqlString: nonNull(stringArg()),
    values: stringArg(),
  },
  async resolve(_parent, { dbType, sqlString, values }, { presto, prisma }) {
    if (dbType === "presto") {
      let data: any = await presto.query(getSqlFile("test"), ["3FG_MADE"]);

      if (!data) {
        return null;
      }

      if (data.length >= 5) {
        console.log("Goodbye world");
        return JSON.stringify(data.slice(0, 5));
      }

      return JSON.stringify(data);
    } else if (dbType === "postgres") {
      return null;
    } else if (dbType === "custom") {
      await prisma.$queryRawUnsafe(sqlString);
    } else {
      throw new Error("We don't know how to handle this");
    }
  },
});
