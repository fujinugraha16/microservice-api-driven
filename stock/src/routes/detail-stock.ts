import express from "express";
import axios from "axios";

// middlewares
import { requireAuth, validateParamId } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Stock } from "../models/stock";

// errors
import { NotFoundError } from "@fujingr/common";

const router = express.Router();

router.get(
  "/api/stock/detail/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const stock = await Stock.findById(id).select("detailStocks");
    if (!stock) {
      throw new NotFoundError();
    }

    const promises = stock.detailStocks.map(async (detailStock) => {
      const response = await axios.get(
        `${process.env.CLOTH_API_URI}/api/cloth/item/show/${detailStock}`
      );
      const itemDoc = response.data;

      return itemDoc;
    });

    const updatedStock = {
      detailStocks: await Promise.all(promises),
    };

    res.status(200).send(updatedStock);
  }
);

export { router as detailStockRouter };
