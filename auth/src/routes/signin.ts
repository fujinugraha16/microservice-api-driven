import express, { Request, Response } from "express";
import { body } from "express-validator";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

// models
import { User } from "../models/user";

// errors
import { BadRequestError } from "@fujingr/common";

// middlewares
import { validateRequest } from "@fujingr/common";

const router = express.Router();

router.post(
  "/api/auth/signin",
  body("username").notEmpty().withMessage("Must be filled"),
  body("password").notEmpty().withMessage("Must be valid"),
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw new BadRequestError("User invalid or not found.");
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestError("Password not match");
    }

    const userJwt = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
