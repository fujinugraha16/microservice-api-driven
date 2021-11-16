import express from "express";
import axios from "axios";

// middlewares
import { requireAuth, validateParamId } from "@fujingr/common";

// constants
import { Role, LotDeletedEvent } from "@fujingr/common";

// models
import { Lot } from "../../models/lot";
import { Price } from "../../models/price";

// errors
import { NotFoundError, ForbiddenError } from "@fujingr/common";

// helpers
import { deleteDesignsAndItems } from "../../helpers/delete-designs-and-items";
import { parseLotDesigns } from "../../helpers/parse-lot-designs";

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

    // data for send to stock api
    const designsPayload = await parseLotDesigns(lot.designs);

    // delete desings and items
    await deleteDesignsAndItems(lot.designs);

    // delete price too
    if (lot.price) {
      await Price.findByIdAndRemove(lot.price);
    }

    // delete lot
    await Lot.findByIdAndRemove(id);

    // send to stock api
    const payload: LotDeletedEvent["data"] = {
      article: {
        id: (lot.article as unknown as { id: string }).id,
        name: (lot.article as unknown as { name: string }).name,
      },
      designs: designsPayload,
    };

    await axios.post(`${process.env.STOCK_API_URI}/api/stock/lot-out`, payload);
    await axios.post(`${process.env.SALE_API_URI}/api/sale/lot-out`, payload);

    res.status(204).send({ success: true });
  }
);

export { router as deleteLotRouter };
