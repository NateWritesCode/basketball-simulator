type PlayerInit = {
  familyName: string;
  givenName: string;
  height: number;
  jumping: number;
  id: number;
  teamId: number;
};

class Player {
  familyName: string;
  givenName: string;
  height: number;
  id: number;
  irritability: number;
  jumping: number;
  teamId: number;

  constructor({
    familyName,
    givenName,
    height,
    id,
    jumping,
    teamId,
  }: PlayerInit) {
    this.familyName = familyName;
    this.givenName = givenName;
    this.height = height;
    this.id = id;
    this.irritability = 0;
    this.jumping = jumping;
    this.teamId = teamId;
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
