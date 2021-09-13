interface ItemPayload {
  length: number;
  qty: number;
}

export interface DesignPayload {
  code: string;
  name: string;
  color: string;
  items: ItemPayload[];
}
