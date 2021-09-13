import express from "express";

// middlewares
import { requireAuth, validateParamId } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Price } from "../../models/price";

// errors
import { NotFoundError } from "@fujingr/common";

const router = express.Router();

router.get(
  "/api/cloth/price/show/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const price = await Price.findById(id);
    if (!price) {
      throw new NotFoundError();
    }

    res.status(200).send(price);
  }
);

export { router as showPriceRouter };
