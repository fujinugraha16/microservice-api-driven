export interface LotItemPayload {
  price: number;
  items: {
    itemId: string;
    qrCode: string;
    lengthInMeters: number;
  }[];
}
