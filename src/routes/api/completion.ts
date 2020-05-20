import Koa from "koa";
import Router from "koa-router";
import { isAuthenticated } from "../../auth";
import Completion from "../../models/Completion";

export default (router: Router) => {
  router.post(
    "/completion/new",
    isAuthenticated(),
    async (ctx: Koa.Context) => {
      const { habit, timestamp } = ctx.request.body;

      if (habit && timestamp) {
        let completion = await Completion.findOne({
          date: timestamp,
          user: ctx.state.user,
        });

        if (!completion) {
          completion = new Completion({
            date: timestamp,
            user: ctx.state.user,
          });
        }
        completion.habits.addToSet(habit);

        await completion.save();

        ctx.body = completion;
        ctx.status = 200;
      } else {
        ctx.body = { message: "Invalid parameter" };
        ctx.status = 400;
      }
    }
  );
  router.get(
    "/completion/weekly",
    isAuthenticated(),
    async (ctx: Koa.Context) => {
      const curr = new Date();
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const firstDayOfTheWeek = new Date(curr.setDate(first + 1)); // add 1 to start on Monday

      const completions = await Completion.find({
        user: ctx.state.user,
        date: { $gte: firstDayOfTheWeek },
      });

      ctx.body = completions;
    }
  );
};
