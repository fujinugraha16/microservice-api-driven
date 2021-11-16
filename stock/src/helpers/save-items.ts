import { ItemPayloadEvent } from "@fujingr/common";

// models
import { Item } from "../models/item";

export const saveItems = async (itemPayloads: ItemPayloadEvent[]) => {
  const itemPromises = itemPayloads.map(
    async ({ id, qrCode, lengthInMeters, lengthInYards }) => {
      const item = new Item({
        _id: id,
        qrCode,
        lengthInMeters,
        lengthInYards,
      });
      await item.save();
    }
  );
  await Promise.all(itemPromises);
};
