import express from "express";

// constants
import { SaleCreatedEvent } from "@fujingr/common";

// helpers
import { retailItemsProcessing } from "../../helpers/retail-items-processing";
import { wholesalerItemsProcessing } from "../../helpers/wholesaler-items-processing";
import { lotItemsProcessing } from "../../helpers/lot-items-processing";

const router = express.Router();

router.post("/api/cloth/item/sale", async (req, res) => {
  const { retailItems, wholesalerItems, lotItems } =
    req.body as SaleCreatedEvent["data"];
  const notFoundQrCodeWithVersion: string[] = [];

  if (retailItems && retailItems.length > 0) {
    const retailItemsPrx = await retailItemsProcessing(retailItems);
    notFoundQrCodeWithVersion.push(...retailItemsPrx.notFoundQrCodeWithVersion);
  }

  if (wholesalerItems && wholesalerItems.length > 0) {
    const wholesalerItemsPrx = await wholesalerItemsProcessing(wholesalerItems);
    notFoundQrCodeWithVersion.push(
      ...wholesalerItemsPrx.notFoundQrCodeWithVersion
    );
  }

  if (lotItems && lotItems.length > 0) {
    const lotItemsPrx = await lotItemsProcessing(lotItems);
    notFoundQrCodeWithVersion.push(...lotItemsPrx.notFoundQrCodeWithVersion);
  }

  let success = false;
  if (notFoundQrCodeWithVersion.length === 0) {
    success = true;
  }

  res.status(200).send({ success });
});

export { router as itemSaleRouter };
