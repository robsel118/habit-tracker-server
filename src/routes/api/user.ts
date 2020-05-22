import Koa from "koa";
import Router from "koa-router";
import { isAuthenticated } from "../../auth";
import User from "../../models/User";
import Completion from "../../models/Completion";

async function getWeekly(ctx: Koa.Context) {
  const user = await User.findById(ctx.state.user)
    .select("habits")
    .populate("habits");

  const curr = new Date();
  const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  const firstDayOfTheWeek = new Date(curr.setDate(first + 1)); // add 1 to start on Monday

  const completions = await Completion.find({
    user: ctx.state.user,
    date: { $gte: firstDayOfTheWeek },
  }).select("habits date");

  ctx.status = 200;
  ctx.body = { habits: user.habits, completions };
}

export default (router: Router) => {
  router.get("/user/weekly", isAuthenticated(), getWeekly);
};
