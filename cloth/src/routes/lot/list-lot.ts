import express from "express";

// middlewares
import { requireAuth } from "@fujingr/common";

// constants
import { Role } from "@fujingr/common";

// models
import { Lot } from "../../models/lot";

const router = express.Router();

router.get(
  "/api/cloth/lot/list",
  requireAuth([Role.admin, Role.employee]),
  async (req, res) => {
    const lots = await Lot.find();

    res.status(200).send(lots);
  }
);

export { router as listLotRouter };
