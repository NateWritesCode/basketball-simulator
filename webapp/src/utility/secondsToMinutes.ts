export default (time: number): string => {
  return Math.floor(time / 60) + ":" + Math.floor(time % 60);
};
