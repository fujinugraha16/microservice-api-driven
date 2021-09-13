import express from "express";

// middlewares
import { requireAuth, validateParamId } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Article } from "../../models/article";

// errors
import { NotFoundError } from "@fujingr/common";

const router = express.Router();

router.get(
  "/api/cloth/article/show/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      throw new NotFoundError();
    }

    res.status(200).send(article);
  }
);

export { router as showArticleRouter };
