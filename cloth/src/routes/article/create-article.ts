import express, { Request, Response } from "express";
import { body } from "express-validator";

// middlewares
import {
  validateRequest,
  requireAuth,
  validateTypeOfSale,
  validateGenders,
} from "@fujingr/common";

// models
import { Article, ArticleAttrs } from "../../models/article";

// errors
import { BadRequestError } from "@fujingr/common";

// constanta
import { Role } from "@fujingr/common";

const router = express.Router();

router.post(
  "/api/cloth/article/create",
  requireAuth([Role.admin, Role.employee]),
  body(["code", "name", "typeOfSale"]).notEmpty().withMessage("Must be filled"),
  body(["width", "gsm", "safetyStock"])
    .isInt({ gt: 0 })
    .withMessage("Must be numeric and greater than 0")
    .notEmpty()
    .withMessage("Must be filled"),
  body(["departments", "genders", "activities", "detailReferences"])
    .optional()
    .isArray()
    .withMessage("Must be array"),
  validateRequest,
  validateTypeOfSale,
  validateGenders,
  async (req: Request, res: Response) => {
    const {
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
      departments,
      activities,
      genders,
      detailReferences,
    } = req.body as ArticleAttrs;

    const existingArticle = await Article.findOne({ code });
    if (existingArticle) {
      throw new BadRequestError("Code already exists");
    }

    const article = new Article({
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
      departments,
      activities,
      genders,
      detailReferences,
    });
    await article.save();

    res.status(201).send(article);
  }
);

export { router as createArticleRouter };
