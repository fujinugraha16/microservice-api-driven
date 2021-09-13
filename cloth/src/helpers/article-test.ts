import { Types } from "mongoose";

import { Article } from "../models/article";

// constants
import { TypeOfSale } from "@fujingr/common";

export const createArticle = async () => {
  const article = new Article({
    code: "ARTICLE",
    name: "Test Cloth",
    typeOfSale: TypeOfSale.lot,
    width: 100,
    safetyStock: 20,
    gsm: 10,
  });
  await article.save();

  return article;
};

export const id = new Types.ObjectId().toHexString();
