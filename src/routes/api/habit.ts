import Koa from "koa";
import Router from "koa-router";
import moment from "moment";
import { includes, isEmpty, filter, equals } from "ramda";
import { isAuthenticated } from "../../auth";
import Daily, { DailyState } from "../../models/Daily";
import User from "../../models/User";
import Habit, { validateHabitData } from "../../models/Habit";
import {
  startOfISOWeek,
  lastDayOfISOWeek,
  eachDayOfInterval,
  startOfDay,
  isBefore,
  getISOWeek,
} from "date-fns";
import habit from "test/api/habit";

async function addHabitToUser(ctx: Koa.Context) {
  if (!validateHabitData(ctx.request.body)) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }
  const payload = ctx.request.body;

  const habit = new Habit({ ...payload });
  await habit.save();

  await User.findByIdAndUpdate(ctx.state.user._id, {
    $push: { habitList: habit },
  });

  ctx.status = 201;
  ctx.body = habit;
}

async function getUserHabits(ctx: Koa.Context) {
  const user = await User.findById(ctx.state.user).populate("habitList");
  ctx.status = 200;
  ctx.body = user.habitList;
}

async function getWeeklyHabits(ctx: Koa.Context) {
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

  const user = await User.findById(ctx.state.user).populate(
    "habitList",
    "name not frequency"
  );

  const habits = user.habitList;

  const dailyList = await Daily.find({
    date: {
      $gte: start,
      $lte: end,
    },
    habit: {
      $in: habits,
    },
  }).select("date value habit");

  const data = habits.reduce((acc, habit) => {
    const habitData = {
      habit,
      dailyList: filter((daily) => {
        return equals(habit._id, daily.habit);
      }, dailyList),
    };
    return [...acc, habitData];
  }, []);

  ctx.status = 200;
  ctx.body = data;
}

async function setDailyHabitState(ctx: Koa.Context) {
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

  // check habit ownership
  if (!includes(daily.habit, ctx.state.user.habitList)) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }
  daily.value = payload.value;
  await daily.save();

  ctx.status = 200;
  ctx.body = daily;
}

export default (router: Router) => {
  router.post("/habits", isAuthenticated(), addHabitToUser);
  router.get("/habits", isAuthenticated(), getUserHabits);
  router.put(
    "/habits/:habit/dailys/:daily",
    isAuthenticated(),
    setDailyHabitState
  );
  router.get("/habits/weekly", isAuthenticated(), getWeeklyHabits);
};
