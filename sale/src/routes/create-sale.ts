import express, { Request, Response } from "express";
import { body } from "express-validator";
import axios from "axios";

// middlewares
import {
  ClothApiPayloadFromSale,
  requireAuth,
  validateRequest,
} from "@fujingr/common";
import { validateRetailItems } from "../middlewares/validate-retail-items";
import { validateWholeSalerItems } from "../middlewares/validate-wholesaler-items";
import { validateLotItems } from "../middlewares/validate-lot-items";

// constants
import { Role } from "@fujingr/common";

// models
import { Sale, SaleAttrs } from "../models/sale";

// errors
import { BadRequestError } from "@fujingr/common";
import { retailItemsProcessing } from "../helpers/retail-items-processing";
import { wholesalerItemsProcessing } from "../helpers/wholesaler-items-processing";
import { lotItemsProcessing } from "../helpers/lot-items-processing";

// events
import { StockApiPayloadFromSale } from "@fujingr/common";

const router = express.Router();

router.post(
  "/api/sale/create",
  requireAuth([Role.admin, Role.employee]),
  body(["code", "customerName"]).notEmpty().withMessage("Must be filled"),
  body(["retailItems", "wholesalerItems", "lotItems"])
    .optional()
    .isArray()
    .withMessage("Must be array"),
  body(["totalPrice", "totalQty"])
    .isInt({ gt: 0 })
    .withMessage("Must be numeric and greater than 0")
    .notEmpty()
    .withMessage("Must be filled"),
  validateRequest,
  validateRetailItems,
  validateWholeSalerItems,
  validateLotItems,
  async (req: Request, res: Response) => {
    const { code, customerName, retailItems, wholesalerItems, lotItems } =
      req.body as SaleAttrs;
    const stockApiPayloadFromSale: StockApiPayloadFromSale[] = [];
    let totalPrice = 0;
    let totalQty = 0;

    const existingSale = await Sale.findOne({ code });
    if (existingSale) {
      throw new BadRequestError("Sale already exist");
    }

    if (retailItems && retailItems.length > 0) {
      const retailItemsPrx = await retailItemsProcessing(retailItems);

      totalPrice += retailItemsPrx.totalPrice;
      totalQty += retailItemsPrx.totalQty;
      stockApiPayloadFromSale.push(...retailItemsPrx.stockApiPayloadFromSale);
    }

    if (wholesalerItems && wholesalerItems.length > 0) {
      const wholesalerItemsPrx = await wholesalerItemsProcessing(
        wholesalerItems
      );

      totalPrice += wholesalerItemsPrx.totalPrice;
      totalQty += wholesalerItemsPrx.totalQty;
      stockApiPayloadFromSale.push(
        ...wholesalerItemsPrx.stockApiPayloadFromSale
      );
    }

    if (lotItems && lotItems.length > 0) {
      const lotItemsPrx = await lotItemsProcessing(lotItems);

      totalPrice += lotItemsPrx.totalPrice;
      totalQty += lotItemsPrx.totalQty;
      stockApiPayloadFromSale.push(...lotItemsPrx.stockApiPayloadFromSale);
    }

    const sale = new Sale({
      code,
      customerName,
      retailItems: retailItems?.map(({ qrCode, lengthInMeters, price }) => ({
        price,
        qrCode,
        lengthInMeters,
      })),
      wholesalerItems: wholesalerItems?.map(({ qrCode, price }) => ({
        qrCode,
        price,
      })),
      lotItems: lotItems?.map(({ price, items }) => ({
        price,
        items: items.map(({ qrCode }) => qrCode),
      })),
      totalPrice,
      totalQty,
    });
    await sale.save();

    // send data to stock api
    await axios.post(`${process.env.STOCK_API_URI}/api/stock/sale`, {
      stockApiPayloadFromSale,
    });

    const clothApiPayloadFromSale: ClothApiPayloadFromSale = {
      retailItems: retailItems?.map(({ qrCode, lengthInMeters }) => ({
        qrCode,
        lengthInMeters,
      })),
      wholesalerItems: wholesalerItems?.map(({ qrCode }) => qrCode),
      lotItems: lotItems
        ?.map(({ items }) => items.map(({ qrCode }) => qrCode))
        .flat(),
    };
    await axios.post(
      `${process.env.CLOTH_API_URI}/api/cloth/sale`,
      clothApiPayloadFromSale
    );

    res.status(201).send(sale);
  }
);

export { router as createSaleRouter };
