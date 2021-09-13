// helpers
import { DesignTemp } from "./update-designs-payload";

// models
import { Design } from "../models/design";
import { Item } from "../models/item";

export const saveDesignsAndItems = async (
  updatedDesigns: DesignTemp[],
  lotId: string
): Promise<string[]> => {
  let designIds: string[];

  const designPromises = updatedDesigns.map(async (design) => {
    // create design data
    const designDoc = new Design({
      code: design.code,
      color: design.color,
      name: design.name,
      lot: lotId,
    });
    await designDoc.save();

    // create item data
    let items: string[];
    const itemPromises = await design.items.map(async (item) => {
      const itemDoc = new Item({
        lengthInMeters: item.length.meter,
        lengthInYards: item.length.yard,
        qrCode: item.qrCode,
        design: designDoc.id,
      });
      await itemDoc.save();

      return itemDoc.id;
    });
    items = await Promise.all(itemPromises);

    // save items to design
    designDoc.set({ items });
    await designDoc.save();

    return designDoc.id;
  });

  designIds = await Promise.all(designPromises);

  return designIds;
};
