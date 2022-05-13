import { AnyZodObject } from "zod";

export default (o: AnyZodObject, d: any): boolean => {
  const parsedData = o.safeParse(d);
  if (parsedData.success) {
    return true;
  }

  console.log("parsedData.error", parsedData.error.message);

  return false;
};
