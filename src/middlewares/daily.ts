import Koa from "koa";
import Daily, { DailyState } from "../models/Daily";
import { BAD_REQUEST } from "../utils/errors";
import { includes } from 'ramda';

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

export async function updateDailyHabitState(ctx: Koa.Context) {
  // assuming the habit is already created
  // - [x] update state
  // - [] update Streak

  const payload = ctx.request.body;

  ctx.assert(includes(ctx.params.habit, ctx.state.user.habitList.map(h => h._id)), 400, BAD_REQUEST)

  if (isNaN(payload.value) || payload.value == DailyState.IMPLICITLY_DONE)
    ctx.throw(400, BAD_REQUEST);

  const daily = await Daily.findOne({
    _id: ctx.params.daily,
    habit: ctx.params.habit,
  });

  ctx.assert(daily, 400, BAD_REQUEST);

  daily.value = payload.value;
  await daily.save();

  // TODO update Streak
  // await for next middle ware to update the streaks
  // await next();

  ctx.status = 200;
  ctx.body = daily;
}
