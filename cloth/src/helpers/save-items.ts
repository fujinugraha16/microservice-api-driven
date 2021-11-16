import { Types } from "mongoose";

// helpers
import { DesignTemp } from "./update-designs-payload";

// models
import { Design } from "../models/design";
import { Item } from "../models/item";

type ID = Types.ObjectId;

export const saveItems = async (updatedDesigns: DesignTemp[]) => {
  const itemIds: ID[] = [];
  const designPromises = updatedDesigns.map(async (design) => {
    const designDoc = await Design.findOne({ code: design.code });
    if (designDoc) {
      // create item data
      let items: ID[];
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
      designDoc.items.push(...items);
      await designDoc.save();

      itemIds.push(...items);
    }
  });

  await Promise.all(designPromises);

  return itemIds;
};
