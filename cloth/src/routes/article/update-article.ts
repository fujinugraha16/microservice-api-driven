import express, { Request, Response } from "express";
import { body } from "express-validator";
import axios from "axios";

// middlewares
import {
  validateRequest,
  requireAuth,
  validateParamId,
  validateTypeOfSale,
  validateGenders,
} from "@fujingr/common";

// models
import { Article, ArticleAttrs } from "../../models/article";

// errors
import { NotFoundError } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

const router = express.Router();

router.put(
  "/api/cloth/article/update/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  body(["name", "typeOfSale"]).notEmpty().withMessage("Must be filled"),
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
    const { id } = req.params;
    const {
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

    const article = await Article.findById(id);
    if (!article) {
      throw new NotFoundError();
    }

    article.set({
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

    // update article in stock
    let success = false;
    do {
      const response = await axios.put(
        `${process.env.STOCK_API_URI}/api/stock/article/${id}`,
        {
          id: article.id,
          name: article.name,
          width: article.width,
          gsm: article.gsm,
          safetyStock: article.safetyStock,
          typeOfSale: article.typeOfSale,
          activities: article.activities,
          departments: article.departments,
          genders: article.genders,
          detailReferences: article.detailReferences,
          version: article.version,
        }
      );

      success = response.data.success;
    } while (success === false);

    res.status(200).send(article);
  }
);

export { router as updateArticleRouter };
