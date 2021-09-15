import express from "express";

// constants
import { StockApiPayloadFromCloth } from "@fujingr/common";

// helpers
import { parseDesignsToStockPayloads } from "../helpers/parse-designs-to-stock-payloads";
import { saveOrIncreaseStocks } from "../helpers/save-or-increase-stocks";

const router = express.Router();

router.post("/api/stock/in", async (req, res) => {
  const { article, designs } = req.body as StockApiPayloadFromCloth;

  const stockPayloads = parseDesignsToStockPayloads(designs, article);
  await saveOrIncreaseStocks(stockPayloads);

  res.status(200).send({ success: true });
});

export { router as stockInRouter };
