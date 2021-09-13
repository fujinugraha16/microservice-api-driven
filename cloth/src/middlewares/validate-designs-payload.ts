import { Request, Response, NextFunction } from "express";

// errors
import { BadRequestError } from "@fujingr/common";

export const validateDesignsPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { designs } = req.body;

  if (typeof designs[0] !== "object") {
    throw new BadRequestError("Field 'designs' invalid");
  }

  if (
    !["code", "name", "color", "items"].every((key) =>
      Object.keys(designs[0]).includes(key)
    )
  ) {
    throw new BadRequestError("Field 'designs' invalid");
  }

  if (typeof designs[0].items[0] !== "object") {
    throw new BadRequestError("Field 'designs' invalid");
  }

  if (
    !["length", "qty"].every((key) =>
      Object.keys(designs[0].items[0]).includes(key)
    )
  ) {
    throw new BadRequestError("Field 'designs' invalid");
  }

  next();
};
