import { Types } from "mongoose";

// models
import { Stock } from "../models/stock";

// helpers
import { randomString } from "@fujingr/common";

// constants
import { InOut } from "../constants/enum-in-out";

export const createStock = async (
  article: string = articleId,
  itemId?: string | Types.ObjectId,
  qrCode: string = qrCodeString
) => {
  const stock = new Stock({
    article,
    name: "Test white",
    color: "#fff",
    totalQty: 100,
    totalLengthInMeters: 910,
    totalLengthInYards: 1000,
    inOutStocks: [
      {
        qrCode,
        info: InOut.IN,
      },
    ],
    detailStocks: [itemId || new Types.ObjectId().toHexString()],
  });
  await stock.save();

  return stock;
};

export const articleId = new Types.ObjectId().toHexString();

export const id = new Types.ObjectId().toHexString();

export const qrCodeString = randomString(10);
