import express from "express";

// models
import { Item } from "../../models/item";

const router = express.Router();

router.get("/api/cloth/item/show/:id", async (req, res) => {
  const { id } = req.params;

  const item = await Item.findById(id);

  res.status(200).send(item);
});

export { router as showItemRouter };
