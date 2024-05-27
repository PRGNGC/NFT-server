import { Router } from "express";
import { query, validationResult } from "express-validator";
import { Planet } from "../mongoose/schemas/planetSchema.mjs";

const router = Router();

router.get("/api/planets", async (req, res) => {
  const planetsCollection = await Planet.find({});

  if (req.query.search) {
    const limit = 5;

    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let planetsWithQuery = [];

    for (let i = nextSearchIndex; i < planetsCollection.length; i++) {
      if (planetsWithQuery.length === 5) break;
      console.log("here");

      if (
        planetsCollection[i].nftName
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        planetsWithQuery.length <= limit - 1
      ) {
        console.log("in");
        planetsWithQuery.push(planetsCollection[i]);
        lastIndex = i;
      }
    }

    return res.json({
      nfts: planetsWithQuery,
      nextSearchIndex: lastIndex + 1,
    });
  }

  const limit = 5;

  const page = req.query.page - 1;

  return res.json(
    planetsCollection.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    )
  );
});

router.get("/api/planets/:id", async (req, res) => {
  const planetsCollection = await Planet.find({});

  const passedCharacterId = req.params.id;

  const filteredPlanets = planetsCollection.find(
    (character) => character.id === passedCharacterId
  );

  if (filteredPlanets.length === 0) {
    res.status(400).send({ msg: "This character was not found" });
  }

  res.status(200).send(filteredPlanets);
});

router.post("/api/planets/slider", async (req, res) => {
  const planetsCollection = await Planet.find({});

  const { nfts } = req.body;
  console.log(nfts);

  return res.json(
    planetsCollection.filter((planet) => nfts.includes(planet.id))
  );
});

export default router;
