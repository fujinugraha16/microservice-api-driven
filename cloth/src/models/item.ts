import { Schema, model, Types } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

type ID = Types.ObjectId;

interface ItemAttrs {
  qrCode: string;
  sold?: boolean;
  lengthInMeters: number;
  lengthInYards: number;
  design: ID;
}

const itemSchema = new Schema<ItemAttrs>(
  {
    qrCode: {
      type: String,
      required: true,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    lengthInMeters: {
      type: Number,
      required: true,
    },
    lengthInYards: {
      type: Number,
      required: true,
    },
    design: {
      type: Schema.Types.ObjectId,
      ref: "Design",
    },
  },
  {
    timestamps: true,
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
