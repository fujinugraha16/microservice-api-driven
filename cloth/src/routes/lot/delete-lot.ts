import express from "express";

// middlewares
import { requireAuth, validateParamId } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Lot } from "../../models/lot";
import { Price } from "../../models/price";

// errors
import { NotFoundError, ForbiddenError } from "@fujingr/common";

// helpers
import { deleteDesignsAndItems } from "../../helpers/delete-designs-and-items";

const router = express.Router();

router.delete(
  "/api/cloth/lot/delete/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const lot = await Lot.findById(id).populate("article");
    if (!lot) {
      throw new NotFoundError();
    }

    // cannot deleted if inputSequence > 1
    if (lot.inputSequence > 1) {
      throw new ForbiddenError("Lot has been used by other documents");
    }

    // delete desings and items
    await deleteDesignsAndItems(lot.designs);

    // delete price too
    if (lot.price) {
      await Price.findByIdAndRemove(lot.price);
    }

    // delete lot
    await Lot.findByIdAndRemove(id);

    res.status(204).send({ success: true });
  }
);

export { router as deleteLotRouter };
