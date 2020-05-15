import Koa from "koa";
import Router from "koa-router";
import User, { validatePayload } from "../../models/User";
import { authEmail, generateToken } from "../../auth";

async function registerUser(ctx: Koa.Context, next) {
  const { name, email, password } = ctx.request.body;

  let user = await User.findOne({ email });
  if (name && email && password && validatePayload(ctx.request.body)) {
    if (!user) {
      user = new User({ name, email });

      await user.setHash(password);
      await user.save();

      ctx.state = {
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
  router.post("/auth/register", registerUser, generateToken());
  router.post("/auth", authEmail(), generateToken());
};
