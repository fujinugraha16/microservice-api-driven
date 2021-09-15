// constants
import { RetailItemPayload } from "../constants/retail-item-payload";

// events
import { StockApiPayloadFromSale } from "@fujingr/common";

export const retailItemsProcessing = async (
  retailItems: RetailItemPayload[]
) => {
  let tempPrice = 0;
  let totalPrice = 0;
  let totalQty = 0;
  const stockApiPayloadFromSale: StockApiPayloadFromSale[] = [];

  retailItems.forEach(({ itemId, qrCode, price, lengthInMeters }) => {
    let qty = 0;
    tempPrice += price;

    stockApiPayloadFromSale.push({
      itemId,
      qrCode,
      lengthInMeters,
      lengthInYards: lengthInMeters * 1.09,
      qty,
    });
  });

  totalPrice += tempPrice;
  totalQty += retailItems.length;

  return {
    totalPrice,
    totalQty,
    stockApiPayloadFromSale,
  };
};
