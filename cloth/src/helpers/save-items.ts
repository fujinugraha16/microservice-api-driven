// helpers
import { DesignTemp } from "./update-designs-payload";

// models
import { Design } from "../models/design";
import { Item } from "../models/item";

export const saveItems = async (updatedDesigns: DesignTemp[]) => {
  const designPromises = updatedDesigns.map(async (design) => {
    const designDoc = await Design.findOne({ code: design.code });
    if (designDoc) {
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
    }
  });

  await Promise.all(designPromises);
};
