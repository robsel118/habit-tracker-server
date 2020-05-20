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
        done(null, false, { message: "E-mail not associated to an account." });
      }

      const match = await bcrypt.compare(password, user.hash);

      if (!match) {
        done(null, false, { message: "Incorrect password." });
      }

      done(null, user);
    } else {
      done(null, false, { message: "Email or password missing." });
    }
  } catch (error) {
    done(error);
  }
});
