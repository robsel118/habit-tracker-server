import Koa from "koa";
import Router from "koa-router";
import { isAuthenticated } from "../../auth";
import Completion from "../../models/Completion";

export default (router: Router) => {
  // Sanity check function
  router.post("/complete", isAuthenticated(), async (ctx: Koa.Context) => {
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
  });
};
