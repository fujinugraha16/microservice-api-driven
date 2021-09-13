import express from "express";

// middlewares
import { requireAuth } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Article } from "../../models/article";

const router = express.Router();

router.get(
  "/api/cloth/article/list",
  requireAuth([Role.admin, Role.employee]),
  async (req, res) => {
    const articles = await Article.find();

    res.status(200).send(articles);
  }
);

export { router as listArticlesRouter };
