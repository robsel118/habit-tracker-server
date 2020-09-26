import Koa from "koa";
import jwt from "jsonwebtoken";
import passport from "koa-passport";
import compose from "koa-compose";

import jwtStrategy from "./strategies/jwt";
import emailStrategy from "./strategies/email";
import User from "../models/User";
import { config } from "./config";

passport.use("jwt", jwtStrategy);
passport.use("email", emailStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  (async () => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  })();
});

export default function auth() {
  return compose([passport.initialize()]);
}

export function isAuthenticated() {
  return passport.authenticate("jwt");
}

export function authEmail() {
  return passport.authenticate("email");
}

export function generateToken() {
  return async (ctx: Koa.Context) => {
    const { user } = ctx.state;

    if (user === false) {
      ctx.status = 401;
    } else {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      const jwtToken = jwt.sign(
        { id: user, exp: oneYearFromNow.getTime() },
        config.secret
      );

      // passport-jwt extracts a bearer token instead of JWT token
      const token = `bearer ${jwtToken}`;

      const currentUser = await User.findOne({ _id: user }).select(
        "username email tokenExpiry"
      );
      currentUser.tokenExpiry = oneYearFromNow;

      await currentUser.save();

      ctx.status = 200;
      ctx.body = {
        token,
        user: currentUser,
      };
    }
  };
}
