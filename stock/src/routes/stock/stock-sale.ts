import express from "express";

// constants
import { SaleCreatedEvent } from "@fujingr/common";

// helpers
import { itemProcessing } from "../../helpers/item-processing";
import { stockProcessing } from "../../helpers/stock-processing";
import { globalStocksProcessing } from "../../helpers/global-stocks-processing";

// constants
import { GlobalStockPayload } from "../../constants/global-stock-payload";

const router = express.Router();

router.post("/api/stock/sale", async (req, res) => {
  const { stockPayloads } = req.body as SaleCreatedEvent["data"];
  const notFoundItemIdsWithVersion: string[] = [];

  if (stockPayloads) {
    const globalStocks: GlobalStockPayload[] = [];

    const promises = stockPayloads.map(
      async ({ itemId, lengthInMeters, lengthInYards, qty, version }) => {
        const {
          sold,
          qrCode,
          notFoundItemIdsWithVersion: notFoundItems,
        } = await itemProcessing({
          itemId,
          lengthInMeters,
          lengthInYards,
          version,
        });

        notFoundItemIdsWithVersion.push(...notFoundItems);

        const { globalStocks: gStocks } = await stockProcessing(
          { itemId, lengthInMeters, lengthInYards, qty },
          sold,
          qrCode
        );
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
        updatedGlobalStockPayloads[index].lengthInMeters +=
          gStock.lengthInMeters;
        updatedGlobalStockPayloads[index].lengthInYards += gStock.lengthInYards;
        updatedGlobalStockPayloads[index].qty += gStock.qty;
      } else {
        updatedGlobalStockPayloads.push(gStock);
      }
    });

    // decrease stocks
    await globalStocksProcessing(updatedGlobalStockPayloads);
  }

  let success = false;
  if (notFoundItemIdsWithVersion.length === 0) {
    success = true;
  }

  res.status(200).send({ success });
});

export { router as stockSaleRouter };
