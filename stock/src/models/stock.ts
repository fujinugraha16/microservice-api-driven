import { Schema, model, Types } from "mongoose";

// constansts
import { InOut } from "../constants/enum-in-out";

type ID = Types.ObjectId;

interface StockAttrs {
  article: string;
  name: string;
  color: string;
  totalQty: number;
  totalLengthInMeters: number;
  totalLengthInYards: number;
  inOutStocks: {
    date?: Date;
    qrCode: string;
    info: InOut;
  }[];
  detailStocks: string[];
}

const stockSchema = new Schema<StockAttrs>(
  {
    article: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalLengthInMeters: {
      type: Number,
      required: true,
    },
    totalLengthInYards: {
      type: Number,
      required: true,
    },
    inOutStocks: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        qrCode: {
          type: String,
          required: true,
        },
        info: {
          type: String,
          require: true,
        },
      },
    ],
    detailStocks: [String],
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

const stockModel = model<StockAttrs>("Stock", stockSchema);

export { stockModel as Stock, StockAttrs };