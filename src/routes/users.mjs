import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken";
import { getTokens, refreshTokenAge } from "../utils/getTokens.mjs";

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
router.get("/api/user", async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const refreshToken = req.headers.cookie.split("=")[1];

  try {
    const verifyRefreshToken = jwt.verify(refreshToken, "token_refresh");
    const refreshTokenTimeLeft =
      verifyRefreshToken.exp - new Date().getTime() / 1000;

    if (refreshTokenTimeLeft <= 0) {
      return res
        .status(401)
        .send({ msg: "Your session is expired. You need to log in again!" });
    }

    console.log("verify refresh token - " + verifyRefreshToken.login);
    if (
      accessToken === "null" ||
      accessToken.exp - new Date().getTime() / 1000 > 0
    ) {
      const { accessToken, refreshToken } = getTokens(verifyRefreshToken.login);

      // console.log("New access token - " + accessToken);
      // console.log("New refresh token - " + refreshToken);

      const user = await User.findOne({ login: verifyRefreshToken.login });
      // console.log("user - ", user);
      // console.log("name2 - ", user.name);
      // console.log("userImg2 - ", user.userImg);
      // console.log("userId2 - ", user.userId);
      // console.log("cover2 - ", user.cover);
      // console.log("c2 - ", user.c);
      res.cookie("refreshToken", refreshToken, {
        maxAge: refreshTokenAge,
        httpOnly: true,
      });
      return res.status(200).send({
        user,
        // user: {
        //   name: user.name,
        //   userImg: user.userImg,
        //   userId: user.userId,
        //   cover: user.cover,
        // },
        accessToken: accessToken,
      });
    }

    const verifyAccessToken = jwt.verify(accessToken, "token_access");
    const user = await User.findOne({ login: verifyAccessToken.login });
    // console.log("user - ", user);
    // console.log("name1 - ", user.name);
    // console.log("userImg1 - ", user.userImg);
    // console.log("userId1 - ", user.userId);
    // console.log("cover1 - ", user.cover);
    // console.log("c1 - ", user.c);
    return res.status(200).send({
      user,
      // user: {
      //   name: user.name,
      //   userImg: user.userImg,
      //   userId: user.userId,
      //   cover: user.cover,
      // },
    });
  } catch (err) {
    console.log(err);
    return res.status(200).send({ msg: err });
  }
});

export default router;
