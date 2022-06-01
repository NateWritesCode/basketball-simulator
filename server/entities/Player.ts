// import { PlayerProbability, PlayerTotal } from "../types/player";

class Player {
  assist: number;
  block: number;
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
  fgTotalChance: number;
  foulAwayFromPlay: number;
  fouledAwayFromPlay: number;
  foulClearPath: number;
  fouledClearPath: number;
  foulCountAsPersonal: number;
  fouledCountAsPersonal: number;
  foulCountTowardPenalty: number;
  fouledCountTowardPenalty: number;
  foulDefensiveNonShooting: number;
  fouledDefensiveNonShooting: number;
  foulDouble: number;
  foulDoubleTechnical: number;
  foulFlagrant: number;
  fouledFlagrant: number;
  foulFlagrant1: number;
  fouledFlagrant1: number;
  foulFlagrant2: number;
  fouledFlagrant2: number;
  foulInbound: number;
  fouledInbound: number;
  foulLooseBall: number;
  fouledLooseBall: number;
  foulOffensiveCharge: number;
  fouledOffensiveCharge: number;
  foulOffensiveOther: number;
  fouledOffensiveOther: number;
  foulOffensiveTotal: number;
  fouledOffensiveTotal: number;
  foulPersonal: number;
  fouledPersonal: number;
  foulPersonalBlock: number;
  fouledPersonalBlock: number;
  foulPersonalTake: number;
  fouledPersonalTake: number;
  foulShooting: number;
  fouledShooting: number;
  foulShootingBlock: number;
  fouledShootingBlock: number;
  foulTechnical: number;
  freeThrow: number;
  givenName: string;
  height: number;
  id: number;
  irritability: number;
  position: string;
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
  teamId: number;
  turnover: number;
  violationDefGoaltend: number;
  violationDefKickBall: number;
  weight: number;

  constructor({
    familyName,
    givenName,
    height,
    id,
    position,
    probabilities,
    slug,
    teamId,
    totals,
    weight,
  }: any) {
    this.assist = probabilities.ASSIST;
    this.block = probabilities.BLOCK;
    this.familyName = familyName;
    this.fgArc3Attempt = probabilities.FG_ARC_3_ATTEMPT;
    this.fgArc3Block = probabilities.FG_ARC_3_BLOCK;
    this.fgArc3Made = probabilities.FG_ARC_3_MADE;
    this.fgArc3MadeFoul = probabilities.FG_ARC_3_MADE_FOUL;
    this.fgAtRimAttempt = probabilities.FG_AT_RIM_ATTEMPT;
    this.fgAtRimBlock = probabilities.FG_AT_RIM_BLOCK;
    this.fgAtRimMade = probabilities.FG_AT_RIM_MADE;
    this.fgAtRimMadeFoul = probabilities.FG_AT_RIM_MADE_FOUL;
    this.fgCorner3Attempt = probabilities.FG_CORNER_3_ATTEMPT;
    this.fgCorner3Block = probabilities.FG_CORNER_3_BLOCK;
    this.fgCorner3Made = probabilities.FG_CORNER_3_MADE;
    this.fgCorner3MadeFoul = probabilities.FG_CORNER_3_MADE_FOUL;
    this.fgLongMidRangeAttempt = probabilities.FG_LONG_MID_RANGE_ATTEMPT;
    this.fgLongMidRangeBlock = probabilities.FG_LONG_MID_RANGE_BLOCK;
    this.fgLongMidRangeMade = probabilities.FG_LONG_MID_RANGE_MADE;
    this.fgLongMidRangeMadeFoul = probabilities.FG_LONG_MID_RANGE_MADE_FOUL;
    this.fgShortMidRangeAttempt = probabilities.FG_SHORT_MID_RANGE_ATTEMPT;
    this.fgShortMidRangeBlock = probabilities.FG_SHORT_MID_RANGE_BLOCK;
    this.fgShortMidRangeMade = probabilities.FG_SHORT_MID_RANGE_MADE;
    this.fgShortMidRangeMadeFoul = probabilities.FG_SHORT_MID_RANGE_MADE_FOUL;
    this.fgTotalChance = totals.FG_TOTAL_CHANCE_OFFENSIVE;
    this.foulAwayFromPlay = probabilities.FOUL_AWAY_FROM_PLAY;
    this.fouledAwayFromPlay = probabilities.FOULED_AWAY_FROM_PLAY;
    this.foulClearPath = probabilities.FOUL_CLEAR_PATH;
    this.fouledClearPath = probabilities.FOULED_CLEAR_PATH;
    this.foulCountAsPersonal = probabilities.FOUL_COUNT_AS_PERSONAL;
    this.fouledCountAsPersonal = probabilities.FOULED_COUNT_AS_PERSONAL;
    this.foulCountTowardPenalty = probabilities.FOUL_COUNT_TOWARD_PENALTY;
    this.fouledCountTowardPenalty = probabilities.FOULED_COUNT_TOWARD_PENALTY;
    this.foulDefensiveNonShooting = probabilities.FOUL_DEFENSIVE_NON_SHOOTING;
    this.fouledDefensiveNonShooting =
      probabilities.FOULED_DEFENSIVE_NON_SHOOTING;
    this.foulDouble = probabilities.FOUL_DOUBLE;
    this.foulDoubleTechnical = probabilities.FOUL_TECHNICAL_DOUBLE;
    this.foulFlagrant = probabilities.FOUL_FLAGRANT;
    this.fouledFlagrant = probabilities.FOULED_FLAGRANT;
    this.foulFlagrant1 = probabilities.FOUL_FLAGRANT_1;
    this.fouledFlagrant1 = probabilities.FOULED_FLAGRANT_1;
    this.foulFlagrant2 = probabilities.FOUL_FLAGRANT_2;
    this.fouledFlagrant2 = probabilities.FOULED_FLAGRANT_2;
    this.foulInbound = probabilities.FOUL_INBOUND;
    this.fouledInbound = probabilities.FOULED_INBOUND;
    this.foulLooseBall = probabilities.FOUL_LOOSE_BALL;
    this.fouledLooseBall = probabilities.FOULED_LOOSE_BALL;
    this.foulOffensiveCharge = probabilities.FOUL_OFFENSIVE_CHARGE;
    this.fouledOffensiveCharge = probabilities.FOULED_OFFENSIVE_CHARGE;
    this.foulOffensiveOther = probabilities.FOUL_OFFENSIVE_OTHER;
    this.fouledOffensiveOther = probabilities.FOULED_OFFENSIVE_OTHER;
    this.foulOffensiveTotal = probabilities.FOUL_OFFENSIVE_TOTAL;
    this.fouledOffensiveTotal = probabilities.FOULED_OFFENSIVE_TOTAL;
    this.foulPersonal = probabilities.FOUL_PERSONAL;
    this.fouledPersonal = probabilities.FOULED_PERSONAL;
    this.foulPersonalBlock = probabilities.FOUL_PERSONAL_BLOCK;
    this.fouledPersonalBlock = probabilities.FOULED_PERSONAL_BLOCK;
    this.foulPersonalTake = probabilities.FOUL_PERSONAL_TAKE;
    this.fouledPersonalTake = probabilities.FOULED_PERSONAL_TAKE;
    this.foulShooting = probabilities.FOUL_SHOOTING;
    this.fouledShooting = probabilities.FOULED_SHOOTING;
    this.foulShootingBlock = probabilities.FOUL_SHOOTING_BLOCK;
    this.fouledShootingBlock = probabilities.FOULED_SHOOTING_BLOCK;
    this.foulTechnical = probabilities.FOUL_TECHNICAL;
    this.freeThrow = probabilities.FT;
    this.rebDef = probabilities.REBOUND_DEFENSIVE;
    this.rebOff = probabilities.REBOUND_OFFENSIVE;
    this.steal = probabilities.STEAL;
    this.givenName = givenName;
    this.height = height;
    this.id = id;
    this.irritability = 50;
    this.position = position;
    this.shotTypeArc3 = probabilities.SHOT_TYPE_ARC_3_OFFENSIVE;
    this.shotTypeArc3Def = probabilities.SHOT_TYPE_ARC_3_DEFENSIVE;
    this.shotTypeAtRim = probabilities.SHOT_TYPE_AT_RIM_OFFENSIVE;
    this.shotTypeAtRimDef = probabilities.SHOT_TYPE_AT_RIM_DEFENSIVE;
    this.shotTypeCorner3 = probabilities.SHOT_TYPE_CORNER_3_OFFENSIVE;
    this.shotTypeCorner3Def = probabilities.SHOT_TYPE_CORNER_3_DEFENSIVE;
    this.shotTypeLongMidRange =
      probabilities.SHOT_TYPE_LONG_MID_RANGE_OFFENSIVE;
    this.shotTypeLongMidRangeDef =
      probabilities.SHOT_TYPE_LONG_MID_RANGE_DEFENSIVE;
    this.shotTypeShortMidRange =
      probabilities.SHOT_TYPE_SHORT_MID_RANGE_OFFENSIVE;
    this.shotTypeShortMidRangeDef =
      probabilities.SHOT_TYPE_SHORT_MID_RANGE_DEFENSIVE;
    this.slug = slug;
    this.teamId = teamId;
    this.turnover = probabilities.TURNOVER;
    this.violationDefGoaltend = probabilities.VIOLATION_DEFENSIVE_GOALTENDING;
    this.violationDefKickBall = probabilities.VIOLATION_DEFENSIVE_KICK_BALL;
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

export { Player };
