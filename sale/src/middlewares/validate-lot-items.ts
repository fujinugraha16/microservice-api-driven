import { Request, Response, NextFunction } from "express";

// errors
import { BadRequestError } from "@fujingr/common";

export const validateLotItems = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lotItems } = req.body;

  if (lotItems && lotItems.length > 0) {
    return next();
  }

  if (typeof lotItems[0] !== "object") {
    throw new BadRequestError("Field 'lotItems' invalid");
  }

  if (
    !["price", "items"].every((key) => Object.keys(lotItems[0]).includes(key))
  ) {
    throw new BadRequestError("Field 'lotItems' invalid");
  }

  if (typeof lotItems[0].items[0] !== "object") {
    throw new BadRequestError("Field 'lotItems' invalid");
  }

  if (
    !["itemId", "qrCode", "lengthInMeters"].every((key) =>
      Object.keys(lotItems[0].items[0]).includes(key)
    )
  ) {
    throw new BadRequestError("Field 'lotItems' invalid");
  }

  next();
};
