import express, { Request, Response } from "express";
import { body } from "express-validator";

// middlewares
import {
  requireAuth,
  validateRequest,
  validateBodyObjectId,
} from "@fujingr/common";
import { validateDesignsPayload } from "../../middlewares/validate-designs-payload";

// constants
import { Role } from "@fujingr/common";

// models
import { Article } from "../../models/article";
import { Lot } from "../../models/lot";

// errors
import { NotFoundError, BadRequestError } from "@fujingr/common";

// helpers
import { updateDesignsPayload } from "../../helpers/update-designs-payload";
import { saveDesignsAndItems } from "../../helpers/save-designs-and-items";

const router = express.Router();

router.post(
  "/api/cloth/lot/create",
  requireAuth([Role.admin, Role.employee]),
  body(["pureLotCode", "article", "supplier"])
    .notEmpty()
    .withMessage("Must be filled"),
  body("designs")
    .isArray()
    .withMessage("Must be array")
    .notEmpty()
    .withMessage("Must be filled array"),
  validateRequest,
  validateBodyObjectId("article"),
  validateDesignsPayload,
  async (req: Request, res: Response) => {
    const { pureLotCode, article: articleId, supplier, designs } = req.body;

    const article = await Article.findById(articleId);
    if (!article) {
      throw new NotFoundError();
    }

    const existingLot = await Lot.findOne({
      code: `${article.code}-${pureLotCode}`,
    });
    if (existingLot) {
      throw new BadRequestError("Lot already exist");
    }

    // create lot data
    const lot = new Lot({
      article: article.id,
      pureLotCode,
      code: `${article.code}-${pureLotCode}`,
      supplier,
    });
    await lot.save();

    // update designs payload
    const updatedDesigns = updateDesignsPayload(designs, 1);

    // save designs and items to db, return designIds
    const designIds = await saveDesignsAndItems(updatedDesigns, lot.id);

    // save designIds to lot
    lot.set({ designs: designIds });
    await lot.save();

    res.status(201).send(lot);
  }
);

export { router as createLotRouter };
