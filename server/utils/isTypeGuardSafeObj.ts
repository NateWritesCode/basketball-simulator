import { AnyZodObject } from "zod";

export const isTypeGuardSafeObj = (o: AnyZodObject, d: any): boolean => {
  const parsedData = o.safeParse(d);
  if (parsedData.success) {
    return true;
  }

  console.log("parsedData.error", parsedData.error.message);

  return false;
};
