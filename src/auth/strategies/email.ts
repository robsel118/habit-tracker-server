import { Strategy as CustomStrategy } from "passport-custom";
import User from "../../models/User";
import bcrypt from "bcrypt";

export default new CustomStrategy(async (ctx, done) => {
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
