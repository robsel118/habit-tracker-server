import Koa from "koa";
import Router from "koa-router";

import User, { validateNewUserInfo } from "../../models/User";
import { authEmail, generateToken } from "../../auth";
import { BAD_REQUEST } from "../../utils/errors";

async function registerUser(ctx: Koa.Context, next: Koa.Next) {
  const { username, email, password, ...other } = ctx.request.body;

  if (
    !username ||
    !email ||
    !password ||
    !validateNewUserInfo({ username, email, password })
  )
    ctx.throw(400, BAD_REQUEST);

  //Checks it the user already exists
  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) ctx.throw(400, BAD_REQUEST);

  user = new User({ username, email: email.toLowerCase(), ...other });

  await user.setHash(password);
  await user.save();

  ctx.state = {
    user: user._id,
  };

  await next();
}

export default (router: Router) => {
  router.post("/register", registerUser, generateToken());
  router.post("/login", authEmail(), generateToken());
};
