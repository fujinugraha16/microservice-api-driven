import express from "express";

// constants
import { ClothApiPayloadFromSale } from "@fujingr/common";

// helpers
import { retailItemsProcessing } from "../../helpers/retail-items-processing";
import { wholesalerItemsProcessing } from "../../helpers/wholesaler-items-processing";
import { lotItemsProcessing } from "../../helpers/lot-items-processing";

const router = express.Router();

router.post("/api/cloth/item/sale", async (req, res) => {
  const { retailItems, wholesalerItems, lotItems } =
    req.body as ClothApiPayloadFromSale;

  if (retailItems && retailItems.length > 0) {
    await retailItemsProcessing(retailItems);
  }

  if (wholesalerItems && wholesalerItems.length > 0) {
    await wholesalerItemsProcessing(wholesalerItems);
  }

  if (lotItems && lotItems.length > 0) {
    await lotItemsProcessing(lotItems);
  }

  res.status(200).send({ success: true });
});

export { router as itemSaleRouter };
