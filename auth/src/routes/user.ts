import express from "express";

// errors
import { NotFoundError } from "@fujingr/common";

// middlewares
import { requireAuth, currentUser, validateParamId } from "@fujingr/common";

// models
import { User } from "../models/user";

// contansts
import { Role } from "@fujingr/common";

const router = express.Router();

router.get(
  "/api/auth/user/:id",
  currentUser,
  requireAuth([Role.admin]),
  validateParamId,
  async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError();
    }

    res.status(200).send(user);
  }
);

export { router as userRouter };
