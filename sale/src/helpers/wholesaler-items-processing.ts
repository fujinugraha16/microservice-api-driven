// constants
import { WholesalerItemPayload } from "../constants/wholesaler-item-payload";

import { Item } from "../models/item";

// events
import { SaleCreatedEvent, StockPayload } from "@fujingr/common";

export const wholesalerItemsProcessing = async (
  wholesalerItems: WholesalerItemPayload[]
) => {
  let tempPrice = 0;
  let totalPrice = 0;
  let totalQty = 0;
  const notFoundItemsQrCode: string[] = [];
  const stockPayloads: StockPayload[] = [];
  const updatedWholesalerItems: SaleCreatedEvent["data"]["wholesalerItems"] =
    [];

  const promises = wholesalerItems.map(async ({ qrCode, price }) => {
    tempPrice += price;

    const itemDoc = await Item.findOne({ qrCode });
    if (itemDoc) {
      const lengthInMeters = itemDoc.lengthInMeters;
      const lengthInYards = itemDoc.lengthInYards;

      itemDoc.set({
        lengthInMeters: 0,
        lengthInYards: 0,
      });
      await itemDoc.save();

      updatedWholesalerItems.push({ qrCode, version: itemDoc.version! });

      stockPayloads.push({
        itemId: itemDoc.id.toString(),
        lengthInMeters,
        lengthInYards,
        qty: 1,
        version: itemDoc.version!,
      });
    } else {
      notFoundItemsQrCode.push(qrCode);
    }
  });
  await Promise.all(promises);

  totalPrice += tempPrice;
  totalQty += wholesalerItems.length;

  return {
    totalPrice,
    totalQty,
    notFoundItemsQrCode,
    stockPayloads,
    updatedWholesalerItems,
  };
};
