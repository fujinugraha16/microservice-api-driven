import express, { Request, Response } from "express";
import { body } from "express-validator";

// middlewares
import {
  requireAuth,
  validateParamId,
  validateRequest,
  validateBodyObjectId,
} from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Price, PriceAttrs } from "../../models/price";
import { Lot } from "../../models/lot";

// erros
import { NotFoundError, BadRequestError } from "@fujingr/common";

const router = express.Router();

router.put(
  "/api/cloth/price/update/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  body("lot").notEmpty().withMessage("Must be filled"),
  body(["retailPrice", "wholesalerPrice", "lotPrice"])
    .notEmpty()
    .withMessage("Must be filled")
    .isInt({ gt: 0 })
    .withMessage("Must be numeric and greater than 0"),
  validateRequest,
  validateBodyObjectId("lot"),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lot, retailPrice, wholesalerPrice, lotPrice } =
      req.body as PriceAttrs;

    const price = await Price.findById(id);
    if (!price) {
      throw new NotFoundError();
    }

    if (price.lot.toString() !== lot.toString()) {
      const existingPrice = await Price.findOne({ lot });
      if (existingPrice) {
        throw new BadRequestError("Price already exist");
      }

      const oldExistingLot = await Lot.findById(price.lot);
      oldExistingLot!.set({ price: undefined });
      await oldExistingLot!.save();

      const newExistingLot = await Lot.findById(lot);
      if (!newExistingLot) {
        throw new NotFoundError();
      }

      newExistingLot.set({ price: price.id });
      await newExistingLot.save();
    }

    price.set({ lot, retailPrice, wholesalerPrice, lotPrice });
    await price.save();

    res.status(200).send(price);
  }
);

export { router as updatePriceRouter };
