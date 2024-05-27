import { Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/api/own/items", async (req, res) => {
  const refreshToken = req.headers.cookie.split("=")[1];
  const userObj = jwt.verify(refreshToken, "token_refresh");
  const userId = userObj.login;

  const userByLogin = await User.findOne({ login: userId });
  const items = userByLogin.nfts.items;
  const limit = 5;

  console.log();

  if (req.query.search) {
    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let itemsWithQuery = [];

    for (let i = nextSearchIndex; i < items.length; i++) {
      if (itemsWithQuery.length === 5) break;

      if (
        items[i].nftName.toLowerCase().includes(query.toLowerCase()) &&
        itemsWithQuery.length <= limit - 1
      ) {
        itemsWithQuery.push(items[i]);
        lastIndex = i;
      }
    }

    return res.json({
      nfts: itemsWithQuery,
      nextSearchIndex: lastIndex + 1,
    });
  }

  const page = req.query.page - 1;

  return res.json(
    items.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    )
  );
});

router.get("/api/own/items/:id", (req, res) => {
  const passedCharacterId = req.params.id;

  const filteredItems = items.find(
    (character) => character.id === passedCharacterId
  );

  if (filteredItems.length === 0) {
    return res.status(400).send({ msg: "This character was not found" });
  }

  return res.status(200).send(filteredItems);
});

export default router;
