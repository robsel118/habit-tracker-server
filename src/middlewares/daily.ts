import Koa from "koa";
import Daily, { DailyState } from "../models/Daily";

export async function retrieveDailyList(ctx: Koa.Context, next: Koa.Next) {
  const dailyList = await Daily.find({
    date: {
      $gte: ctx.state.dateStart,
      $lte: ctx.state.dateEnd,
    },
    habit: ctx.params.habit || {
      $in: ctx.state.user.habitList,
    },
  });

  ctx.state.dailyList = dailyList;

  return next();
}

export async function updateDailyHabitState(ctx: Koa.Context, next: Koa.Next) {
  // assuming the habit is already created
  // - [x] update state
  // - [] update Streak

  const payload = ctx.request.body;

  if (isNaN(payload.value) || payload.value == DailyState.IMPLICITLY_DONE) {
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

  if (daily.value != DailyState.IMPLICITLY_DONE) {
    daily.value = payload.value;
    await daily.save();
  }

  // TODO update Streak
  // await for next middle ware to update the streaks
  // await next();

  ctx.status = 200;
  ctx.body = daily;
}
