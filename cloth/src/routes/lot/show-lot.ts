import express from "express";

// middlewares
import { requireAuth, validateParamId } from "@fujingr/common";

// constansta
import { Role } from "@fujingr/common";

// models
import { Lot } from "../../models/lot";

// errors
import { NotFoundError } from "@fujingr/common";

const router = express.Router();

router.get(
  "/api/cloth/lot/show/:id",
  requireAuth([Role.admin, Role.employee]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const lot = await Lot.findById(id);
    if (!lot) {
      throw new NotFoundError();
    }

    res.status(200).send(lot);
  }
);

export { router as showLotRouter };
