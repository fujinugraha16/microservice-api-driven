// models
import { Item } from "../models/item";

// events
import { ClothApiPayloadFromSale } from "@fujingr/common";

export const retailItemsProcessing = async (
  retailItems: ClothApiPayloadFromSale["retailItems"]
) => {
  const promises = retailItems!.map(async ({ qrCode, lengthInMeters }) => {
    const itemDoc = await Item.findOne({ qrCode });
    if (itemDoc) {
      const totalLengthInMeters = itemDoc.lengthInMeters - lengthInMeters;
      const totalLengthInYards = itemDoc.lengthInYards - lengthInMeters * 0.9;

      if (totalLengthInMeters < 0 || totalLengthInYards < 0) {
        itemDoc.set({
          lengthInMeters: 0,
          lengthInYards: 0,
          sold: true,
        });
        await itemDoc.save();
      } else {
        itemDoc.set({
          lengthInMeters: totalLengthInMeters,
          lengthInYards: totalLengthInYards,
        });
        await itemDoc.save();
      }
    }
  });
  await Promise.all(promises);
};
