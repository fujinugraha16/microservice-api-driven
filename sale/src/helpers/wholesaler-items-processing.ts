// constants
import { WholesalerItemPayload } from "../constants/wholesaler-item-payload";

// events
import { StockApiPayloadFromSale } from "@fujingr/common";

export const wholesalerItemsProcessing = async (
  wholesalerItems: WholesalerItemPayload[]
) => {
  let tempPrice = 0;
  let totalPrice = 0;
  let totalQty = 0;
  const stockApiPayloadFromSale: StockApiPayloadFromSale[] = [];

  wholesalerItems.forEach(({ itemId, qrCode, price, lengthInMeters }) => {
    tempPrice += price;

    stockApiPayloadFromSale.push({
      itemId,
      qrCode,
      lengthInMeters,
      lengthInYards: lengthInMeters * 1.09,
      qty: 1,
    });
  });

  totalPrice += tempPrice;
  totalQty += wholesalerItems.length;

  return {
    totalPrice,
    totalQty,
    stockApiPayloadFromSale,
  };
};
