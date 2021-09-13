import express from "express";

// middlewares
import { requireAuth, currentUser } from "@fujingr/common";

// contants
import { Role } from "@fujingr/common";

// models
import { User } from "../models/user";

const router = express.Router();

router.get(
  "/api/auth/users",
  currentUser,
  requireAuth([Role.admin]),
  async (req, res) => {
    const users = await User.find().ne("role", Role.superuser);

    res.send(users);
  }
);

export { router as usersRouter };
