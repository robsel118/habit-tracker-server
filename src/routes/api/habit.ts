import Router from "koa-router";
import { isAuthenticated } from "../../auth";

import * as _habit from "../../middlewares/habit";
import * as _daily from "../../middlewares/daily";

export default (router: Router) => {
  router.get(
    "/habits",
    isAuthenticated(),
    _habit.retrieveHabits,
    _habit.getUserHabits
  );
  router.post(
    "/habits",
    isAuthenticated(),
    _habit.validateHabitPayload,
    _habit.addHabitToUser
  );
  router.get(
    "/habits/weekly",
    isAuthenticated(),
    _habit.extractDateRange,
    _habit.retrieveHabits,
    _habit.buildMissingDailyList,
    _daily.retrieveDailyList,
    _habit.getWeeklyHabits
  );
  router.put(
    "/habits/:habit",
    isAuthenticated(),
    _habit.validateHabitPayload,
    _habit.checkHabitOwnership,
    _habit.updateHabit
  );
  router.put(
    "/habits/:habit/dailys/:daily",
    isAuthenticated(),
    _habit.checkHabitOwnership,
    _daily.updateDailyHabitState,
    _daily.retrieveDailyList
  );
};
