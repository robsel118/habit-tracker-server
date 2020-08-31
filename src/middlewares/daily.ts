import Koa from "koa";
import Daily, { DailyState } from "../models/Daily";

export async function retrieveDailyList(ctx: Koa.Context, next: Koa.Next) {
  const dailyList = await Daily.find({
    date: {
      $gte: ctx.state.start,
      $lte: ctx.state.end,
    },
    habit: ctx.params.habit || {
      $in: ctx.state.user.habitList,
    },
  }).select("date value habit");

  ctx.state.dailyList = dailyList;

  return next();
}

export async function updateDailyHabitState(ctx: Koa.Context, next: Koa.Next) {
  // assuming the habit is already created
  // - [x] update state
  // - [] update Streak

  const payload = ctx.request.body;
  if (isNaN(payload.value) || payload.value == DailyState.IMPLICITLT_DONE) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }

  const daily = await Daily.findOne({
    _id: ctx.params.daily,
    habit: ctx.params.habit,
  });

  if (!daily) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }

  daily.value = payload.value;
  await daily.save();

  // await for next middle ware to update the streaks
  await next();
  // TODO update Streak
  ctx.status = 200;
  ctx.body = daily;
}
