import { Player as DbPlayer } from "@prisma/client";

class Player {
  arc3: number;
  atRim: number;
  blocking: number;
  corner3: number;
  familyName: string;
  freeThrow: number;
  givenName: string;
  height: number;
  irritability: number;
  jumping: number;
  id: number;
  midRangeLong: number;
  midRangeShort: number;
  rebounding: number;
  stealing: number;
  teamId: number;
  turnoverProne: number;
  weight: number;

  constructor({
    arc3,
    atRim,
    blocking,
    corner3,
    familyName,
    freeThrow,
    givenName,
    height,
    id,
    irritability,
    jumping,
    midRangeLong,
    midRangeShort,
    rebounding,
    stealing,
    teamId,
    turnoverProne,
    weight,
  }: DbPlayer) {
    this.arc3 = arc3;
    this.atRim = atRim;
    this.blocking = blocking;
    this.corner3 = corner3;
    this.familyName = familyName;
    this.freeThrow = freeThrow;
    this.givenName = givenName;
    this.height = height;
    this.id = id;
    this.irritability = irritability;
    this.jumping = jumping;
    this.midRangeLong = midRangeLong;
    this.midRangeShort = midRangeShort;
    this.rebounding = rebounding;
    this.stealing = stealing;
    this.teamId = teamId;
    this.turnoverProne = turnoverProne;
    this.weight = weight;
  }

  calculateNormalizedData = ({
    max,
    min,
    value,
  }: {
    max: number;
    min: number;
    value: number;
  }): number => {
    return Math.round(((value - min) / (max - min)) * 100);
  };

  getFullName = (): string => {
    return `${this.givenName} ${this.familyName}`;
  };

  // take ratio data like height and convert it to a 0-100 scale: https://www.statology.org/normalize-data-between-0-and-100/
  normalizePlayerData = () => {
    const MAX_HEIGHT = 108; //inches;
    const MIN_HEIGHT = 48; //inches

    this.height = this.calculateNormalizedData({
      max: MAX_HEIGHT,
      min: MIN_HEIGHT,
      value: this.height,
    });
  };
}

export default Player;
