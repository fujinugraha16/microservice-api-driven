import express from "express";

// constants
import { ArticleUpdatedEvent } from "@fujingr/common";

// models
import { Article } from "../../models/article";

const router = express.Router();

router.put("/api/stock/article/:id", async (req, res) => {
  const { id } = req.params;
  const {
    gsm,
    name,
    safetyStock,
    typeOfSale,
    width,
    activities,
    departments,
    genders,
    detailReferences,
    version,
  } = req.body as ArticleUpdatedEvent["data"];

  let success = true;

  const article = await Article.findOne({ _id: id, version: version - 1 });
  if (article) {
    article.set({
      _id: id,
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
  } else {
    // maybe has been deleted or not defined
    const checkAvailabilityArticle = await Article.findById(id);
    if (checkAvailabilityArticle) {
      success = false;
      console.log(
        `Article with id: '${id}', and version: ${version - 1} not found`
      );
    } else {
      success = true;
    }
  }

  res.status(200).send({ success });
});

export { router as updateArticleRouter };
