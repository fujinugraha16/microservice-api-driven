import express from "express";

// middlewares
import { requireAuth } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Stock } from "../../models/stock";

const router = express.Router();

router.get(
  "/api/stock/list",
  requireAuth([Role.admin, Role.employee]),
  async (req, res) => {
    const stocks = await Stock.find().select("-inOutStocks -detailStocks");

    res.status(200).send(stocks);
  }
);

export { router as listStockRouter };
