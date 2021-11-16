import { ItemPayloadEvent } from "@fujingr/common";

// models
import { Item } from "../models/item";

export const clearItems = async (itemPayloads: ItemPayloadEvent[]) => {
  const itemPromises = itemPayloads.map(async ({ id }) => {
    const item = await Item.findById(id);
    if (item) {
      await Item.findByIdAndRemove(id);
    }
  });
  await Promise.all(itemPromises);
};
