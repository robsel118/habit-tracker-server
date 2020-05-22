import Koa from "koa";
import Router from "koa-router";

import { isAuthenticated } from "../../auth";
import User from "../../models/User";
import Habit, { validateHabitData } from "../../models/Habit";

async function addHabitToUser(ctx: Koa.Context) {
  const user = await User.findById(ctx.state.user);

  if (!validateHabitData(ctx.request.body)) {
    ctx.body = { message: "Bad Request" };
    ctx.status = 400;
    return;
  }
  const payload = ctx.request.body;

  const habit = new Habit({ ...payload });

  await habit.save();
  user.habits.addToSet(habit);
  await user.save();

  ctx.status = 200;
  ctx.body = {
    user,
    habit,
  };
}

async function getUserHabits(ctx: Koa.Context) {
  const user = await User.findById(ctx.state.user)
    .select("habits")
    .populate("habits");

  ctx.status = 200;
  ctx.body = { habits: user.habits };
}
export default (router: Router) => {
  router.post("/habit", isAuthenticated(), addHabitToUser);
  router.get("/habit", isAuthenticated(), getUserHabits);
};
