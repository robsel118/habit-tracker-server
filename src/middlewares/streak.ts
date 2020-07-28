import Koa from "koa";

import Streak from "../models/Streak";
import Daily, { DailyState } from "../models/Daily";
import moment from "moment";
import { startOfToday, areIntervalsOverlapping } from "date-fns";
import { filter } from "ramda";
export async function rebuildStreak(ctx: Koa.Context) {
  const streakList = await Streak.find({
    habit: ctx.params.habit,
    endDate: {
      $gte: ctx.state.streakStart,
    },
    startDate: {
      $lte: ctx.state.streakStart,
    },
  });

  let startDate: Date = null;
  let lastCompleted: Date = null;

  const streaks = [];

  ctx.state.dailyList.forEach((daily) => {
    if (daily.value === DailyState.EXPLICITLY_DONE) {
      lastCompleted = daily.date;
      if (startDate == null) {
        startDate = daily.date;
      }
    }

    if (daily.value === DailyState.NOT_DONE && lastCompleted) {
      const streak = new Streak({
        habit: ctx.params.habit,
        startDate,
        endDate: lastCompleted,
      });
      streaks.push(streak);
      startDate = null;
      lastCompleted = null;
    }

    // TODO save streaks
  });
}
