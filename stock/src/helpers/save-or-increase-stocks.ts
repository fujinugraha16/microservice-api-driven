import { Stock, StockAttrs } from "../models/stock";

export const saveOrIncreaseStocks = async (stockPayloads: StockAttrs[]) => {
  const stockPromises = stockPayloads.map(async (stock) => {
    const {
      article,
      name,
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
        totalQty: existingStock.totalQty + totalQty,
        totalLengthInMeters:
          existingStock.totalLengthInMeters + totalLengthInMeters,
        totalLengthInYards:
          existingStock.totalLengthInYards + totalLengthInYards,
        inOutStocks: [...existingStock.inOutStocks, ...inOutStocks],
        detailStocks: [...existingStock.detailStocks, ...detailStocks],
      });
      await existingStock.save();
    } else {
      const newStock = new Stock({
        article,
        name,
        color,
        totalQty,
        totalLengthInMeters,
        totalLengthInYards,
        inOutStocks,
        detailStocks,
      });
      await newStock.save();
    }
  });
  await Promise.all(stockPromises);
};
