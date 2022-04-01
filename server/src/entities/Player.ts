import { Player as DbPlayer } from "@prisma/client";
import { PlayerProbability, PlayerTotal } from "../types/player";

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
    playerProbability: PlayerProbability,
    playerTotal: PlayerTotal
  ) {
    this.arc3 = arc3;
    this.assist = playerProbability.ASSIST;
    this.atRim = atRim;
    this.block = playerProbability.BLOCK;
    this.blocking = blocking;
    this.corner3 = corner3;
    this.familyName = familyName;
    this.fgArc3Attempt = playerProbability.FG_ARC_3_ATTEMPT;
    this.fgArc3Block = playerProbability.FG_ARC_3_BLOCK;
    this.fgArc3Made = playerProbability.FG_ARC_3_MADE;
    this.fgArc3MadeFoul = playerProbability.FG_ARC_3_MADE_FOUL;
    this.fgAtRimAttempt = playerProbability.FG_AT_RIM_ATTEMPT;
    this.fgAtRimBlock = playerProbability.FG_AT_RIM_BLOCK;
    this.fgAtRimMade = playerProbability.FG_AT_RIM_MADE;
    this.fgAtRimMadeFoul = playerProbability.FG_AT_RIM_MADE_FOUL;
    this.fgCorner3Attempt = playerProbability.FG_CORNER_3_ATTEMPT;
    this.fgCorner3Block = playerProbability.FG_CORNER_3_BLOCK;
    this.fgCorner3Made = playerProbability.FG_CORNER_3_MADE;
    this.fgCorner3MadeFoul = playerProbability.FG_CORNER_3_MADE_FOUL;
    this.fgLongMidRangeAttempt = playerProbability.FG_LONG_MID_RANGE_ATTEMPT;
    this.fgLongMidRangeBlock = playerProbability.FG_LONG_MID_RANGE_BLOCK;
    this.fgLongMidRangeMade = playerProbability.FG_LONG_MID_RANGE_MADE;
    this.fgLongMidRangeMadeFoul = playerProbability.FG_LONG_MID_RANGE_MADE_FOUL;
    this.fgShortMidRangeAttempt = playerProbability.FG_SHORT_MID_RANGE_ATTEMPT;
    this.fgShortMidRangeBlock = playerProbability.FG_SHORT_MID_RANGE_BLOCK;
    this.fgShortMidRangeMade = playerProbability.FG_SHORT_MID_RANGE_MADE;
    this.fgShortMidRangeMadeFoul =
      playerProbability.FG_SHORT_MID_RANGE_MADE_FOUL;
    this.fgTotalChance = playerTotal.FG_TOTAL_CHANCE_OFFENSIVE;
    this.foulAwayFromPlay = playerProbability.FOUL_AWAY_FROM_PLAY;
    this.fouledAwayFromPlay = playerProbability.FOULED_AWAY_FROM_PLAY;
    this.foulClearPath = playerProbability.FOUL_CLEAR_PATH;
    this.fouledClearPath = playerProbability.FOULED_CLEAR_PATH;
    this.foulCountAsPersonal = playerProbability.FOUL_COUNT_AS_PERSONAL;
    this.fouledCountAsPersonal = playerProbability.FOULED_COUNT_AS_PERSONAL;
    this.foulCountTowardPenalty = playerProbability.FOUL_COUNT_TOWARD_PENALTY;
    this.fouledCountTowardPenalty =
      playerProbability.FOULED_COUNT_TOWARD_PENALTY;
    this.foulDefensiveNonShooting =
      playerProbability.FOUL_DEFENSIVE_NON_SHOOTING;
    this.fouledDefensiveNonShooting =
      playerProbability.FOULED_DEFENSIVE_NON_SHOOTING;
    this.foulDouble = playerProbability.FOUL_DOUBLE;
    this.foulDoubleTechnical = playerProbability.FOUL_TECHNICAL_DOUBLE;
    this.foulFlagrant = playerProbability.FOUL_FLAGRANT;
    this.fouledFlagrant = playerProbability.FOULED_FLAGRANT;
    this.foulFlagrant1 = playerProbability.FOUL_FLAGRANT_1;
    this.fouledFlagrant1 = playerProbability.FOULED_FLAGRANT_1;
    this.foulFlagrant2 = playerProbability.FOUL_FLAGRANT_2;
    this.fouledFlagrant2 = playerProbability.FOULED_FLAGRANT_2;
    this.foulInbound = playerProbability.FOUL_INBOUND;
    this.fouledInbound = playerProbability.FOULED_INBOUND;
    this.foulLooseBall = playerProbability.FOUL_LOOSE_BALL;
    this.fouledLooseBall = playerProbability.FOULED_LOOSE_BALL;
    this.foulOffensiveCharge = playerProbability.FOUL_OFFENSIVE_CHARGE;
    this.fouledOffensiveCharge = playerProbability.FOULED_OFFENSIVE_CHARGE;
    this.foulOffensiveOther = playerProbability.FOUL_OFFENSIVE_OTHER;
    this.fouledOffensiveOther = playerProbability.FOULED_OFFENSIVE_OTHER;
    this.foulOffensiveTotal = playerProbability.FOUL_OFFENSIVE_TOTAL;
    this.fouledOffensiveTotal = playerProbability.FOULED_OFFENSIVE_TOTAL;
    this.foulPersonal = playerProbability.FOUL_PERSONAL;
    this.fouledPersonal = playerProbability.FOULED_PERSONAL;
    this.foulPersonalBlock = playerProbability.FOUL_PERSONAL_BLOCK;
    this.fouledPersonalBlock = playerProbability.FOULED_PERSONAL_BLOCK;
    this.foulPersonalTake = playerProbability.FOUL_PERSONAL_TAKE;
    this.fouledPersonalTake = playerProbability.FOULED_PERSONAL_TAKE;
    this.foulShooting = playerProbability.FOUL_SHOOTING;
    this.fouledShooting = playerProbability.FOULED_SHOOTING;
    this.foulShootingBlock = playerProbability.FOUL_SHOOTING_BLOCK;
    this.fouledShootingBlock = playerProbability.FOULED_SHOOTING_BLOCK;
    this.foulTechnical = playerProbability.FOUL_TECHNICAL;
    this.freeThrow = playerProbability.FT;
    this.rebDef = playerProbability.REBOUND_DEFENSIVE;
    this.rebOff = playerProbability.REBOUND_OFFENSIVE;
    this.steal = playerProbability.STEAL;
    this.givenName = givenName;
    this.height = height;
    this.id = id;
    this.irritability = irritability;
    this.jumping = jumping;
    this.midRangeLong = midRangeLong;
    this.midRangeShort = midRangeShort;
    this.position = position;
    this.rebounding = rebounding;
    this.shotTypeArc3 = playerProbability.SHOT_TYPE_ARC_3_OFFENSIVE;
    this.shotTypeArc3Def = playerProbability.SHOT_TYPE_ARC_3_DEFENSIVE;
    this.shotTypeAtRim = playerProbability.SHOT_TYPE_AT_RIM_OFFENSIVE;
    this.shotTypeAtRimDef = playerProbability.SHOT_TYPE_AT_RIM_DEFENSIVE;
    this.shotTypeCorner3 = playerProbability.SHOT_TYPE_CORNER_3_OFFENSIVE;
    this.shotTypeCorner3Def = playerProbability.SHOT_TYPE_CORNER_3_DEFENSIVE;
    this.shotTypeLongMidRange =
      playerProbability.SHOT_TYPE_LONG_MID_RANGE_OFFENSIVE;
    this.shotTypeLongMidRangeDef =
      playerProbability.SHOT_TYPE_LONG_MID_RANGE_DEFENSIVE;
    this.shotTypeShortMidRange =
      playerProbability.SHOT_TYPE_SHORT_MID_RANGE_OFFENSIVE;
    this.shotTypeShortMidRangeDef =
      playerProbability.SHOT_TYPE_SHORT_MID_RANGE_DEFENSIVE;
    this.slug = slug;
    this.stealing = stealing;
    this.teamId = teamId;
    this.turnoverProne = turnoverProne;
    this.turnover = playerProbability.TURNOVER;
    this.violationDefGoaltend =
      playerProbability.VIOLATION_DEFENSIVE_GOALTENDING;
    this.violationDefKickBall = playerProbability.VIOLATION_DEFENSIVE_KICK_BALL;
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
