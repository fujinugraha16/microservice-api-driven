// models
import { Item } from "../models/item";

// events
import { SaleCreatedEvent } from "@fujingr/common";

export const lotItemsProcessing = async (
  lotItems: SaleCreatedEvent["data"]["lotItems"]
) => {
  const notFoundQrCodeWithVersion: string[] = [];

  const promises = lotItems!.map(async ({ qrCode, version }) => {
    const itemDoc = await Item.findOne({ qrCode, version: version - 1 });
    if (itemDoc) {
      itemDoc.set({
        lengthInMeters: 0,
        lengthInYards: 0,
        sold: true,
      });
      await itemDoc.save();
    } else {
      // item has been updated
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
  });
  await Promise.all(promises);

  return { notFoundQrCodeWithVersion };
};
