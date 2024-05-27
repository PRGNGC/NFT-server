import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { getTokens, refreshTokenAge } from "../utils/getTokens.mjs";
import jwt from "jsonwebtoken";

const router = new Router();

router.post("/api/login", async (req, res) => {
  const { login, password } = req.body;

  console.log(getTokens(login));

  const user = await User.findOne({ login: login });

  if (!user) {
    return res.status(404).send({ msg: "User not registered" });
  }

  if (user.password !== password) {
    return res.status(404).send({ msg: "Incorrect credentials" });
  }

  const { accessToken, refreshToken } = getTokens(login);

  res.cookie("refreshToken", refreshToken, {
    maxAge: refreshTokenAge,
    httpOnly: true,
  });

  res.status(200).send({ accessToken });
});

router.post("/api/logout", (req, res) => {
  const { accessToken } = req.body;
  try {
    // const verifyToken = jwt.verify(accessToken, "token_access");
    res.clearCookie("refreshToken");
    return res.status(200).send({ msg: "You are logged out" });
  } catch (err) {
    console.log("logout error happened");
    return res.status(200).send({ msg: "Error happened" });
  }
});

router.post("/api/signup", async (req, res) => {
  const { login, password, name } = req.body;

  const isSuchLoginExists = await User.findOne({ login: login });
  if (isSuchLoginExists) {
    return res.status(400).send({ msg: "Login already exists" });
  }

  const newUser = await User({
    login: login,
    password: password,
    name: name,
    userImg: "http://localhost:4000/images/img.png",
    nfts: {
      characters: [],
      planets: [],
      items: [],
      bundles: [],
    },
  });

  const result = await newUser.save();

  const { accessToken, refreshToken } = getTokens(login);

  res.cookie("refreshToken", refreshToken, {
    maxAge: refreshTokenAge,
    httpOnly: true,
  });

  res.status(200).send({ accessToken });
});

router.get("/api/refresh", (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    const verifyRefreshToken = jwt.verify(refreshTokenCookie, "token_refresh");

    const { accessToken, refreshToken } = getTokens(login);

    res.cookie("refreshToken", refreshToken, {
      maxAge: refreshTokenAge,
      httpOnly: true,
    });

    res.status(200).send({ accessToken });
  } catch (err) {
    console.log("error happened");
  }
});

export default router;
