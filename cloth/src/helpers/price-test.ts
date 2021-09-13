import { Types } from "mongoose";

import { Price } from "../models/price";

export const createPrice = async (lot: string = lotId) => {
  const price = new Price({
    lot,
    retailPrice: 5000,
    wholesalerPrice: 10000,
    lotPrice: 120000,
  });
  await price.save();

  return price;
};

export const lotId = new Types.ObjectId().toHexString();

export const id = new Types.ObjectId().toHexString();
