export default (height: number): string => {
  const feet = Math.floor(height / 12);
  const inches = height % 12;

  return `${feet}'${inches}"`;
};
