import { Strategy as CustomStrategy } from "passport-custom";
import { VerifiedCallback } from "passport-local";
import bcrypt from "bcrypt";

import User from "../../models/User";

export default new CustomStrategy(async (ctx, done: VerifiedCallback) => {
  try {
    if (ctx.body.email && ctx.body.password) {
      const { email, password } = ctx.body;

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        done(null, false);
      }

      const match = await bcrypt.compare(password, user.hash);

      if (!match) {
        done(null, false);
      }

      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error);
  }
});
