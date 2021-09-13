import { DesignPayload } from "../constants/designs-payload";

interface ItemTemp {
  length: {
    yard: number;
    meter: number;
  };
  qrCode: string;
}

export interface DesignTemp {
  code: string;
  name: string;
  color: string;
  items: ItemTemp[];
}

export const updateDesignsPayload = (
  designs: DesignPayload[],
  inputSequence: number
): DesignTemp[] => {
  const updatedDesigns: DesignTemp[] = [];

  designs.map((design) => {
    const updatedItems: ItemTemp[] = [];
    let indexItem = 0;

    design.items.forEach((item) => {
      if (item.qty > 1) {
        for (let i = 1 + indexItem; i <= item.qty + indexItem; i++) {
          updatedItems.push({
            length: {
              yard: item.length,
              meter: item.length * 0.91,
            },
            qrCode: `${design.code}-${inputSequence}-${i}`,
          });
        }
      } else if (item.qty === 1) {
        updatedItems.push({
          length: {
            yard: item.length,
            meter: item.length * 0.91,
          },
          qrCode: `${design.code}-${inputSequence}-${item.qty + indexItem}`,
        });
      }

      indexItem += item.qty;
    });

    updatedDesigns.push({
      code: design.code,
      color: design.color,
      name: design.name,
      items: updatedItems,
    });
  });

  return updatedDesigns;
};
