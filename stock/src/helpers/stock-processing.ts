import { Types } from "mongoose";

// constants
import { InOut } from "../constants/enum-in-out";
import { GlobalStockPayload } from "../constants/global-stock-payload";

// models
import { Stock } from "../models/stock";

interface StockPayload {
  itemId: Types.ObjectId | string;
  lengthInMeters: number;
  lengthInYards: number;
  qty: number;
}

export const stockProcessing = async (
  stockPayload: StockPayload,
  sold: boolean,
  qrCode: string | null
) => {
  const { itemId, lengthInMeters, lengthInYards, qty } = stockPayload;
  const globalStocks: GlobalStockPayload[] = [];

  const stock = await Stock.findOne({
    detailStocks: new Types.ObjectId(itemId),
  });
  if (stock) {
    if (qrCode) {
      const detailStocks = sold
        ? stock.detailStocks.filter((item) => item.toString() !== itemId)
        : stock.detailStocks;

      stock.inOutStocks.push({ qrCode, info: InOut.OUT });
      stock.detailStocks = detailStocks;

      await stock.save();

      globalStocks.push({
        stockId: stock.id,
        lengthInMeters,
        lengthInYards,
        qty,
      });
    }
  }

  return { globalStocks };
};
