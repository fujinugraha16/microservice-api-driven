// models
import { Stock } from "../models/stock";

// constants
import { GlobalStockPayload } from "../constants/global-stock-payload";

export const globalStocksProcessing = async (
  globalStockPayloads: GlobalStockPayload[]
) => {
  const promises = globalStockPayloads.map(
    async ({ stockId, lengthInMeters, lengthInYards, qty }) => {
      const stock = await Stock.findById(stockId);

      let totalLengthInMeters = stock!.totalLengthInMeters - lengthInMeters;
      let totalLengthInYards = stock!.totalLengthInYards - lengthInYards;
      const totalQty = stock!.totalQty - qty;

      if (totalLengthInMeters <= 0 || totalLengthInYards <= 0) {
        totalLengthInMeters = 0;
        totalLengthInYards = 0;
      }

      stock!.set({
        totalLengthInMeters,
        totalLengthInYards,
        totalQty,
      });
      await stock!.save();
    }
  );
  await Promise.all(promises);
};
