import { Stock, StockAttrs } from "../models/stock";

// constants
import { InOut } from "../constants/enum-in-out";

export const decreaseStocks = async (stockPayloads: StockAttrs[]) => {
  const stockPromises = stockPayloads.map(async (stock) => {
    const {
      article,
      color,
      totalQty,
      totalLengthInMeters,
      totalLengthInYards,
      inOutStocks,
      detailStocks,
    } = stock;
    const existingStock = await Stock.findOne({ article, color });

    if (existingStock) {
      existingStock.set({
        totalQty: existingStock.totalQty - totalQty,
        totalLengthInMeters:
          existingStock.totalLengthInMeters - totalLengthInMeters,
        totalLengthInYards:
          existingStock.totalLengthInYards - totalLengthInYards,
        inOutStocks: existingStock.inOutStocks.filter(
          (item) =>
            !(
              inOutStocks.map(({ qrCode }) => qrCode).includes(item.qrCode) &&
              item.info === InOut.IN
            )
        ),
        detailStocks: existingStock.detailStocks.filter(
          (item) =>
            !detailStocks
              .map((detailStock) => detailStock.toString())
              .includes(item.toString())
        ),
      });
      await existingStock.save();
    }
  });
  await Promise.all(stockPromises);
};
