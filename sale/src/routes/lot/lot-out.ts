import express, { Request, Response } from "express";

// constants
import { LotDeletedEvent } from "@fujingr/common";

// helpers
import { parseDesignsToItemPayloads } from "@fujingr/common";
import { clearItems } from "../../helpers/clear-items";

const router = express.Router();

router.post("/api/sale/lot-out", async (req: Request, res: Response) => {
  const { designs } = req.body as LotDeletedEvent["data"];

  const itemPayloads = parseDesignsToItemPayloads(designs);
  await clearItems(itemPayloads);

  res.status(200).send({ success: true });
});

export { router as lotOutRouter };
