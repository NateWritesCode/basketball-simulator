import { AnyZodObject } from "zod";

export const getTypeGuardSafeData = (o: AnyZodObject, d: any): any => {
  const parsedData = o.safeParse(d);
  if (parsedData.success) {
    return parsedData.data;
  }

  throw new Error("We should have typeguard safe data");
};
