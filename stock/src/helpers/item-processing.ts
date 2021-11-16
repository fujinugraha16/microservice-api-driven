import { Item } from "../models/item";

interface ItemPayload {
  itemId: string;
  lengthInMeters: number;
  lengthInYards: number;
  version: number;
}

export const itemProcessing = async (itemPayload: ItemPayload) => {
  const { itemId, lengthInMeters, lengthInYards, version } = itemPayload;
  const notFoundItemIdsWithVersion: string[] = [];
  let sold = false;

  const itemDoc = await Item.findOne({ _id: itemId, version: version - 1 });
  if (itemDoc) {
    const totalLengthInMeters = itemDoc.lengthInMeters - lengthInMeters;
    const totalLengthInYards = itemDoc.lengthInYards - lengthInYards;

    if (totalLengthInMeters < 0 || totalLengthInYards < 0) {
      itemDoc.set({
        lengthInMeters: 0,
        lengthInYards: 0,
      });
      await itemDoc.save();

      sold = true;
    } else {
      itemDoc.set({
        lengthInMeters: totalLengthInMeters,
        lengthInYards: totalLengthInYards,
      });
      await itemDoc.save();
    }
  } else {
    // item doc has been updated
    const itemDocHasBeenUpdated = await Item.findOne({ _id: itemId, version });

    // or maybe has been deleted
    if (!itemDocHasBeenUpdated) {
      const checkAvailabilityItem = await Item.findById(itemId);
      if (checkAvailabilityItem) {
        console.log(
          `Item with id: '${itemId}' with version: ${version - 1} not found`
        );
        notFoundItemIdsWithVersion.push(itemId);
      }
    }
  }

  return { sold, qrCode: itemDoc?.qrCode || null, notFoundItemIdsWithVersion };
};
