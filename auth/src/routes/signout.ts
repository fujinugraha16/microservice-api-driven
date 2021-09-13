import express from "express";

const router = express.Router();

router.get("/api/auth/signout", (req, res) => {
  req.session = null;

  res.send({ success: true });
});

export { router as signoutRouter };
