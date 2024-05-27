import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("id - " + id);
    const findUser = await User.findById(id);
    console.log("FindUser - " + findUser);
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  "auth.strategy",
  new Strategy({ usernameField: "login" }, async (username, password, done) => {
    console.log("login - " + username);
    console.log("password - " + password);
    try {
      const findUser = await User.findOne({ login: username });
      console.log("findUser in strategy - " + findUser);
      if (!findUser) throw new Error("user not found");
      if (findUser.password !== password) throw new Error("bad credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
