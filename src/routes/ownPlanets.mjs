import { Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/api/own/planets", async (req, res) => {
  const refreshToken = req.headers.cookie.split("=")[1];
  const userObj = jwt.verify(refreshToken, "token_refresh");
  const userId = userObj.login;

  const userByLogin = await User.findOne({ login: userId });
  const planets = userByLogin.nfts.planets;
  const limit = 5;

  console.log();

  if (req.query.search) {
    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let planetsWithQuery = [];

    for (let i = nextSearchIndex; i < planets.length; i++) {
      if (planetsWithQuery.length === 5) break;

      if (
        planets[i].nftName.toLowerCase().includes(query.toLowerCase()) &&
        planetsWithQuery.length <= limit - 1
      ) {
        planetsWithQuery.push(planets[i]);
        lastIndex = i;
      }
    }

    return res.json({
      nfts: planetsWithQuery,
      nextSearchIndex: lastIndex + 1,
    });
  }

  const page = req.query.page - 1;

  return res.json(
    planets.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    )
  );
});

router.get("/api/own/planets/:id", (req, res) => {
  const passedCharacterId = req.params.id;

  const filteredPlanets = planets.find(
    (character) => character.id === passedCharacterId
  );

  if (filteredPlanets.length === 0) {
    return res.status(400).send({ msg: "This character was not found" });
  }

  return res.status(200).send(filteredPlanets);
});

export default router;
