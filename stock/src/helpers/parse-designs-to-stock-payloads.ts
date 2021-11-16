import { Types } from "mongoose";
import { DesignPayloadEvent } from "@fujingr/common";

// constants
import { InOut } from "../constants/enum-in-out";

// models
import { StockAttrs } from "../models/stock";

interface ArticlePayload {
  id: string;
  name: string;
}

export const parseDesignsToStockPayloads = (
  designs: DesignPayloadEvent[],
  article: ArticlePayload
) => {
  const stockPayloads: StockAttrs[] = designs.map((design) => ({
    article: new Types.ObjectId(article.id),
    name: `${article.name} ${design.name}`,
    color: design.color,
    totalQty: design.items.length,
    totalLengthInMeters: design.items.reduce(
      (previousValue, item) => previousValue + item.lengthInMeters,
      0
    ),
    totalLengthInYards: design.items.reduce(
      (previousValue, item) => previousValue + item.lengthInYards,
      0
    ),
    inOutStocks: design.items.map(({ qrCode }) => ({
      qrCode,
      info: InOut.IN,
    })),
    detailStocks: design.items.map(({ id }) => new Types.ObjectId(id)),
  }));

  return stockPayloads;
};
