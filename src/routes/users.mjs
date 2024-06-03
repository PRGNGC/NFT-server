import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken";
import { checkTokens } from "../middleware/checkTokens.mjs";
import { renewTokens } from "../middleware/renewTokens.mjs";

const router = Router();
//SESSION AUTHENTICATION
// router.get("/api/user", (req, res) => {
//   const user = req.user;
//   console.log("cookie - " + req.headers.cookie);

//   if (!user) {
//     return res.status(401).json({ msg: "You are not logged in" });
//   }

//   return res.status(200).send({ user: user });
// });

//JWT AUTHENTICATION
router.get("/api/user", checkTokens, renewTokens, async (req, res) => {
  console.log("user")
  try {
    if(res.locals.restart){
      res.clearCookie("refreshToken");
      return res.sendStatus(440);
    }
    if(res.locals.login){
      return res.sendStatus(401);
    }
    const accessToken = res.locals.refresh ? res.locals.newAccessToken : req.headers.authorization.split(" ")[1];
    const refreshToken = res.locals.refresh ? res.locals.newRefreshToken : req.headers.cookie.split("=")[1];
    
    const accessTokenInfo = jwt.verify(accessToken, process.env.ACCESS_SIGNATURE_SECRET);

    const accessTokenAge = accessTokenInfo.exp;

    const userLogin = accessTokenInfo.login;

    const user = await User.findOne({ login: userLogin });

    res.cookie("refreshToken", refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_TIMESTAMP,
      httpOnly: true,
      // sameSite: "strict",
      // secure: true,
      // path: '/'
    });
    
    return res.status(200).json({ 
      user,
      accessToken: accessToken,
      expiresAt: accessTokenAge
    });
  } catch (err) {
    console.log("router.get ~ err:", err)
    return res.sendStatus(500);
  }
});

export default router;
