import { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// constants
import { TypeOfSale, Gender } from "@fujingr/common";

interface ArticleAttrs {
  id: string;
  code: string;
  name: string;
  width: number;
  departments?: string[];
  genders?: Gender[];
  activities?: string[];
  gsm: number;
  safetyStock: number;
  typeOfSale: TypeOfSale;
  detailReferences?: string[];
}

const articleSchema = new Schema<ArticleAttrs>(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    departments: [String],
    genders: [String],
    activities: [String],
    gsm: {
      type: Number,
      required: true,
    },
    safetyStock: {
      type: Number,
      required: true,
    },
    typeOfSale: {
      type: String,
      required: true,
    },
    detailReferences: [String],
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
articleSchema.set("versionKey", "version");
articleSchema.plugin(updateIfCurrentPlugin);

const articleModel = model<ArticleAttrs>("Article", articleSchema);

export { articleModel as Article, ArticleAttrs };
