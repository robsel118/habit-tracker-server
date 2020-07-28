import Koa from "koa";
import { includes, filter, equals } from "ramda";
import moment from "moment";
import {
  startOfISOWeek,
  lastDayOfISOWeek,
  startOfDay,
  isBefore,
} from "date-fns";
import { DailyType } from "../models/Daily";
import User from "../models/User";
import Habit, { validateHabitData } from "../models/Habit";

export async function checkHabitOwnership(ctx: Koa.Context, next: Koa.Next) {
  if (!includes(ctx.params.habit, ctx.state.user.habitList)) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }
  return next();
}

export async function extractDateRange(ctx: Koa.Context, next: Koa.Next) {
  const payload = ctx.request.body;

  //default to current week
  const start = payload.start
    ? startOfDay(new Date(payload.start))
    : startOfISOWeek(moment().toDate());
  const end = payload.end
    ? startOfDay(new Date(payload.end))
    : lastDayOfISOWeek(moment().toDate());

  if (isBefore(end, start)) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }

  // store dates for next middleware
  ctx.state.dateStart = start;
  ctx.state.dateEnd = end;

  return next();
}

export async function validateHabitPayload(ctx: Koa.Context, next: Koa.Next) {
  if (!validateHabitData(ctx.request.body)) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }
  return next();
}

export async function addHabitToUser(ctx: Koa.Context) {
  const payload = ctx.request.body;

  const habit = new Habit({ ...payload });
  await habit.save();

  await User.findByIdAndUpdate(ctx.state.user._id, {
    $push: { habitList: habit },
  });

  ctx.status = 201;
  ctx.body = habit;
}

export async function retrieveHabits(ctx: Koa.Context, next: Koa.Next) {
  const user = await User.findById(ctx.state.user).populate(
    "habitList",
    "name not frequency"
  );
  ctx.state.habits = user.habitList;

  return next();
}

export async function updateHabit(ctx: Koa.Context) {
  const payload = ctx.request.body;
  const habit = await Habit.findByIdAndUpdate(ctx.params.habit, payload, {
    new: true,
  });

  ctx.body = habit;
  ctx.status = 200;
}

export async function getWeeklyHabits(ctx: Koa.Context) {
  const data = ctx.state.habits.reduce((acc, habit) => {
    const habitData = {
      habit,
      dailyList: filter((daily: DailyType) => {
        return equals(habit._id, daily.habit);
      }, ctx.state.dailyList),
    };
    return [...acc, habitData];
  }, []);

  ctx.status = 200;
  ctx.body = data;
}

export async function getUserHabits(ctx: Koa.Context) {
  ctx.status = 200;
  ctx.body = ctx.state.habits;
}
