import { Mutation } from "./Mutation";
import { Query } from "./Query";
import { Scalars } from "./Scalars";
import { IResolvers } from "@graphql-tools/utils";
import { Context } from "../../types";

const resolvers: IResolvers<any, Context> = {
  ...Scalars,
  Query,
  Mutation,
};

export { resolvers };
