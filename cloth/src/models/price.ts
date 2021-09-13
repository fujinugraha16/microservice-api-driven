import { Schema, model, Types } from "mongoose";

type ID = Types.ObjectId;

interface PriceAttrs {
  lot: ID;
  retailPrice: number;
  wholesalerPrice: number;
  lotPrice: number;
}

const priceSchema = new Schema<PriceAttrs>(
  {
    lot: {
      type: Schema.Types.ObjectId,
      ref: "Lot",
    },
    retailPrice: {
      type: Number,
      required: true,
    },
    wholesalerPrice: {
      type: Number,
      required: true,
    },
    lotPrice: {
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

const priceModel = model<PriceAttrs>("Price", priceSchema);

export { priceModel as Price, PriceAttrs };
