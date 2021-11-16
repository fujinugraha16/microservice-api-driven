import express from "express";

// constants
import { LotCreatedEvent } from "@fujingr/common";

// helpers
import { parseDesignsToItemPayloads } from "@fujingr/common";
import { saveItems } from "../../helpers/save-items";

const router = express.Router();

router.post("/api/sale/lot-in", async (req, res) => {
  const { designs } = req.body as LotCreatedEvent["data"];

  try {
    const itemPayloads = parseDesignsToItemPayloads(designs);
    await saveItems(itemPayloads);

    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ success: false });
  }
});

export { router as lotInRouter };
