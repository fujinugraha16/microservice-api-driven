export interface ItemPayloadEvent {
  id: string;
  qrCode: string;
  lengthInMeters: number;
  lengthInYards: number;
}

export interface DesignPayloadEvent {
  name: string;
  color: string;
  items: ItemPayloadEvent[];
}
