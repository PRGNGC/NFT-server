import { Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/api/own/bundles", async (req, res) => {
  const refreshToken = req.headers.cookie.split("=")[1];
  const userObj = jwt.verify(refreshToken, "token_refresh");
  const userId = userObj.login;

  const userByLogin = await User.findOne({ login: userId });
  const bundles = userByLogin.nfts.bundles;
  const limit = 5;

  console.log();

  if (req.query.search) {
    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let bundlesWithQuery = [];

    for (let i = nextSearchIndex; i < bundles.length; i++) {
      if (bundlesWithQuery.length === 5) break;

      if (
        bundles[i].nftName.toLowerCase().includes(query.toLowerCase()) &&
        bundlesWithQuery.length <= limit - 1
      ) {
        bundlesWithQuery.push(bundles[i]);
        lastIndex = i;
      }
    }

    return res.json({
      nfts: bundlesWithQuery,
      nextSearchIndex: lastIndex + 1,
    });
  }

  const page = req.query.page - 1;

  return res.json(
    bundles.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    )
  );
});

router.get("/api/own/bundles/:id", (req, res) => {
  const passedCharacterId = req.params.id;

  const filteredBundles = bundles.find(
    (character) => character.id === passedCharacterId
  );

  if (filteredBundles.length === 0) {
    return res.status(400).send({ msg: "This character was not found" });
  }

  return res.status(200).send(filteredBundles);
});

export default router;
