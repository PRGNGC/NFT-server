import { Router } from "express";
import { query, validationResult } from "express-validator";
import { Character } from "../mongoose/schemas/characterSchema.mjs";
import { Item } from "../mongoose/schemas/itemSchema.mjs";

const router = Router();

router.get("/api/items", async (req, res) => {
  const itemsCollection = await Item.find({});

  if (req.query.search) {
    const limit = 5;

    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let itemsWithQuery = [];

    for (let i = nextSearchIndex; i < itemsCollection.length; i++) {
      if (itemsWithQuery.length === 5) break;

      if (
        itemsCollection[i].nftName
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        itemsWithQuery.length <= limit - 1
      ) {
        itemsWithQuery.push(itemsCollection[i]);
        lastIndex = i;
      }
    }

    return res.json({
      nfts: itemsWithQuery,
      nextSearchIndex: lastIndex + 1,
    });
  }

  const limit = 5;

  const page = req.query.page - 1;

  return res.json(
    itemsCollection.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    )
  );
});

router.get("/api/items/:id", async (req, res) => {
  const itemsCollection = await Item.find({});

  const passedCharacterId = req.params.id;

  const filteredItems = itemsCollection.find(
    (character) => character.id === passedCharacterId
  );

  if (filteredItems.length === 0) {
    res.status(400).send({ msg: "This character was not found" });
  }

  res.status(200).send(filteredItems);
});

router.post("/api/items/slider", async (req, res) => {
  const itemsCollection = await Item.find({});

  const { nfts } = req.body;
  console.log(nfts);

  return res.json(itemsCollection.filter((item) => nfts.includes(item.id)));
});

export default router;
