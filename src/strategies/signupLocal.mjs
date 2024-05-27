import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  "register.strategy",
  new Strategy(
    { usernameField: "login", passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const newUserLogin = username;
        const isLoginExist = await User.findOne({ login: newUserLogin });

        if (isLoginExist) {
          // return res.status(400).send({ msg: "This login already exists" });
          throw new Error("This login already exists");
        }

        const newUser = new User({
          login: username,
          password: password,
          name: req.body.name,
          userImg: "http://localhost:4000/images/img.png",
          nfts: {
            characters: [],
            planets: [],
            items: [],
            bundles: [],
          },
        });

        const result = await newUser.save();
        done(null, newUser);
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);
