import express from "express";

// constants
import { Role } from "@fujingr/common";

// errors
import { NotFoundError } from "@fujingr/common";

// middlewares
import { currentUser, requireAuth, validateParamId } from "@fujingr/common";

// models
import { User } from "../models/user";

const router = express.Router();

router.delete(
  "/api/auth/delete-user/:id",
  currentUser,
  requireAuth([Role.admin]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError();
    }

    await User.findByIdAndRemove(id);

    res.status(204).send({ success: true });
  }
);

export { router as deleteUserRouter };
