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
      existingStock.totalQty += totalQty;
      existingStock.totalLengthInMeters += totalLengthInMeters;
      existingStock.totalLengthInYards += totalLengthInYards;
      existingStock.inOutStocks.push(...inOutStocks);
      existingStock.detailStocks.push(...detailStocks);
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
