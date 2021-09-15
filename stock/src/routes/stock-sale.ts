import express from "express";

// constants
import { StockApiPayloadFromSale } from "@fujingr/common";

// helpers
import { stockProcessing } from "../helpers/stock-processing";
import { globalStocksProcessing } from "../helpers/global-stocks-processing";

// constants
import { GlobalStockPayload } from "../constants/global-stock-payload";

const router = express.Router();

router.post("/api/stock/sale", async (req, res) => {
  const stockPayloads = req.body
    .stockApiPayloadFromSale as StockApiPayloadFromSale[];

  const globalStocks: GlobalStockPayload[] = [];
  const promises = stockPayloads.map(
    async ({ itemId, qrCode, lengthInMeters, lengthInYards, qty }) => {
      const { globalStocks: gStocks } = await stockProcessing({
        itemId,
        qrCode,
        lengthInMeters,
        lengthInYards,
        qty,
      });
      globalStocks.push(...gStocks);
    }
  );
  await Promise.all(promises);

  // update stock payload (total length and total qty)
  const updatedGlobalStockPayloads: GlobalStockPayload[] = [];
  globalStocks.forEach((gStock) => {
    let index = -1;

    if (updatedGlobalStockPayloads.length > 0) {
      index = updatedGlobalStockPayloads.findIndex(
        ({ stockId }) => stockId.toString() === gStock.stockId.toString()
      );
    }

    if (index >= 0) {
      updatedGlobalStockPayloads[index].lengthInMeters += gStock.lengthInMeters;
      updatedGlobalStockPayloads[index].lengthInYards += gStock.lengthInYards;
      updatedGlobalStockPayloads[index].qty += gStock.qty;
    } else {
      updatedGlobalStockPayloads.push(gStock);
    }
  });

  // decrease stocks
  await globalStocksProcessing(updatedGlobalStockPayloads);

  res.status(200).send({ success: true });
});

export { router as stockInRouter };
