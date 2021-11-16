import express from "express";

// constants
import { ArticleCreatedEvent } from "@fujingr/common";

// models
import { Article } from "../../models/article";

const router = express.Router();

router.post("/api/stock/article", async (req, res) => {
  const {
    id,
    code,
    gsm,
    name,
    safetyStock,
    typeOfSale,
    width,
    activities,
    departments,
    genders,
    detailReferences,
  } = req.body as ArticleCreatedEvent["data"];

  const article = new Article({
    _id: id,
    code,
    gsm,
    name,
    safetyStock,
    typeOfSale,
    width,
    activities,
    departments,
    genders,
    detailReferences,
  });
  await article.save();

  res.status(200).send({ success: true });
});

export { router as createArticleRouter };
