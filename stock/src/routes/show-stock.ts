import express from "express";

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
  "/api/stock/show/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const stock = await Stock.findById(id).select("-inOutStocks -detailStocks");
    if (!stock) {
      throw new NotFoundError();
    }

    res.status(200).send(stock);
  }
);

export { router as showStockRouter };
