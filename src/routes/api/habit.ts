import Koa from "koa";
import Router from "koa-router";
import { isAuthenticated } from "../../auth";
import User from "../../models/User";
import Habit, { validateHabitData } from "../../models/Habit";

async function addHabitToUser(ctx: Koa.Context) {
  const user = await User.findById(ctx.state.user);
  if (validateHabitData(ctx.request.body)) {
    const payload = ctx.request.body;
    const habit = new Habit({ ...payload });
    await habit.save();
    user.habits.push(habit);
    await user.save();

    ctx.status = 200;
    ctx.body = {
      user,
      habit,
    };
  } else {
    ctx.body = { status: "error", message: "Invalid data" };
    ctx.status = 400;
  }
}

export default (router: Router) => {
  // Sanity check function
  router.post("/habit/new", isAuthenticated(), addHabitToUser);
};
