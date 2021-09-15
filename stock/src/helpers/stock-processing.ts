import { Types } from "mongoose";

// constants
import { InOut } from "../constants/enum-in-out";
import { GlobalStockPayload } from "../constants/global-stock-payload";

// models
import { Stock } from "../models/stock";

interface StockPayload {
  itemId: string;
  qrCode: string;
  lengthInMeters: number;
  lengthInYards: number;
  qty: number;
}

export const stockProcessing = async (stockPayload: StockPayload) => {
  const { itemId, qrCode, lengthInMeters, lengthInYards, qty } = stockPayload;
  const globalStocks: GlobalStockPayload[] = [];

  const stock = await Stock.findOne({
    detailStocks: itemId,
  });
  if (stock) {
    const detailStocks =
      lengthInMeters > 35
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

  return { globalStocks };
};
