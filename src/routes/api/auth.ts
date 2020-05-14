import * as Koa from "koa";
import * as Router from "koa-router";
import User from "../../models/User";
import { authEmail, generateToken } from "../../auth";

async function registerUser(ctx: Koa.Context, next) {
  const { name, email, password } = ctx.body;

  let user = await User.findOne({ email });
  if (name && email && password) {
    if (!user) {
      user = new User({ name, email });
      user.setHash(password);

      await user.save();

      ctx.passport = {
        user: user._id,
      };

      await next();
    } else {
      ctx.status = 400;
      ctx.body = { status: "error", message: "E-mail already registered" };
    }
  } else {
    ctx.status = 400;
    ctx.body = { status: "error", message: "Invalid email or password" };
  }
}

export default (router: Router) => {
  router.get("/auth/register", registerUser, generateToken);
  router.get("/auth", authEmail, generateToken);
};
