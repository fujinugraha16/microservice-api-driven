import { Types } from "mongoose";

import { Lot } from "../models/lot";

const designId = new Types.ObjectId().toHexString();

export const createLot = async (
  article: string = articleId,
  inputSequence: number = 1
) => {
  const lot = new Lot({
    code: "ARTICLE-LOT",
    pureLotCode: "LOT",
    article,
    designs: [designId],
    supplier: "PT. Aliex Retail",
    inputSequence,
  });
  await lot.save();

  return lot;
};

export const articleId = new Types.ObjectId().toHexString();

export const id = new Types.ObjectId().toHexString();
