import * as dataForge from "data-forge";
import fg from "../data/pbp/fg.json";
import foul from "../data/pbp/foul.json";
import ft from "../data/pbp/ft.json";
import jumpBall from "../data/pbp/jump_ball.json";
import pbp from "../data/pbp/pbp.json";
import rebound from "../data/pbp/rebound.json";
import substitution from "../data/pbp/substitution.json";
import turnover from "../data/pbp/turnover.json";
import violation from "../data/pbp/violation.json";
import {
  Pbp,
  PbpFg,
  PbpFoul,
  PbpFt,
  PbpRebound,
  PbpTurnover,
  PbpViolation,
} from "../types/pbpParse";

const objBuilder = (incomingData: any): any => {
  return dataForge
    .fromObject(incomingData)
    .toArray()
    .reduce((obj: any, cur) => {
      const data = cur.Value;
      obj[data.pbp_id] = { ...data };
      return obj;
    }, {});
};

const getPossessionType = (pbpEvent: Pbp) => {
  if (pbpEvent.is_ejection) {
    return "Ejection";
  } else if (pbpEvent.is_end_of_period) {
    return "End of Period";
  } else if (pbpEvent.is_field_goal) {
    return "Field goal";
  } else if (pbpEvent.is_foul) {
    return "Foul";
  } else if (pbpEvent.is_free_throw) {
    return "Free throw";
  } else if (pbpEvent.is_jump_ball) {
    return "Jump ball";
  } else if (pbpEvent.is_rebound) {
    return "Rebound";
  } else if (pbpEvent.is_replay) {
    return "Replay";
  } else if (pbpEvent.is_start_of_period) {
    return "Start of period";
  } else if (pbpEvent.is_substitution) {
    return "Substitution";
  } else if (pbpEvent.is_timeout) {
    return "Timeout";
  } else if (pbpEvent.is_turnover) {
    return "Turnover";
  } else if (pbpEvent.is_violation) {
    return "Violation";
  } else {
    console.log("pbpEvent", pbpEvent);
    throw new Error("Ut oh! What is this??");
  }
};

export const startPlayByPlayParse = async () => {
  const pbpEvents = dataForge
    .fromObject(pbp)
    .toArray()
    .map((o) => o.Value) as Pbp[];

  const fgEvents = objBuilder(fg);
  const foulEvents = objBuilder(foul);
  const ftEvents = objBuilder(ft);
  const jumpBallEvents = objBuilder(jumpBall);
  const reboundEvents = objBuilder(rebound);
  const substitutionEvents = objBuilder(substitution);
  const turnoverEvents = objBuilder(turnover);
  const violationEvents = objBuilder(violation);

  const gameData = {
    and1s: 0,
    arc3s: 0,
    atRims: 0,
    assists: 0,
    blocks: 0,
    corner3s: 0,
    defRebounds: 0,
    ejections: 0,
    fg2s: 0,
    fg3s: 0,
    ftAttempts: 0,
    ftMakes: 0,
    ftMisses: 0,
    heaves: 0,
    inPlayPossessions: 0,
    longMidRanges: 0,
    makes: 0,
    makesNoEndPossession: 0,
    misses: 0,
    offensiveFouls: 0,
    offRebounds: 0,
    periodStartingJumpBalls: 0,
    possessionEndingEvents: 0,
    putbacks: 0,
    replays: 0,
    shortMidRanges: 0,
    shootingFouls: 0,
    steals: 0,
    substitutionEvents: 0,
    takeFouls: 0,
    timeouts: 0,
    tossupJumpBalls: 0,
    totalFgs: 0,
    totalRebounds: 0,
    totalEvents: pbpEvents.length,
    turnovers: 0,
    turnoverBadPass: 0,
    turnoverBadPassOutOfBounds: 0,
    turnoverKickedBall: 0,
    turnoverLaneViolation: 0,
    turnoverLostBall: 0,
    turnoverLostBallOutOfBounds: 0,
    turnoverOffensiveGoaltending: 0,
    turnoverShotClock: 0,
    turnoverStepOutOfBounds: 0,
    turnoverThreeSeconds: 0,
    turnoverTraveling: 0,
    violations: 0,
    violationDoubleLane: 0,
    violationDelayOfGame: 0,
    violationDefensiveGoaltending: 0,
    violationJumpBall: 0,
    violationKickedBall: 0,
    violationLaneViolation: 0,
  };

  let secondsRemaining = 720.0;
  const generalPossessionLengths: number[] = [];
  const fieldGoalPossessionLengths: number[] = [];
  const foulPossessionLengths: number[] = [];
  const reboundPossessionLengths: number[] = [];
  const turnoverPossessionLengths: number[] = [];
  const violationPossessionLengths: number[] = [];

  pbpEvents.forEach((pbpEvent, i) => {
    const pbpType = getPossessionType(pbpEvent);
    const pbpId = `${pbpEvent.game_id}-${pbpEvent.event_num}`;
    if (pbpEvent.is_start_of_period || pbpEvent.is_end_of_period) {
      if (secondsRemaining !== 720.0) {
        secondsRemaining = 720.0;
      }

      return;
    }

    if (pbpEvent.is_replay) {
      gameData["replays"]++;
      return;
    }

    if (pbpEvent.is_ejection) {
      gameData["ejections"]++;
      return;
    }

    if (pbpEvent.is_substitution) {
      gameData["substitutionEvents"]++;
      return;
    }

    if (pbpEvent.is_timeout) {
      gameData["timeouts"]++;
      return;
    }

    if (pbpEvent.seconds_remaining !== secondsRemaining) {
      const diff = secondsRemaining - pbpEvent.seconds_remaining;
      generalPossessionLengths.push(diff);
      secondsRemaining = pbpEvent.seconds_remaining;

      if (pbpType === "Field goal") {
        fieldGoalPossessionLengths.push(diff);
      } else if (pbpType === "Rebound") {
        reboundPossessionLengths.push(diff);
      } else if (pbpType === "Turnover") {
        turnoverPossessionLengths.push(diff);
      } else if (pbpType === "Foul") {
        foulPossessionLengths.push(diff);
      } else if (pbpType === "Violation") {
        violationPossessionLengths.push(diff);
      } else {
        throw new Error("Ut oh! What is this??");
      }
    }

    if (pbpEvent.is_possession_ending) {
      gameData["possessionEndingEvents"]++;
    }

    gameData["inPlayPossessions"]++;

    if (pbpEvent.is_foul) {
      const foulEvent = foulEvents[pbpId] as PbpFoul;
      if (foulEvent.is_shooting_foul) {
        gameData["shootingFouls"]++;
      }

      if (foulEvent.is_personal_take_foul) {
        gameData["takeFouls"]++;
      }

      if (foulEvent.is_offensive_foul) {
        gameData["offensiveFouls"]++;
      }

      if (
        !foulEvent.is_personal_foul &&
        !foulEvent.is_loose_ball_foul &&
        !foulEvent.is_personal_take_foul
      ) {
      }
      return;
    }

    if (pbpEvent.is_free_throw) {
      const ftEvent = ftEvents[pbpId] as PbpFt;
      if (ftEvent.is_made) {
        gameData.ftMakes++;
      } else {
        gameData.ftMisses++;
      }
      gameData.ftAttempts++;

      return;
    }

    if (pbpEvent.is_jump_ball) {
      if (pbpEvents[i - 1].is_start_of_period) {
        gameData["periodStartingJumpBalls"]++;
        return;
      } else {
        gameData["tossupJumpBalls"]++;
      }

      return;
    }

    if (pbpEvent.is_field_goal) {
      gameData["totalFgs"]++;
      const fgEvent = fgEvents[pbpId] as PbpFg;

      if (fgEvent.is_and1) {
        gameData["and1s"]++;
      }

      if (fgEvent.shot_type === "Arc3") {
        gameData.arc3s++;
      } else if (fgEvent.shot_type === "LongMidRange") {
        gameData.longMidRanges++;
      } else if (fgEvent.shot_type === "Corner3") {
        gameData.corner3s++;
      } else if (fgEvent.shot_type === "ShortMidRange") {
        gameData.shortMidRanges++;
      } else if (fgEvent.shot_type === "AtRim") {
        gameData.atRims++;
      } else {
        console.log("fgEvent.shot_type", fgEvent.shot_type);
        throw new Error("Bad data");
      }

      if (fgEvent.is_assisted) {
        gameData["assists"]++;
      }
      if (fgEvent.is_blocked) {
        gameData["blocks"]++;
      }
      if (fgEvent.is_heave) {
        gameData["heaves"]++;
      }
      if (fgEvent.is_made) {
        gameData["makes"]++;
      } else {
        gameData["misses"]++;
      }

      if (fgEvent.is_make_that_does_not_end_possession) {
        gameData["makesNoEndPossession"]++;
      }
      if (fgEvent.is_putback) {
        gameData["putbacks"]++;
      }

      if (fgEvent.shot_value === 2) {
        gameData["fg2s"]++;
      } else if (fgEvent.shot_value === 3) {
        gameData["fg3s"]++;
      } else {
        throw new Error("Bad data");
      }
      return;
    }

    if (pbpEvent.is_rebound) {
      const reboundEvent = reboundEvents[pbpId] as PbpRebound;

      if (reboundEvent.is_real_rebound) {
        if (pbpEvent.is_possession_ending) {
          gameData["defRebounds"]++;
        } else {
          gameData["offRebounds"]++;
        }
        gameData["totalRebounds"]++;
      }
      return;
    }

    if (pbpEvent.is_turnover) {
      const turnoverEvent = turnoverEvents[pbpId] as PbpTurnover;
      if (turnoverEvent.is_no_turnover) {
        console.log("NO TURNOVER", turnoverEvent, pbpEvent);
        return;
      }
      gameData["turnovers"]++;
      if (turnoverEvent.is_steal) {
        gameData["steals"]++;
      }
      if (turnoverEvent.is_3_second_violation) {
        gameData["turnoverThreeSeconds"]++;
      }
      if (turnoverEvent.is_bad_pass) {
        gameData["turnoverBadPass"]++;
      }
      if (turnoverEvent.is_bad_pass_out_of_bounds) {
        gameData["turnoverBadPassOutOfBounds"]++;
      }
      if (turnoverEvent.is_kicked_ball) {
        gameData["turnoverKickedBall"]++;
      }
      if (turnoverEvent.is_lane_violation) {
        gameData["turnoverLaneViolation"]++;
      }
      if (turnoverEvent.is_lost_ball) {
        gameData["turnoverLostBall"]++;
      }
      if (turnoverEvent.is_lost_ball_out_of_bounds) {
        gameData["turnoverLostBallOutOfBounds"]++;
      }

      if (turnoverEvent.is_offensive_goaltending) {
        gameData["turnoverOffensiveGoaltending"]++;
      }

      if (turnoverEvent.is_shot_clock_violation) {
        gameData["turnoverShotClock"]++;
      }

      if (turnoverEvent.is_step_out_of_bounds) {
        gameData["turnoverStepOutOfBounds"]++;
      }

      if (turnoverEvent.is_travel) {
        gameData["turnoverTraveling"]++;
      }

      return;
    }

    if (pbpEvent.is_violation) {
      const violationEvent = violationEvents[pbpId] as PbpViolation;
      gameData["violations"]++;

      if (violationEvent.is_double_lane_violation) {
        gameData["violationDoubleLane"]++;
      }

      if (violationEvent.is_goaltend_violation) {
        gameData["violationDefensiveGoaltending"]++;
      }

      if (violationEvent.is_delay_of_game) {
        gameData["violationDelayOfGame"]++;
      }

      if (violationEvent.is_jumpball_violation) {
        gameData["violationJumpBall"]++;
      }
      if (violationEvent.is_kicked_ball_violation) {
        gameData["violationKickedBall"]++;
      }
      if (violationEvent.is_lane_violation) {
        gameData["violationLaneViolation"]++;
      }

      return;
    }

    console.log("pbpEvent", pbpEvent);
  });

  console.log("gameData!!", gameData);
};
