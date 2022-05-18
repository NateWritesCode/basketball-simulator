import { Context } from "../../types/general";

export const Test = {
  createFoo: (): boolean => {
    return true;
  },
  sandbox: async (
    _parent: undefined,
    _args: undefined,
    { csvDb }: Context
  ): Promise<boolean> => {
    const teams = [
      { teamId: 1, w: 0, l: 0 },
      { teamId: 2, w: 0, l: 0 },
    ];

    await csvDb.delete("1", "standings");
    await csvDb.add("1", "standings", teams);
    const standings = await csvDb.read("1", "standings");
    // await csvDb.increment("1", "standings", [
    //   { data: { w: 1 }, filter: { teamId: 1 } },
    //   { data: { l: 1 }, filter: { teamId: 2 } },
    // ]);

    console.log("standings", standings);

    // const standings = await csvDb.read("1", "standings");
    // console.log("standings", standings);

    console.log("SANDBOX IS COMPLETE");

    return true;
  },
};
