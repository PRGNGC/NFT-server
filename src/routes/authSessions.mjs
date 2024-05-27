import { Router } from "express";
import passport from "passport";
import "../strategies/local.mjs";
import "../strategies/signupLocal.mjs";

const router = new Router();

router.post(
  "/api/login",
  passport.authenticate("auth.strategy"),
  (req, res) => {
    console.log("Session ID login server - " + req.sessionID);
    return res.sendStatus(200);
  }
);

router.get("/api/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  return res.status(200).send({ msg: "You are logged out" });
});

router.post(
  "/api/signup",
  passport.authenticate("register.strategy"),
  (req, res) => {
    return res.status(200).send({ msg: "You are signed up" });
  }
);

export default router;
