import { Scheduler } from "../../entities/Scheduler";
import { Context } from "../../types/general";
import { Conference } from "../../types/resolverTypes";

export const Test = {
  createFoo: (): boolean => {
    return true;
  },
  sandbox: async (
    _parent: undefined,
    _args: undefined,
    { data }: Context
  ): Promise<boolean> => {
    console.log("SANDBOX IS STARTING");
    const instanceId = 1;

    const dataConferences = (
      await data.get(`conference-${instanceId}:*`)
    ).items.map((obj) => obj.value);

    const dataDivisions = (
      await data.get(`division-${instanceId}:*`)
    ).items.map((obj) => obj.value);

    const dataTeams = (await data.get(`team-${instanceId}:*`)).items.map(
      (obj) => obj.value
    );

    const scheduler = new Scheduler(dataConferences, dataDivisions, dataTeams);

    scheduler.createNbaSchedule();

    console.log(JSON.stringify(scheduler.schedule, null, 4));

    console.log("SANDBOX IS COMPLETE");

    return true;
  },
};
