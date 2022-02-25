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
import fs from "fs";
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
  if (!pbpEvent) return;

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

  console.log("pbpEvents.length", pbpEvents.length);

  const fgEvents = objBuilder(fg);
  const foulEvents = objBuilder(foul);
  const ftEvents = objBuilder(ft);
  const jumpBallEvents = objBuilder(jumpBall);
  const reboundEvents = objBuilder(rebound);
  const substitutionEvents = objBuilder(substitution);
  const turnoverEvents = objBuilder(turnover);
  const violationEvents = objBuilder(violation);

  const testes = Object.values(fg);

  const pivotted = dataForge
    .fromJSON(JSON.stringify(testes))
    .pivot(
      [
        "is_and1",
        "is_assisted",
        "is_blocked",
        "is_made",
        "is_putback",
        "shot_type",
      ],
      {
        count: {
          count: (item) => {
            return item.count();
          },
        },
      }
    );

  const pivottedArray = pivotted.toArray().sort((a, b) => b - a);

  const fgType: any = {};

  const values: any = Object.values(pivottedArray).reduce(
    (a: any, b: any) => a + b.count,
    0
  );

  pivottedArray.forEach((event: any) => {
    let stringHolder = event.shot_type;

    if (event.is_and1) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    if (event.is_assisted) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    if (event.is_blocked) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    if (event.is_made) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    if (event.is_putback) {
      stringHolder += 1;
    } else {
      stringHolder += 0;
    }

    fgType[stringHolder] = event.count / values;
  });

  console.log("fgType", fgType);
  console.log("testes.length", testes.length);

  console.log("values", values);

  const gameData = {
    block: 0,
    ejection: 0,
    fg2: 0,
    fg3: 0,
    fgAnd1: 0,
    fgArc3: 0,
    fgAssist: 0,
    fgAtRim: 0,
    fgCorner3: 0,
    fgHeave: 0,
    fgLongMidRange: 0,
    fgMake: 0,
    fgMakeNoEndPossession: 0,
    fgMiss: 0,
    fgPutback: 0,
    fgShortMidRange: 0,
    fgTotal: 0,
    foulCharge: 0,
    foulDefenseNonShooting: 0,
    foulFlagrant: 0,
    foulLooseBall: 0,
    foulOffensive: 0,
    foulOffensiveTotal: 0, //counts charges, too
    foulPersonal: 0,
    foulShooting: 0,
    foulTake: 0,
    foulTechnical: 0,
    ftAttempt: 0,
    ftMake: 0,
    ftMiss: 0,
    inPlayPossession: 0,
    jumpBallPeriodStarting: 0,
    jumpBallTossup: 0,
    possessionEndingEvents: 0,
    reboundDef: 0,
    reboundOff: 0,
    reboundTotal: 0,
    replay: 0,
    steal: 0,
    substitution: 0,
    timeout: 0,
    totalEvents: pbpEvents.length,
    turnover: 0,
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
    violation: 0,
    violationDelayOfGame: 0,
    violationDefensiveGoaltending: 0,
    violationDoubleLane: 0,
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

  let multipleEventsCollector: Pbp[] = []; //collect events to have access to events that happen at same time, it gets emptied once is_one_of_multiple_events_at_same_time is set to false

  pbpEvents.forEach((pbpEvent, i) => {
    multipleEventsCollector.length = 0;
    if (pbpEvent.is_one_of_multiple_events_at_same_time) {
      let previousEventIsPartOfMultiple = true;
      let nextEventIsPartOfMultiple = true;
      let previousCounter = i - 1;
      let nextCounter = i + 1;

      while (previousEventIsPartOfMultiple) {
        if (
          pbpEvents[previousCounter].is_one_of_multiple_events_at_same_time &&
          pbpEvent.seconds_remaining ===
            pbpEvents[previousCounter].seconds_remaining
        ) {
          multipleEventsCollector.push(pbpEvents[previousCounter]);
          previousCounter--;
        } else {
          previousEventIsPartOfMultiple = false;
        }
      }

      while (nextEventIsPartOfMultiple) {
        if (
          pbpEvents[nextCounter].is_one_of_multiple_events_at_same_time &&
          pbpEvent.seconds_remaining ===
            pbpEvents[nextCounter].seconds_remaining
        ) {
          multipleEventsCollector.push(pbpEvents[nextCounter]);
          nextCounter++;
        } else {
          nextEventIsPartOfMultiple = false;
        }
      }
    }

    if (multipleEventsCollector.length > 0) {
      const eventNums = new Set();
      multipleEventsCollector.forEach(({ event_num }: { event_num: any }) => {
        eventNums.add(event_num);
      });

      if (eventNums.size !== multipleEventsCollector.length) {
        throw new Error("Ut oh! There's a problem here");
      }
    }

    const previousEvent = pbpEvents[i - 1];
    const nextEvent = pbpEvents[i + 1];
    const pbpType = getPossessionType(pbpEvent);
    const previousEventType = getPossessionType(previousEvent);
    const nextEventType = getPossessionType(nextEvent);
    const pbpId = `${pbpEvent.game_id}-${pbpEvent.event_num}`;
    if (pbpEvent.is_start_of_period || pbpEvent.is_end_of_period) {
      if (secondsRemaining !== 720.0) {
        secondsRemaining = 720.0;
      }

      return;
    }

    if (pbpEvent.is_replay) {
      gameData["replay"]++;
      return;
    }

    if (pbpEvent.is_ejection) {
      gameData["ejection"]++;
      return;
    }

    if (pbpEvent.is_substitution) {
      gameData["substitution"]++;
      return;
    }

    if (pbpEvent.is_timeout) {
      gameData["timeout"]++;
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

    gameData["inPlayPossession"]++;

    if (pbpEvent.is_foul) {
      const foulEvent = foulEvents[pbpId] as PbpFoul;

      if (foulEvent.is_shooting_foul) {
        const isAnd1 = multipleEventsCollector.some(
          (event) => event.is_field_goal
        );
        if (!isAnd1) {
          const ftPbpEvents = multipleEventsCollector.filter(
            (event) => event.is_free_throw
          );
        }

        gameData["foulShooting"]++;
      }

      if (foulEvent.is_personal_take_foul) {
        gameData["foulTake"]++;
        gameData["foulDefenseNonShooting"]++;
      }

      if (foulEvent.is_offensive_foul) {
        gameData["foulOffensive"]++;
        gameData["foulOffensiveTotal"]++;
      }

      if (foulEvent.is_charge) {
        gameData["foulCharge"]++;
        gameData["foulOffensiveTotal"]++;
      }

      if (foulEvent.is_technical) {
        gameData["foulTechnical"]++;
      }

      if (foulEvent.is_personal_foul) {
        gameData["foulPersonal"]++;
        gameData["foulDefenseNonShooting"]++;
      }

      if (foulEvent.is_loose_ball_foul) {
        gameData["foulLooseBall"]++;
        gameData["foulDefenseNonShooting"]++;
      }

      if (foulEvent.is_flagrant) {
        gameData["foulFlagrant"]++;
      }

      return;

      //TODO: Handle fouls that count towards penalty
    }

    if (pbpEvent.is_free_throw) {
      const ftEvent = ftEvents[pbpId] as PbpFt;
      if (ftEvent.is_made) {
        gameData.ftMake++;
      } else {
        gameData.ftMiss++;
      }
      gameData.ftAttempt++;

      return;
    }

    if (pbpEvent.is_jump_ball) {
      if (pbpEvents[i - 1].is_start_of_period) {
        gameData["jumpBallPeriodStarting"]++;
        return;
      } else {
        gameData["jumpBallTossup"]++;
      }

      return;
    }

    if (pbpEvent.is_field_goal) {
      gameData["fgTotal"]++;
      const fgEvent = fgEvents[pbpId] as PbpFg;

      if (fgEvent.is_and1) {
        gameData["fgAnd1"]++;
      }

      if (fgEvent.shot_type === "Arc3") {
        gameData.fgArc3++;
      } else if (fgEvent.shot_type === "LongMidRange") {
        gameData.fgLongMidRange++;
      } else if (fgEvent.shot_type === "Corner3") {
        gameData.fgCorner3++;
      } else if (fgEvent.shot_type === "ShortMidRange") {
        gameData.fgShortMidRange++;
      } else if (fgEvent.shot_type === "AtRim") {
        gameData.fgAtRim++;
      } else {
        console.error("fgEvent.shot_type", fgEvent.shot_type);
        throw new Error("Bad data");
      }

      if (fgEvent.is_assisted) {
        gameData["fgAssist"]++;
      }
      if (fgEvent.is_blocked) {
        gameData["block"]++;
      }
      if (fgEvent.is_heave) {
        gameData["fgHeave"]++;
      }
      if (fgEvent.is_made) {
        gameData["fgMake"]++;
      } else {
        gameData["fgMiss"]++;
      }

      if (fgEvent.is_make_that_does_not_end_possession) {
        gameData["fgMakeNoEndPossession"]++;
      }
      if (fgEvent.is_putback) {
        gameData["fgPutback"]++;
      }

      if (fgEvent.shot_value === 2) {
        gameData["fg2"]++;
      } else if (fgEvent.shot_value === 3) {
        gameData["fg3"]++;
      } else {
        throw new Error("Bad data");
      }
      return;
    }

    if (pbpEvent.is_rebound) {
      const reboundEvent = reboundEvents[pbpId] as PbpRebound;

      if (reboundEvent.is_real_rebound) {
        if (pbpEvent.is_possession_ending) {
          gameData["reboundDef"]++;
        } else {
          gameData["reboundOff"]++;
        }
        gameData["reboundTotal"]++;
      }
      return;
    }

    if (pbpEvent.is_turnover) {
      const turnoverEvent = turnoverEvents[pbpId] as PbpTurnover;
      if (turnoverEvent.is_no_turnover) {
        console.log("NO TURNOVER", turnoverEvent, pbpEvent);
        return;
      }
      gameData["turnover"]++;
      if (turnoverEvent.is_steal) {
        gameData["steal"]++;
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
      gameData["violation"]++;

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

    // console.log("pbpEvent", pbpEvent);
  });

  console.log("gameData!!", gameData);

  const possessionOutcomeTotalEvents =
    gameData.fgTotal +
    gameData.foulDefenseNonShooting +
    gameData.foulOffensiveTotal +
    gameData.jumpBallTossup +
    gameData.turnover +
    gameData.violation;

  const possessionOutcomeProbability = {
    NON_SHOOTING_DEFENSIVE_FOUL:
      gameData.foulDefenseNonShooting / possessionOutcomeTotalEvents,
    JUMP_BALL: gameData.jumpBallTossup / possessionOutcomeTotalEvents,
    OFFENSIVE_FOUL: gameData.foulOffensiveTotal / possessionOutcomeTotalEvents,
    FIELD_GOAL: gameData.fgTotal / possessionOutcomeTotalEvents,
    TURNOVER: gameData.turnover / possessionOutcomeTotalEvents,
    VIOLATION: gameData.violation / possessionOutcomeTotalEvents,
  };

  fs.writeFileSync(
    "./src/data/probabilities/possessionOutcomes.json",
    JSON.stringify(possessionOutcomeProbability)
  );

  const fgProbability = {
    isFouled: gameData.foulShooting / gameData.fgTotal,
    isMade: gameData.fgMake / gameData.fgTotal,
  };

  fs.writeFileSync(
    "./src/data/probabilities/fg.json",
    JSON.stringify(fgProbability)
  );

  const turnoverProbability = {};
  fs.writeFileSync(
    "./src/data/probabilities/turnover.json",
    JSON.stringify(turnoverProbability)
  );

  const violationProbability = {};
  fs.writeFileSync(
    "./src/data/probabilities/violation.json",
    JSON.stringify(violationProbability)
  );
};
