import express, { Request, Response } from "express";
import { body } from "express-validator";

// middlewares
import {
  requireAuth,
  validateRequest,
  validateBodyObjectId,
} from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Price, PriceAttrs } from "../../models/price";
import { Lot } from "../../models/lot";

// errors
import { BadRequestError, NotFoundError } from "@fujingr/common";

const router = express.Router();

router.post(
  "/api/cloth/price/create",
  requireAuth([Role.admin, Role.employee]),
  body("lot").notEmpty().withMessage("Must be filled"),
  body(["retailPrice", "wholesalerPrice", "lotPrice"])
    .notEmpty()
    .withMessage("Must be filled")
    .isInt({ gt: 0 })
    .withMessage("Must be numeric and greater than 0"),
  validateRequest,
  validateBodyObjectId("lot"),
  async (req: Request, res: Response) => {
    const { lot, retailPrice, wholesalerPrice, lotPrice } =
      req.body as PriceAttrs;

    const existingPrice = await Price.findOne({ lot });
    if (existingPrice) {
      throw new BadRequestError("Price already exist");
    }

    const existingLot = await Lot.findById(lot);
    if (!existingLot) {
      throw new NotFoundError();
    }

    // create price
    const price = new Price({ lot, retailPrice, wholesalerPrice, lotPrice });
    await price.save();

    // save price to lot
    existingLot.set({ price: price.id });
    await existingLot.save();

    res.status(201).send(price);
  }
);

export { router as createPriceRouter };
