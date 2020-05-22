import Koa from "koa";
import Router from "koa-router";

import User, { validateNewUserInfo } from "../../models/User";
import { authEmail, generateToken } from "../../auth";

async function registerUser(ctx: Koa.Context, next: Koa.Next) {
  const { username, email, password } = ctx.request.body;

  if (
    !username ||
    !email ||
    !password ||
    !validateNewUserInfo(ctx.request.body)
  ) {
    ctx.status = 400;
    ctx.body = { message: "Bad Request" };
    return;
  }

  //Checks it the user already exists
  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    ctx.status = 400;
    ctx.body = { status: "error", message: "Bad Request" };
    return;
  }

  user = new User({ username, email: email.toLowerCase() });

  await user.setHash(password);
  await user.save();

  ctx.state = {
    user: user._id,
  };

  await next();
}

export default (router: Router) => {
  router.post("/auth/register", registerUser, generateToken());
  router.post("/auth/login", authEmail(), generateToken());
};
