import Koa from "koa";
import { includes, filter, equals } from "ramda";
import moment from "moment";
import {
  startOfISOWeek,
  lastDayOfISOWeek,
  startOfDay,
  isBefore,
  isSameDay,
} from "date-fns";
import { DailyState, DailyType } from "../models/Daily";
import User from "../models/User";
import Daily from "../models/Daily";
import Habit, { validateHabitData } from "../models/Habit";
import { BAD_REQUEST } from "../utils/errors";

export async function checkHabitOwnership(ctx: Koa.Context, next: Koa.Next) {
  if (!includes(ctx.params.habit, ctx.state.user.habitList))
    ctx.throw(400, BAD_REQUEST);

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

  if (isBefore(end, start)) ctx.throw(400, BAD_REQUEST);

  // store dates for next middleware
  ctx.state.dateStart = start;
  ctx.state.dateEnd = end;

  return next();
}

export async function validateHabitPayload(ctx: Koa.Context, next: Koa.Next) {
  if (!validateHabitData(ctx.request.body)) ctx.throw(400, BAD_REQUEST);

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

// Checks the last connection time and builds the dailys in-between
export async function buildMissingDailyList(ctx: Koa.Context, next: Koa.Next) {
  const today = new Date();

  if (!isSameDay(ctx.state.user.lastConnected, today)) {
    const dailys: DailyState[] = [];
    ctx.state.habits.forEach((habit) => {
      dailys.push(...habit.buildDailys(ctx.state.user.lastConnected, today));
    });

    await Daily.insertMany(dailys);

    ctx.state.user.lastConnected = today;

    await User.findByIdAndUpdate(ctx.state.user._id, {
      lastConnected: ctx.state.user.lastConnected,
    });
  }

  return next();
}

export async function getUserHabits(ctx: Koa.Context) {
  ctx.status = 200;
  ctx.body = ctx.state.habits;
}
