import { Schema, model } from "mongoose";

// constants
import { RetailItemPayload } from "../constants/retail-item-payload";
import { WholesalerItemPayload } from "../constants/wholesaler-item-payload";
import { LotItemPayload } from "../constants/lot-item-payload";

interface SaleAttrs {
  code: string;
  customerName: string;
  retailItems?: RetailItemPayload[];
  wholesalerItems?: WholesalerItemPayload[];
  lotItems?: LotItemPayload[];
  totalPrice: number;
  totalQty: number;
  date?: Date;
}

const saleSchema = new Schema<SaleAttrs>(
  {
    code: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    retailItems: [
      {
        qrCode: {
          type: String,
          required: true,
        },
        lengthInMeters: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    wholesalerItems: [
      {
        qrCode: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    lotItems: [
      {
        price: {
          type: Number,
          required: true,
        },
        items: [String],
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const saleModel = model<SaleAttrs>("Sale", saleSchema);

export { saleModel as Sale, SaleAttrs };
