// models
import { Item } from "../models/item";

// events
import { ClothApiPayloadFromSale } from "@fujingr/common";

export const lotItemsProcessing = async (
  lotItems: ClothApiPayloadFromSale["lotItems"]
) => {
  const promises = lotItems!.map(async (qrCode) => {
    const itemDoc = await Item.findOne({ qrCode });
    if (itemDoc) {
      itemDoc.set({
        lengthInMeters: 0,
        lengthInYards: 0,
        sold: true,
      });
      await itemDoc.save();
    }
  });
  await Promise.all(promises);
};
