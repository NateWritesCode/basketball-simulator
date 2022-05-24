import { data } from "@serverless/cloud";

class DataClient {
  constructor() {}

  public set = async ({
    instanceId,
    namespace,
    value,
  }: {
    instanceId: number;
    namespace: string;
    value: any;
  }) => {
    try {
      await data.set(`${namespace}-${instanceId}`, value);
    } catch (error) {
      throw new Error(error);
    }
  };
}

const dataClient = new DataClient();

export { dataClient };
