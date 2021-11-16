// constants
import { RetailItemPayload } from "../constants/retail-item-payload";

// models
import { Item } from "../models/item";

// events
import { SaleCreatedEvent, StockPayload } from "@fujingr/common";

export const retailItemsProcessing = async (
  retailItems: RetailItemPayload[]
) => {
  let tempPrice = 0;
  let totalPrice = 0;
  let totalQty = 0;
  const notFoundItemsQrCode: string[] = [];
  const stockPayloads: StockPayload[] = [];
  const updatedRetailItems: SaleCreatedEvent["data"]["retailItems"] = [];

  const promises = retailItems.map(
    async ({ qrCode, price, lengthInMeters }) => {
      let qty = 0;
      tempPrice += price;

      const itemDoc = await Item.findOne({ qrCode });
      if (itemDoc) {
        const totalLengthInMeters = itemDoc.lengthInMeters - lengthInMeters;
        const totalLengthInYards =
          (itemDoc.lengthInMeters - lengthInMeters) * 1.09;

        if (totalLengthInYards < 0) {
          itemDoc.set({
            lengthInMeters: 0,
            lengthInYards: 0,
          });
          await itemDoc.save();

          qty = 1;
        } else {
          itemDoc.set({
            lengthInMeters: totalLengthInMeters,
            lengthInYards: totalLengthInYards,
          });
          await itemDoc.save();
        }

        updatedRetailItems.push({
          qrCode,
          lengthInMeters,
          lengthInYards: lengthInMeters * 1.09,
          version: itemDoc.version!,
        });

        stockPayloads.push({
          itemId: itemDoc.id.toString(),
          lengthInMeters,
          lengthInYards: lengthInMeters * 1.09,
          qty,
          version: itemDoc.version!,
        });
      } else {
        notFoundItemsQrCode.push(qrCode);
      }
    }
  );
  await Promise.all(promises);

  totalPrice += tempPrice;
  totalQty += retailItems.length;

  return {
    totalPrice,
    totalQty,
    notFoundItemsQrCode,
    stockPayloads,
    updatedRetailItems,
  };
};
