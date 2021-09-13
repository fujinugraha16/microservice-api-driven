import express from "express";

// middlewares
import { requireAuth } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Price } from "../../models/price";

const router = express.Router();

router.get(
  "/api/cloth/price/list",
  requireAuth([Role.admin, Role.employee]),
  async (req, res) => {
    const prices = await Price.find();

    res.status(200).send(prices);
  }
);

export { router as listPriceRouter };
