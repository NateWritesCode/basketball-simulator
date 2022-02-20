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
import { Pbp, PbpFg, PbpFoul, PbpFt, PbpRebound } from "../types/pbpParse";

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
    shortMidRanges: 0,
    shootingFouls: 0,
    substitutionEvents: 0,
    takeFouls: 0,
    timeouts: 0,
    tossupJumpBalls: 0,
    totalFgs: 0,
    totalRebounds: 0,
    totalEvents: pbpEvents.length,
  };

  pbpEvents.forEach((pbpEvent, i) => {
    const pbpId = `${pbpEvent.game_id}-${pbpEvent.event_num}`;
    if (pbpEvent.is_start_of_period || pbpEvent.is_end_of_period) {
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

    if (pbpEvent.is_foul) {
      const foulEvent = foulEvents[pbpId] as PbpFoul;
      if (foulEvent.is_shooting_foul) {
        gameData["shootingFouls"]++;
        return;
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
        return;
      }
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
      } else {
        return;
      }
    }

    if (pbpEvent.is_possession_ending) {
      gameData["possessionEndingEvents"]++;
    }

    gameData["inPlayPossessions"]++;
  });

  console.log("gameData", gameData);
};
