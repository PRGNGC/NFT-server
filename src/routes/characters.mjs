import { Router } from "express";
import { query, validationResult } from "express-validator";
import { Character } from "../mongoose/schemas/characterSchema.mjs";

const router = Router();

// let charactersCollection = [];
// (async function () {
//   return await Character.find({});
// })().then((res) => (charactersCollection = res));
// console.log(charactersCollection);

router.get("/api/characters", async (req, res) => {
  const charactersCollection = await Character.find({});

  if (req.query.search) {
    const limit = 5;

    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let charactersWithQuery = [];

    for (let i = nextSearchIndex; i < charactersCollection.length; i++) {
      if (charactersWithQuery.length === 5) break;

      if (
        charactersCollection[i].nftName
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        charactersWithQuery.length <= limit - 1
      ) {
        charactersWithQuery.push(charactersCollection[i]);
        lastIndex = i;
      }
    }

    return res.json({
      nfts: charactersWithQuery,
      nextSearchIndex: lastIndex + 1,
    });
  }

  const limit = 5;

  const page = req.query.page - 1;

  return res.json(
    charactersCollection.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    )
  );
});

router.get("/api/characters/:id", async (req, res) => {
  const charactersCollection = await Character.find({});

  const passedCharacterId = req.params.id;

  const filteredCharacters = charactersCollection.find(
    (character) => character.id === passedCharacterId
  );

  if (filteredCharacters.length === 0) {
    return res.status(400).send({ msg: "This character was not found" });
  }

  return res.status(200).send(filteredCharacters);
});

router.post("/api/characters/slider", async (req, res) => {
  const charactersCollection = await Character.find({});

  const { nfts } = req.body;

  return res.json(
    charactersCollection.filter((character) => nfts.includes(character.id))
  );
});

export default router;
