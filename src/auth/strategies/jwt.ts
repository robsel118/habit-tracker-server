import {
  Strategy as JWTStrategy,
  ExtractJwt,
  VerifiedCallback,
} from "passport-jwt";

import User from "../../models/User";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRET,
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
