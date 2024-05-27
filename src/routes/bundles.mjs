import { Router } from "express";
import { query, validationResult } from "express-validator";
import { Bundle } from "../mongoose/schemas/bundleSchema.mjs";

const router = Router();

router.get("/api/bundles", async (req, res) => {
  const bundlesCollection = await Bundle.find({});

  if (req.query.search) {
    const limit = 5;

    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let bundlesWithQuery = [];

    for (let i = nextSearchIndex; i < bundlesCollection.length; i++) {
      if (bundlesWithQuery.length === 5) break;

      if (
        bundlesCollection[i].nftName
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        bundlesWithQuery.length <= limit - 1
      ) {
        bundlesWithQuery.push(bundlesCollection[i]);
        lastIndex = i;
      }
    }

    return res.json({
      nfts: bundlesWithQuery,
      nextSearchIndex: lastIndex + 1,
    });
  }

  const limit = 5;

  const page = req.query.page - 1;

  return res.json(
    bundlesCollection.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    )
  );
});

router.get("/api/bundles/:id", async (req, res) => {
  const bundlesCollection = await Bundle.find({});

  const passedCharacterId = req.params.id;

  const filteredBundles = bundlesCollection.find(
    (character) => character.id === passedCharacterId
  );

  if (filteredBundles.length === 0) {
    res.status(400).send({ msg: "This character was not found" });
  }

  res.status(200).send(filteredBundles);
});

router.post("/api/bundles/slider", async (req, res) => {
  const bundlesCollection = await Bundle.find({});

  const { nfts } = req.body;
  console.log(nfts);

  return res.json(
    bundlesCollection.filter((bundle) => nfts.includes(bundle.id))
  );
});

export default router;
