import { Types } from "mongoose";

// models
import { Sale } from "../models/sale";

// helpers
import { randomString } from "@fujingr/common";

export const createSale = async () => {
  const sale = new Sale({
    code: `SL-${randomString(5)}`,
    customerName: "Test Customer",
    totalPrice: 1_000_000,
    totalQty: 100,
    retailItems: [
      {
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 50,
      },
    ],
    wholesalerItems: [
      {
        qrCode: randomString(5),
        price: 400_000,
      },
    ],
    lotItems: [
      {
        price: 2_000_000,
        items: [randomString(5)],
      },
    ],
  });
  await sale.save();

  return sale;
};

export const id = new Types.ObjectId().toHexString();
