import express, { Request, Response } from "express";
import { body } from "express-validator";

// middlewares
import { requireAuth, validateRequest } from "@fujingr/common";

// constants
import { Role, StockApiPayloadFromCloth } from "@fujingr/common";

// helpers
import { parseDesignsToStockPayloads } from "../helpers/parse-designs-to-stock-payloads";
import { decreaseStocks } from "../helpers/decrease-stocks";

const router = express.Router();

router.post("/api/stock/out", async (req: Request, res: Response) => {
  const { article, designs } = req.body as StockApiPayloadFromCloth;

  const stockPayloads = parseDesignsToStockPayloads(designs, article);
  await decreaseStocks(stockPayloads);

  res.status(200).send({ success: true });
});

export { router as stockOutRouter };
