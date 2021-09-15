// constants
import { LotItemPayload } from "../constants/lot-item-payload";

// event
import { StockApiPayloadFromSale } from "@fujingr/common";

export const lotItemsProcessing = async (lotItems: LotItemPayload[]) => {
  let tempPrice = 0;
  let totalPrice = 0;
  let totalQty = 0;
  const stockApiPayloadFromSale: StockApiPayloadFromSale[] = [];

  lotItems.forEach(({ price, items }) => {
    items.forEach(({ itemId, qrCode, lengthInMeters }) => {
      stockApiPayloadFromSale.push({
        itemId,
        qrCode,
        lengthInMeters,
        lengthInYards: lengthInMeters * 1.09,
        qty: 1,
      });
    });

    tempPrice += price;
  });

  totalPrice += tempPrice;
  totalQty += lotItems.length;

  return {
    totalPrice,
    totalQty,
    stockApiPayloadFromSale,
  };
};
