import {
  Strategy as JWTStrategy,
  ExtractJwt,
  VerifiedCallback,
} from "passport-jwt";

import User from "../../models/User";
import { config } from "../config";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
};

export default new JWTStrategy(
  opts,
  async (jwtPayload, done: VerifiedCallback) => {
    const user = await User.findById(jwtPayload.id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  }
);
