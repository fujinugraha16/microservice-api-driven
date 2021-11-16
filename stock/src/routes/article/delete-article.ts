import express from "express";

// models
import { Article } from "../../models/article";

const router = express.Router();

router.delete("/api/stock/article/:id", async (req, res) => {
  const { id } = req.params;

  const article = await Article.findById(id);
  if (!article) {
    throw new Error("Article not found");
  }

  await Article.findByIdAndRemove(id);

  res.status(200).send({ success: true });
});

export { router as deleteArticleRouter };
