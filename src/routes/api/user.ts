import Koa from "koa";
import Router from "koa-router";
import { isAuthenticated } from "../../auth";
import User from "../../models/User";

export default (router: Router) => {
  router.get("/user/me", isAuthenticated(), async (ctx: Koa.Context) => {
    const user = await User.findById(ctx.state.user);

    if (user) ctx.body = { response: user };
  });
};
