import express, { Request, Response } from "express";

// constants
import { LotDeletedEvent, parseDesignsToItemPayloads } from "@fujingr/common";

// helpers
import { parseDesignsToStockPayloads } from "../../helpers/parse-designs-to-stock-payloads";
import { decreaseStocks } from "../../helpers/decrease-stocks";
import { clearItems } from "../../helpers/clear-items";

const router = express.Router();

router.post("/api/stock/lot-out", async (req: Request, res: Response) => {
  const { article, designs } = req.body as LotDeletedEvent["data"];

  const stockPayloads = parseDesignsToStockPayloads(designs, article);
  await decreaseStocks(stockPayloads);

  const itemPayloads = parseDesignsToItemPayloads(designs);
  await clearItems(itemPayloads);

  res.status(200).send({ success: true });
});

export { router as lotOutRouter };
