import express, { Request, Response } from "express";
import { body } from "express-validator";
import axios from "axios";
import { cpuUsage } from "process";

// middlewares
import { requireAuth, validateParamId, validateRequest } from "@fujingr/common";
import { validateDesignsPayload } from "../../middlewares/validate-designs-payload";

// constants
import { Role, LotAddItemsEvent } from "@fujingr/common";

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
    // cpu
    const cpuUsageBefore = cpuUsage();

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
    const itemIds = await saveItems(updatedDesigns);

    // update inputSequence lot
    lot.set({ inputSequence });
    await lot.save();

    // send to stock api
    const payload: LotAddItemsEvent["data"] = {
      article: {
        id: (lot.article as unknown as { id: string }).id,
        name: (lot.article as unknown as { name: string }).name,
      },
      designs: await parseLotDesigns(lot.designs, itemIds),
    };

    // update article in stock
    let successStockLotIn = false;
    do {
      const response = await axios.post(
        `${process.env.STOCK_API_URI}/api/stock/lot-in`,
        payload
      );

      successStockLotIn = response.data.success;
    } while (successStockLotIn === false);

    // update article in stock
    let successSaleLotIn = false;
    do {
      const response = await axios.post(
        `${process.env.SALE_API_URI}/api/sale/lot-in`,
        payload
      );

      successSaleLotIn = response.data.success;
    } while (successSaleLotIn === false);

    // record cpu usage
    const cpuUsageAfter = cpuUsage(cpuUsageBefore);

    res.status(200).send({ lot, cpuUsage: cpuUsageAfter });
  }
);

export { router as addItemsRouter };
