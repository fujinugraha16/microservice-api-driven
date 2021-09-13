import express from "express";

// middlewares
import { requireAuth, validateParamId } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Price } from "../../models/price";
import { Lot } from "../../models/lot";

// errors
import { NotFoundError } from "@fujingr/common";

const router = express.Router();

router.delete(
  "/api/cloth/price/delete/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const price = await Price.findById(id);
    if (!price) {
      throw new NotFoundError();
    }

    const existingLot = await Lot.findById(price.lot);
    if (existingLot) {
      existingLot.set({ price: undefined });
      await existingLot.save();
    }

    await Price.findByIdAndRemove(id);

    res.status(204).send({ succes: true });
  }
);

export { router as deletePriceRouter };
