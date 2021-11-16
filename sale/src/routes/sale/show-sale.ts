import express from "express";

// middlewares
import { requireAuth, validateParamId } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Sale } from "../../models/sale";

// errors
import { NotFoundError } from "@fujingr/common";

const router = express.Router();

router.get(
  "/api/sale/show/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const sale = await Sale.findById(id);
    if (!sale) {
      throw new NotFoundError();
    }

    res.status(200).send(sale);
  }
);

export { router as showSaleRouter };
