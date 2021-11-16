import express from "express";

// models
import { Item } from "../../models/item";

const router = express.Router();

router.get("/api/cloth/item/show/:qrCode", async (req, res) => {
  const { qrCode } = req.params;

  const item = await Item.findOne({ qrCode });

  res.status(200).send(item);
});

export { router as showItemRouter };
