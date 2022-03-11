import { Player as DbPlayer } from "@prisma/client";

class Player {
  assist: number;
  arc3: number;
  atRim: number;
  block: number;
  blocking: number;
  corner3: number;
  familyName: string;
  fgArc3Attempt: number;
  fgArc3Block: number;
  fgArc3Made: number;
  fgArc3MadeFoul: number;
  fgAtRimAttempt: number;
  fgAtRimBlock: number;
  fgAtRimMade: number;
  fgAtRimMadeFoul: number;
  fgCorner3Attempt: number;
  fgCorner3Block: number;
  fgCorner3Made: number;
  fgCorner3MadeFoul: number;
  fgLongMidRangeAttempt: number;
  fgLongMidRangeBlock: number;
  fgLongMidRangeMade: number;
  fgLongMidRangeMadeFoul: number;
  fgShortMidRangeAttempt: number;
  fgShortMidRangeBlock: number;
  fgShortMidRangeMade: number;
  fgShortMidRangeMadeFoul: number;
  freeThrow: number;
  givenName: string;
  height: number;
  irritability: number;
  jumping: number;
  id: number;
  midRangeLong: number;
  midRangeShort: number;
  position: string;
  rebounding: number;
  rebDef: number;
  rebOff: number;
  steal: number;
  shotTypeArc3: number;
  shotTypeArc3Def: number;
  shotTypeAtRim: number;
  shotTypeAtRimDef: number;
  shotTypeCorner3: number;
  shotTypeCorner3Def: number;
  shotTypeLongMidRange: number;
  shotTypeLongMidRangeDef: number;
  shotTypeShortMidRange: number;
  shotTypeShortMidRangeDef: number;
  slug: string;
  stealing: number;
  teamId: number;
  turnover: number;
  turnoverProne: number;
  violationDefGoaltend: number;
  violationDefKickBall: number;
  weight: number;

  constructor(
    {
      arc3,
      atRim,
      blocking,
      corner3,
      familyName,
      givenName,
      height,
      id,
      irritability,
      jumping,
      midRangeLong,
      midRangeShort,
      position,
      rebounding,
      slug,
      stealing,
      teamId,
      turnoverProne,
      weight,
    }: DbPlayer,
    {
      assist,
      block,
      fgArc3Attempt,
      fgArc3Block,
      fgArc3Made,
      fgArc3MadeFoul,
      fgAtRimAttempt,
      fgAtRimBlock,
      fgAtRimMade,
      fgAtRimMadeFoul,
      fgCorner3Attempt,
      fgCorner3Block,
      fgCorner3Made,
      fgCorner3MadeFoul,
      fgLongMidRangeAttempt,
      fgLongMidRangeBlock,
      fgLongMidRangeMade,
      fgLongMidRangeMadeFoul,
      fgShortMidRangeAttempt,
      fgShortMidRangeBlock,
      fgShortMidRangeMade,
      fgShortMidRangeMadeFoul,
      freeThrow,
      rebDef,
      rebOff,
      steal,
      shotTypeArc3,
      shotTypeArc3Def,
      shotTypeAtRim,
      shotTypeAtRimDef,
      shotTypeCorner3,
      shotTypeCorner3Def,
      shotTypeLongMidRange,
      shotTypeLongMidRangeDef,
      shotTypeShortMidRange,
      shotTypeShortMidRangeDef,
      turnover,
      violationDefGoaltend,
      violationDefKickBall,
    }: any
  ) {
    this.arc3 = arc3;
    this.assist = assist;
    this.atRim = atRim;
    this.block = block;
    this.blocking = blocking;
    this.corner3 = corner3;
    this.familyName = familyName;
    this.fgArc3Attempt = fgArc3Attempt;
    this.fgArc3Block = fgArc3Block;
    this.fgArc3Made = fgArc3Made;
    this.fgArc3MadeFoul = fgArc3MadeFoul;
    this.fgAtRimAttempt = fgAtRimAttempt;
    this.fgAtRimBlock = fgAtRimBlock;
    this.fgAtRimMade = fgAtRimMade;
    this.fgAtRimMadeFoul = fgAtRimMadeFoul;
    this.fgCorner3Attempt = fgCorner3Attempt;
    this.fgCorner3Block = fgCorner3Block;
    this.fgCorner3Made = fgCorner3Made;
    this.fgCorner3MadeFoul = fgCorner3MadeFoul;
    this.fgLongMidRangeAttempt = fgLongMidRangeAttempt;
    this.fgLongMidRangeBlock = fgLongMidRangeBlock;
    this.fgLongMidRangeMade = fgLongMidRangeMade;
    this.fgLongMidRangeMadeFoul = fgLongMidRangeMadeFoul;
    this.fgShortMidRangeAttempt = fgShortMidRangeAttempt;
    this.fgShortMidRangeBlock = fgShortMidRangeBlock;
    this.fgShortMidRangeMade = fgShortMidRangeMade;
    this.fgShortMidRangeMadeFoul = fgShortMidRangeMadeFoul;
    this.freeThrow = freeThrow;
    this.rebDef = rebDef;
    this.rebOff = rebOff;
    this.steal = steal;
    this.givenName = givenName;
    this.height = height;
    this.id = id;
    this.irritability = irritability;
    this.jumping = jumping;
    this.midRangeLong = midRangeLong;
    this.midRangeShort = midRangeShort;
    this.position = position;
    this.rebounding = rebounding;
    this.shotTypeArc3 = shotTypeArc3;
    this.shotTypeArc3Def = shotTypeArc3Def;
    this.shotTypeAtRim = shotTypeAtRim;
    this.shotTypeAtRimDef = shotTypeAtRimDef;
    this.shotTypeCorner3 = shotTypeCorner3;
    this.shotTypeCorner3Def = shotTypeCorner3Def;
    this.shotTypeLongMidRange = shotTypeLongMidRange;
    this.shotTypeLongMidRangeDef = shotTypeLongMidRangeDef;
    this.shotTypeShortMidRange = shotTypeShortMidRange;
    this.shotTypeShortMidRangeDef = shotTypeShortMidRangeDef;
    this.slug = slug;
    this.stealing = stealing;
    this.teamId = teamId;
    this.turnoverProne = turnoverProne;
    this.turnover = turnover;
    this.violationDefGoaltend = violationDefGoaltend;
    this.violationDefKickBall = violationDefKickBall;
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
