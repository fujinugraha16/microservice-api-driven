import { Request, Response, NextFunction } from "express";

// errors
import { BadRequestError } from "@fujingr/common";

export const validateRetailItems = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { retailItems } = req.body;

  if (retailItems && retailItems.length > 0) {
    return next();
  }

  if (typeof retailItems[0] !== "object") {
    throw new BadRequestError("Field 'retailItems' invalid");
  }

  if (
    !["itemId", "qrCode", "price", "lengthInMeters"].every((key) =>
      Object.keys(retailItems[0]).includes(key)
    )
  ) {
    throw new BadRequestError("Field 'retailItems' invalid");
  }

  next();
};
