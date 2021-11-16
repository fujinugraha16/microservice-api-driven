import express from "express";

// middlewares
import { requireAuth } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Sale } from "../../models/sale";

const router = express.Router();

router.get(
  "/api/sale/list",
  requireAuth([Role.admin, Role.employee]),
  async (req, res) => {
    const sales = await Sale.find();

    res.status(200).send(sales);
  }
);

export { router as listSaleRouter };
