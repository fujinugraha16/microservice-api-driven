import { Types } from "mongoose";

// helpers
import { DesignPayload, ItemPayload } from "@fujingr/common";

// models
import { Design } from "../models/design";
import { Item } from "../models/item";

export const parseLotDesigns = async (
  designIds: string[] | Types.ObjectId[],
  itemIds?: string[] | Types.ObjectId[]
): Promise<DesignPayload[]> => {
  const designPromises = designIds.map(async (designId) => {
    const designDoc = await Design.findById(designId).select(
      "code name color items"
    );

    const itemPromises = designDoc!.items.map(async (item) => {
      const itemDoc = await Item.findById(item).select(
        "lengthInMeters lengthInYards qrCode"
      );

      const updatedItem: ItemPayload = {
        id: itemDoc!.id,
        qrCode: itemDoc!.qrCode,
        lengthInMeters: itemDoc!.lengthInMeters,
        lengthInYards: itemDoc!.lengthInYards,
      };

      return updatedItem;
    });

    const items = await Promise.all(itemPromises);

    const updatedItems = itemIds
      ? items.filter((item) =>
          itemIds
            .map((itemId) => itemId.toString())
            .includes(item.id.toString())
        )
      : items;

    const updatedDesign: DesignPayload = {
      name: designDoc!.name,
      color: designDoc!.color,
      items: updatedItems,
    };

    return updatedDesign;
  });

  return Promise.all(designPromises);
};
