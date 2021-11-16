import express from "express";

// constants
import { LotCreatedEvent, parseDesignsToItemPayloads } from "@fujingr/common";

// helpers
import { parseDesignsToStockPayloads } from "../../helpers/parse-designs-to-stock-payloads";
import { saveOrIncreaseStocks } from "../../helpers/save-or-increase-stocks";
import { saveItems } from "../../helpers/save-items";

const router = express.Router();

router.post("/api/stock/lot-in", async (req, res) => {
  const { article, designs } = req.body as LotCreatedEvent["data"];

  try {
    const stockPayloads = parseDesignsToStockPayloads(designs, article);
    await saveOrIncreaseStocks(stockPayloads);

    const itemPayloads = parseDesignsToItemPayloads(designs);
    await saveItems(itemPayloads);

    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ success: false });
  }
});

export { router as lotInRouter };
