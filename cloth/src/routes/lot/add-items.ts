import express, { Request, Response } from "express";
import { body } from "express-validator";
import axios from "axios";

// middlewares
import { requireAuth, validateParamId, validateRequest } from "@fujingr/common";
import { validateDesignsPayload } from "../../middlewares/validate-designs-payload";

// constants
import { Role, StockApiPayloadFromCloth } from "@fujingr/common";

// models
import { Lot } from "../../models/lot";

// errors
import { NotFoundError } from "@fujingr/common";

// helpers
import { updateDesignsPayload } from "../../helpers/update-designs-payload";
import { saveItems } from "../../helpers/save-items";
import { parseLotDesigns } from "../../helpers/parse-lot-designs";

const router = express.Router();

router.put(
  "/api/cloth/lot/:id/add-items",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  body("designs")
    .isArray()
    .withMessage("Must be array")
    .notEmpty()
    .withMessage("Must be filled array"),
  validateRequest,
  validateDesignsPayload,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { designs } = req.body;

    const lot = await Lot.findById(id).populate("article");
    if (!lot) {
      throw new NotFoundError();
    }

    const inputSequence = lot.inputSequence + 1;

    // update designs payload
    const updatedDesigns = updateDesignsPayload(designs, inputSequence);

    // save items and update design
    await saveItems(updatedDesigns);

    // update inputSequence lot
    lot.set({ inputSequence });
    await lot.save();

    // send to stock api
    const stockApiPayload: StockApiPayloadFromCloth = {
      article: {
        id: (lot.article as unknown as { id: string }).id,
        name: (lot.article as unknown as { name: string }).name,
      },
      designs: await parseLotDesigns(lot.designs, inputSequence),
    };

    await axios.post(
      `${process.env.STOCK_API_URI}/api/stock/in`,
      stockApiPayload
    );

    res.status(200).send(lot);
  }
);

export { router as addItemsRouter };
