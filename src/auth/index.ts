import jwt from "jsonwebtoken";
import passport from "koa-passport";
import User from "../models/User";

import * as compose from "koa-compose";

import jwtStrategy from "./strategies/jwt";
import emailStrategy from "./strategies/email";

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
  return async (ctx) => {
    const { user } = ctx.passport;
    if (user === false) {
      ctx.status = 401;
    } else {
      const jwtToken = jwt.sign({ id: user }, process.env.PASSPORT_SECRET, {
        expiresIn: 60 * 60,
      });
      const token = `JWT ${jwtToken}`;

      const currentUser = await User.findOne({ _id: user });

      ctx.status = 200;
      ctx.body = {
        token,
        user: currentUser,
      };
    }
  };
}
