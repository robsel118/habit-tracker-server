import Koa from "koa";
import Router from "koa-router";
import moment from "moment";
import { includes, isEmpty } from "ramda";
import { isAuthenticated } from "../../auth";
import Daily, { DailyState } from "../../models/Daily";
import Habit, { validateHabitData } from "../../models/Habit";
import {
  startOfISOWeek,
  lastDayOfISOWeek,
  eachDayOfInterval,
  startOfDay,
  isBefore,
  getISOWeek,
} from "date-fns";

async function addHabitToUser(ctx: Koa.Context) {
  if (!validateHabitData(ctx.request.body)) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }
  const payload = ctx.request.body;

  const habit = new Habit({ ...payload, user: ctx.state.user });

  await habit.save();

  ctx.status = 201;
  ctx.body = habit;
}

async function getUserHabits(ctx: Koa.Context) {
  const habitList = await Habit.find({ user: ctx.state.user }).populate(
    "habits"
  );

  ctx.status = 200;
  ctx.body = habitList;
}

async function getDailyHabitsState(ctx: Koa.Context) {
  const payload = ctx.request.body;

  //d efault to current week
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
  console.log(ctx.params.id);
  const habit = await Habit.findById(ctx.params.id).populate({
    path: "dailyList",
    match: {
      date: {
        $gte: start,
        $lte: end,
      },
    },
    select: "value date",
    model: "Daily",
  });

  //Initialize the week on the first query of the week
  // NOT IDEAL MUST be redone
  // if (
  //   isEmpty(habit.dailyList) &&
  //   getISOWeek(start) == getISOWeek(moment().toDate())
  // ) {
  //   const dailyList = habit.buildWeeklyHabit();
  //   const newDailyList = await Daily.create(dailyList);

  //   await habit.save();
  // }
  // const daily = await Daily.find({});
  ctx.status = 200;
  ctx.body = habit;
}

async function setDailyHabitState(ctx: Koa.Context) {
  // assuming the habit is already created
  // - [x] update state
  // - [] update Streak

  const payload = ctx.request.body;

  if (payload.daily || payload.date || payload.value || payload.value !== 1) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }

  const habit = await Habit.findById(ctx.params.id);

  if (
    habit.user != ctx.state.user ||
    !includes(payload.daily, habit.dailyList)
  ) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }

  const daily = await Daily.findOneAndUpdate(
    {
      daily: payload.daily,
      date: startOfDay(payload.date),
    },
    { value: payload.value },
    { new: payload.value }
  );

  ctx.status = 200;
  ctx.body = daily;
}

export default (router: Router) => {
  router.post("/habits", isAuthenticated(), addHabitToUser);
  router.get("/habits", isAuthenticated(), getUserHabits);
  router.put(
    "/habits/:id/checkDailyHabit",
    isAuthenticated(),
    setDailyHabitState
  );
  router.get(
    "/habits/:id/checkDailyHabit",
    isAuthenticated(),
    getDailyHabitsState
  );
};
