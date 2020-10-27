import Router from "koa-router";
import { isAuthenticated } from "../../auth";
import { handleErrors } from '../../utils/errors'
import * as _habit from "../../middlewares/habit";
import * as _daily from "../../middlewares/daily";

export default (router: Router) => {
  router.get(
    "/habits",
    isAuthenticated(),
    _habit.getUserHabits
  );
  router.post(
    "/habits",
    isAuthenticated(),
    handleErrors(_habit.addHabitToUser)
  );
  router.get(
    "/habits/weekly",
    isAuthenticated(),
    _habit.extractDateRange,
    _habit.buildMissingDailyList,
    _daily.retrieveDailyList,
    _habit.getWeeklyHabits
  );
  router.put(
    "/habits/:habit",
    isAuthenticated(),
    handleErrors(_habit.updateHabit)
  );
  router.put(
    "/habits/:habit/dailys/:daily",
    isAuthenticated(),
    handleErrors(_daily.updateDailyHabitState)
  );
};
