import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";

import User from "../../models/User";

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRET,
};

export default new JWTStrategy(opts, async (jwtPayload, done) => {
  const user = await User.findById(jwtPayload.id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});
