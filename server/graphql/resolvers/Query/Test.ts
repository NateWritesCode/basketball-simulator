export const Test = {
  getServerTime: (): string => {
    return new Date().toISOString();
  },
};
