import { QueryResolvers } from "../../types/resolverTypes";

type TestResolvers = {
  getServerTime: QueryResolvers["getServerTime"];
};

export const Test: TestResolvers = {
  getServerTime: () => {
    return new Date().toISOString();
  },
};
