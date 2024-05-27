import { Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/api/own/characters", async (req, res) => {
  const refreshToken = req.headers.cookie.split("=")[1];
  const userObj = jwt.verify(refreshToken, "token_refresh");
  const userId = userObj.login;

  const userByLogin = await User.findOne({ login: userId });
  const characters = userByLogin.nfts.characters;
  const limit = 5;

  console.log();

  if (req.query.search) {
    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let charactersWithQuery = [];

    for (let i = nextSearchIndex; i < characters.length; i++) {
      if (charactersWithQuery.length === 5) break;

      if (
        characters[i].nftName.toLowerCase().includes(query.toLowerCase()) &&
        charactersWithQuery.length <= limit - 1
      ) {
        charactersWithQuery.push(characters[i]);
        lastIndex = i;
      }
    }

    return res.json({
      nfts: charactersWithQuery,
      nextSearchIndex: lastIndex + 1,
    });
  }

  const page = req.query.page - 1;

  return res.json(
    characters.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    )
  );
});

router.get("/api/own/characters/:id", (req, res) => {
  const passedCharacterId = req.params.id;

  const filteredCharacters = characters.find(
    (character) => character.id === passedCharacterId
  );

  if (filteredCharacters.length === 0) {
    return res.status(400).send({ msg: "This character was not found" });
  }

  return res.status(200).send(filteredCharacters);
});

export default router;
