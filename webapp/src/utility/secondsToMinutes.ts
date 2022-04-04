import moment from "moment";

export default (seconds: number): string => {
  return moment.utc(seconds * 1000).format("mm:ss");
};
