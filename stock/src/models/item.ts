import { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ItemAttrs {
  qrCode: string;
  lengthInMeters: number;
  lengthInYards: number;
}

const itemSchema = new Schema<ItemAttrs>(
  {
    qrCode: {
      type: String,
      required: true,
    },
    lengthInMeters: {
      type: Number,
      required: true,
    },
    lengthInYards: {
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

// add for the occ
itemSchema.set("versionKey", "version");
itemSchema.plugin(updateIfCurrentPlugin);

const itemModel = model<ItemAttrs>("Item", itemSchema);

export { itemModel as Item, ItemAttrs };
