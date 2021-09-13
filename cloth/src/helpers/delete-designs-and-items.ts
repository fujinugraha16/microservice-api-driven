import { Types } from "mongoose";

// models
import { Design } from "../models/design";
import { Item } from "../models/item";

export const deleteDesignsAndItems = async (lotDesigns: Types.ObjectId[]) => {
  const designsPromises = await lotDesigns.map(async (design) => {
    const designDoc = await Design.findById(design).select("items");
    if (designDoc) {
      const itemsPromises = await designDoc.items.map(async (item) => {
        await Item.findByIdAndRemove(item._id);
      });
      await Promise.all(itemsPromises);

      await Design.findByIdAndRemove(design);
    }
  });

  await Promise.all(designsPromises);
};
