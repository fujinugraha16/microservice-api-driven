import express, { Request, Response } from "express";
import { body } from "express-validator";
import { hashSync } from "bcrypt";

// middlewares
import { validateRequest, currentUser, requireAuth } from "@fujingr/common";

// models
import { User, UserAttrs } from "../models/user";

// errors
import { BadRequestError } from "@fujingr/common";

// constanta
import { Role } from "@fujingr/common";

const router = express.Router();

router.post(
  // path
  "/api/auth/create-user",
  // middleware current user
  currentUser,
  // middleware require auth
  requireAuth([Role.admin]),
  // input validation
  body(["username", "name", "role"])
    .trim()
    .notEmpty()
    .withMessage("Must be filled"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password min 6 characters"),
  body("email").optional().isEmail().withMessage("Must be valid"),
  // middleware validation
  validateRequest,
  // main func
  async (req: Request, res: Response) => {
    const {
      name,
      password,
      role,
      username,
      email,
      address,
      avatar,
      phoneNumber,
    } = req.body as UserAttrs;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    const hashedPw = hashSync(password, 12);

    const user = new User({
      name,
      password: hashedPw,
      role: role.toUpperCase(),
      username,
      email,
      address,
      avatar,
      phoneNumber,
    });
    await user.save();

    res.status(201).send(user);
  }
);

router.post(
  "/api/auth/create-super-user",
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password min 6 characters"),
  validateRequest,
  async (req, res) => {
    const { password } = req.body;

    const existingSuperUser = await User.findOne({ username: "superuser" });
    if (existingSuperUser) {
      throw new BadRequestError("Super user already exist");
    }

    const hashedPw = hashSync(password, 12);
    const superUser = new User({
      name: "Super User",
      password: hashedPw,
      role: Role.superuser,
      username: "superuser",
    });
    await superUser.save();

    res.status(201).send(superUser);
  }
);

export { router as createUserRouter };
