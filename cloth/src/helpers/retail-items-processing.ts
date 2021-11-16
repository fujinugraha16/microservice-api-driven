// models
import { Item } from "../models/item";

// events
import { SaleCreatedEvent } from "@fujingr/common";

export const retailItemsProcessing = async (
  retailItems: SaleCreatedEvent["data"]["retailItems"]
) => {
  const notFoundQrCodeWithVersion: string[] = [];

  const promises = retailItems!.map(
    async ({ qrCode, lengthInMeters, lengthInYards, version }) => {
      const itemDoc = await Item.findOne({ qrCode, version: version - 1 });
      if (itemDoc) {
        const totalLengthInMeters = itemDoc.lengthInMeters - lengthInMeters;
        const totalLengthInYards = itemDoc.lengthInYards - lengthInYards;

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
      } else {
        // if item has been updated
        const itemDocHasBeenUpdated = await Item.findOne({ qrCode, version });

        if (!itemDocHasBeenUpdated) {
          // or maybe has been deleted or not defined
          const checkAvailabilityItem = await Item.findOne({ qrCode });
          if (checkAvailabilityItem) {
            console.log(
              `Item with qrCode: '${qrCode}' with version: ${
                version - 1
              } not found`
            );
            notFoundQrCodeWithVersion.push(qrCode);
          }
        }
      }
    }
  );
  await Promise.all(promises);

  return { notFoundQrCodeWithVersion };
};
