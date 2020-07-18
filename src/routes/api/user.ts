import Koa from "koa";
import Router from "koa-router";
import { valuesIn, defaultTo, keys, contains, keysIn } from "ramda";
import moment from "moment";
import {
  startOfISOWeek,
  endOfISOWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
} from "date-fns";
import { isAuthenticated } from "../../auth";
import User from "../../models/User";
import Daily from "../../models/Daily";

const defaultTocurrentDay = defaultTo(new Date().toISOString());

// async function getWeekStats(ctx: Koa.Context) {
//   const requestedDate = moment(
//     defaultTocurrentDay(ctx.request.body.date)
//   ).toDate();

//   const query = await Daily.find({
//     user: ctx.state.user,
//     date: {
//       $gte: startOfISOWeek(requestedDate),
//       $lte: endOfISOWeek(requestedDate),
//     },
//   });

//   const user = await User.findById(ctx.state.user)
//     .select("habits")
//     .populate("habits");

//   ctx.status = 200;
//   ctx.body = { habits: user.habits, progress: query };
// }

// async function getMonthStats(ctx: Koa.Context) {
//   const requestedDate = moment(
//     defaultTocurrentDay(ctx.request.body.date)
//   ).toDate();

//   const query = await Daily.find({
//     user: ctx.state.user,
//     date: {
//       $gte: startOfMonth(requestedDate),
//       $lte: endOfMonth(requestedDate),
//     },
//   });

//   ctx.status = 200;
//   ctx.body = query;
// }

// async function getAnnualStats(ctx: Koa.Context) {
//   const requestedDate = moment(
//     defaultTocurrentDay(ctx.request.body.date)
//   ).toDate();

//   const query = await Daily.find({
//     user: ctx.state.user,
//     date: {
//       $gte: startOfYear(requestedDate),
//       $lte: endOfYear(requestedDate),
//     },
//   });

//   const user = await User.findById(ctx.state.user)
//     .select("habits")
//     .populate("habits");

//   const progress = {};

//   user.habits.forEach((habit) => {
//     progress[habit._id.toString()] = {
//       _id: habit._id.toString(),
//       name: habit.name,
//       completed: 0,
//       total: 0,
//     };

//     const week = moment().isoWeeks();
//     const firstDayOfTheYear = moment(startOfYear(new Date())).isoWeekday();

//     // check how many are supposed to be done
//     habit.frequency.forEach((day) => {
//       const recurrence = day <= firstDayOfTheYear - 1 ? week : week - 1;
//       progress[habit._id.toString()].total += recurrence;
//     });
//   });

//   // check how many were completed
//   query.forEach((day) => {
//     day.habits.forEach((value, habit) => {
//       if (value) progress[habit].completed++;
//     });
//   });

//   ctx.status = 200;
//   ctx.body = valuesIn(progress);
// }

// async function setDailyStats(ctx: Koa.Context) {
//   const { date, habit } = ctx.request.body;

//   if (!habit) {
//     ctx.body = { message: "Bad Request" };
//     ctx.status = 400;
//     return;
//   }

//   const requestedDate = moment(defaultTocurrentDay(date)).toDate();

//   let daily = await Daily.findOne({
//     user: ctx.state.user,
//     date: startOfDay(requestedDate),
//   });

//   if (!daily) {
//     const user = await User.findById(ctx.state.user)
//       .select("habits")
//       .populate("habits");

//     daily = new Daily({
//       user: ctx.state.user,
//       date: startOfDay(requestedDate),
//     });

//     daily.setHabits(user.habits);
//   }

//   if (!contains(habit, Array.from(daily.habits.keys()))) {
//     ctx.body = { message: "Bad Request" };
//     ctx.status = 400;
//     return;
//   }

//   daily.toggleHabit(habit);
//   await daily.save();

//   ctx.status = 200;
//   ctx.body = daily;
// }

export default (router: Router) => {
  // router.get("/user/weekly", isAuthenticated(), getWeekStats);
  // router.get("/user/monthly", isAuthenticated(), getMonthStats);
  // router.get("/user/annualy", isAuthenticated(), getAnnualStats);
  // router.put("/user/daily", isAuthenticated(), setDailyStats);
};
