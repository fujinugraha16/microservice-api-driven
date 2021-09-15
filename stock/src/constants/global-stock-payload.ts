import { Types } from "mongoose";

export interface GlobalStockPayload {
  stockId: Types.ObjectId | string;
  lengthInMeters: number;
  lengthInYards: number;
  qty: number;
}
