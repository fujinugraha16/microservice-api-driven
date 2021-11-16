import { Request, Response, NextFunction } from "express";

// errors
import { BadRequestError } from "@fujingr/common";

export const validateWholeSalerItems = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { wholesalerItems } = req.body;

  if (!wholesalerItems || wholesalerItems.length === 0) {
    return next();
  }

  if (typeof wholesalerItems[0] !== "object") {
    throw new BadRequestError("Field 'wholesalerItems' invalid");
  }

  if (
    !["qrCode", "price"].every((key) =>
      Object.keys(wholesalerItems[0]).includes(key)
    )
  ) {
    throw new BadRequestError("Field 'wholesalerItems' invalid");
  }

  next();
};
