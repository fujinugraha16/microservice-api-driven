// models
import { Item } from "../models/item";

// events
import { SaleCreatedEvent } from "@fujingr/common";

export const wholesalerItemsProcessing = async (
  wholesalerItems: SaleCreatedEvent["data"]["wholesalerItems"]
) => {
  const notFoundQrCodeWithVersion: string[] = [];

  const promises = wholesalerItems!.map(async ({ qrCode, version }) => {
    const itemDoc = await Item.findOne({ qrCode, version: version - 1 });
    if (itemDoc) {
      itemDoc.set({
        lengthInMeters: 0,
        lengthInYards: 0,
        sold: true,
      });
      await itemDoc.save();
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
  });
  await Promise.all(promises);

  return { notFoundQrCodeWithVersion };
};
